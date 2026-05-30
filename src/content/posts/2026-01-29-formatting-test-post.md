---
title: Formatting Test Post
date: '2026-01-29'
description: A comprehensive test of all available Markdown formatting elements
tags:
  - test
draft: false
---
This post is a comprehensive **Markdown formatting test** intended to reveal how a Micro.blog theme renders common elements, edge cases, and inline HTML. It contains both typical content and awkward cases.

## Headings

# H1: Heading 1
## H2: Heading 2
### H3: Heading 3
#### H4: Heading 4
##### H5: Heading 5
###### H6: Heading 6

## Paragraphs & inline text

A normal paragraph with **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code`.

Hard line break (two spaces at end of line).
This should appear on the next line.

## Links

- Plain URL: https://micro.blog
- Standard link: [Micro.blog](https://micro.blog)

## Images

![Placeholder](https://via.placeholder.com/640x360.png?text=Micro.blog+Theme+Test)

## Blockquotes

> This is a blockquote.
>
> With multiple paragraphs.

## Lists

- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Second item

- [ ] Task unchecked
- [x] Task checked

## Tables

| Column A | Column B |
|---------:|:---------|
| Right    | Left     |

## Code

Inline code: `const x = 42;`

```js
function hello() {
  console.log("Hello, world");
}
```

## Footnotes

Here is a footnote reference.[^1]

[^1]: This is the footnote text.

## HTML passthrough

<details>
  <summary>Expandable</summary>
  <p>Hidden content.</p>
</details>

---

End of test.

<!-- cairn admin save smoke: 2026-05-30 -->
