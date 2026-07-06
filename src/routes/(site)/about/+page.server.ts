// The about page: a static route, not cairn content (Task 3's line: "the about page stays a static
// route"). Not prerendered, since its contact-form action needs live env at request time (Turnstile
// and the SEND_EMAIL binding); the (site) layout defaults to prerender=true, so this route opts out.
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { createMimeMessage } from 'mimetext';
import { cairn, siteConfig } from '$theme/cairn.config';

export const prerender = false;

export const load: PageServerLoad = () => ({});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Confirm the widget's response token with Cloudflare's siteverify endpoint. */
async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export const actions: Actions = {
  default: async ({ request, platform, getClientAddress }) => {
    const fd = await request.formData();
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    const token = String(fd.get('cf-turnstile-response') ?? '');
    const values = { name, email, message };

    if (!name || !email || !message) {
      return fail(400, { error: 'All fields are required.', values });
    }
    if (!EMAIL_RE.test(email)) {
      return fail(400, { error: 'Enter a valid email address.', values });
    }

    // Turnstile skips in dev, where no TURNSTILE_SECRET_KEY binding is configured.
    const secret = platform?.env?.TURNSTILE_SECRET_KEY;
    if (secret) {
      const valid = await verifyTurnstile(token, getClientAddress(), secret);
      if (!valid) return fail(400, { error: 'Spam check failed. Please try again.', values });
    }

    const contactEmail = platform?.env?.CONTACT_EMAIL;
    const sendEmail = platform?.env?.SEND_EMAIL;
    if (!contactEmail || !sendEmail) {
      return fail(500, { error: 'Mail is not configured.' });
    }

    const msg = createMimeMessage();
    msg.setSender({ name: siteConfig.author ?? siteConfig.siteName, addr: cairn.email.from });
    msg.setRecipient(contactEmail);
    msg.setSubject(`Contact from ${name}`);
    msg.addMessage({ contentType: 'text/plain', data: `From: ${name} <${email}>\n\n${message}` });

    // SEND_EMAIL carries a fixed destination_address (an Email Routing binding, not the unrestricted
    // Email Sending binding EMAIL uses for magic links), so it sends a raw MIME message through
    // `cloudflare:email` rather than the plain `{ to, from, subject, html, text }` shape.
    const { EmailMessage } = await import('cloudflare:email');
    await sendEmail.send(new EmailMessage(cairn.email.from, contactEmail, msg.asRaw()));

    return { success: true };
  },
};
