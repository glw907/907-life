---
title: "Understanding epoll"
date: 2026-04-06
draft: false
tags: ["linux", "systems", "networking"]
description: "How Linux's epoll solves the C10K problem, and why select() wasn't enough."
---

In 1999, Dan Kegel wrote a document called *The C10K Problem*. The question was simple: how do you handle 10,000 simultaneous network connections on a single machine? The answer required rethinking how operating systems notify applications about I/O events.

The result, eventually, was `epoll`.

## The problem with select()

The traditional approach used `select()` or `poll()`. Both work by passing the kernel a list of file descriptors to watch, waiting for one to become ready, then scanning the list yourself to find which one fired.

```c
fd_set readfds;
FD_ZERO(&readfds);
FD_SET(sockfd, &readfds);

int ready = select(sockfd + 1, &readfds, NULL, NULL, &timeout);
if (ready > 0 && FD_ISSET(sockfd, &readfds)) {
    // handle it
}
```

This breaks down at scale for two reasons:

| Problem | select() | poll() | epoll |
|---------|----------|--------|-------|
| FD limit | 1024 (FD_SETSIZE) | Unlimited | Unlimited |
| Scan on return | Full list O(n) | Full list O(n) | Only ready FDs O(1) |
| Kernel copy per call | Yes, full list | Yes, full list | No, registered once |
| Level vs edge trigger | Level only | Level only | Both |

Each `select()` call copies your entire watched set into the kernel, then copies it back. With 10,000 connections, most idle, you're copying and scanning 10,000 entries every time *any single socket* becomes readable. The kernel does O(n) work. Your userspace does O(n) work. None of it scales.

## How epoll works

`epoll` separates registration from waiting. You create an epoll instance, register interest in file descriptors once, then call `epoll_wait()` repeatedly. The kernel only returns the file descriptors that are actually ready.

```c
// Create the epoll instance
int epfd = epoll_create1(0);

// Register a socket — done once, not per-wait
struct epoll_event ev;
ev.events = EPOLLIN | EPOLLET;  // readable, edge-triggered
ev.data.fd = sockfd;
epoll_ctl(epfd, EPOLL_CTL_ADD, sockfd, &ev);

// Wait — returns only ready events
struct epoll_event events[MAX_EVENTS];
int nready = epoll_wait(epfd, events, MAX_EVENTS, timeout_ms);

for (int i = 0; i < nready; i++) {
    handle_event(events[i].data.fd);
}
```

The kernel maintains a red-black tree of watched descriptors and an internal ready list. When a descriptor becomes ready, the kernel adds it to the ready list directly. `epoll_wait()` drains that list. No scanning, no copying the full set.

## Edge-triggered vs level-triggered

This is where most epoll bugs live.

**Level-triggered (LT):** default. `epoll_wait()` returns as long as the condition holds. If you don't read all available data, it fires again next call. Easier to use correctly.

**Edge-triggered (ET):** fires once when the state *changes*. If 4KB arrives and you only read 1KB, you won't hear about the remaining 3KB until more data arrives. You must read in a loop until `EAGAIN`.

```c
// Edge-triggered: must drain completely
while (1) {
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n < 0) {
        if (errno == EAGAIN || errno == EWOULDBLOCK)
            break;  // all data read
        // real error
        break;
    }
    if (n == 0)
        break;  // EOF
    process(buf, n);
}
```

The tradeoff:

| Mode | Behavior | Risk | Use when |
|------|----------|------|----------|
| Level-triggered | Fires while condition holds | None if you process partially | Default choice |
| Edge-triggered | Fires once on transition | Data starvation if you miss a read | High-throughput, non-blocking I/O |

## Practical limits

A few things that trip people up:

- [x] Regular files don't work with epoll (only sockets, pipes, and devices)
- [x] `epoll_wait()` with timeout `-1` blocks indefinitely
- [ ] `EPOLLONESHOT` removes the FD after one event; you must re-arm it
- [ ] `EPOLLRDHUP` detects peer shutdown without reading, useful for connection tracking

### File descriptor exhaustion

The OS limit on open file descriptors is a separate constraint from epoll's scalability. Check and raise it:

```bash
# Current limit (per process)
ulimit -n

# Raise it for this session
ulimit -n 65536

# Permanent — /etc/security/limits.conf
*    soft    nofile    65536
*    hard    nofile    65536
```

### The thundering herd

With multiple threads calling `epoll_wait()` on the same epoll fd, all threads wake when any event fires. Use `EPOLLEXCLUSIVE` (Linux 4.5+) to deliver each event to exactly one waiter:

```c
ev.events = EPOLLIN | EPOLLEXCLUSIVE;
epoll_ctl(epfd, EPOLL_CTL_ADD, sockfd, &ev);
```

## When not to use epoll

`epoll` is Linux-specific. For portable code, `kqueue` (BSD/macOS) and IOCP (Windows) solve the same problem differently. `libuv` and `libevent` abstract over all three.

If you're writing something that needs to run on Linux only and you control the deployment environment, `epoll` directly is the right tool. Otherwise, reach for a library.

> The purpose of abstracting over epoll, kqueue, and IOCP is not to pretend they're the same. They're not. The purpose is to let you change your mind later.

The C10K problem is solved. The C10M problem (10 million connections) is harder, and it involves NUMA topology, interrupt affinity, and kernel bypass (DPDK, io_uring). But that's another article.
