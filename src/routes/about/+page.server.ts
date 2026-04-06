import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

export const load: PageServerLoad = () => ({});

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip })
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

export const actions: Actions = {
  default: async ({ request, platform, getClientAddress }) => {
    const fd = await request.formData();
    const name    = String(fd.get('name')    ?? '').trim();
    const email   = String(fd.get('email')   ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    const token   = String(fd.get('cf-turnstile-response') ?? '');

    const values = { name, email, message };

    if (!name || !email || !message) {
      return fail(400, { error: 'All fields are required.', values });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { error: 'Please enter a valid email address.', values });
    }

    // Turnstile skipped in dev (no TURNSTILE_SECRET_KEY env binding)
    const secret = platform?.env?.TURNSTILE_SECRET_KEY;
    if (secret) {
      const valid = await verifyTurnstile(token, getClientAddress(), secret);
      if (!valid) {
        return fail(400, { error: 'Spam check failed. Please try again.', values });
      }
    }

    const contactEmail = platform?.env?.CONTACT_EMAIL;
    const sendEmail    = platform?.env?.SEND_EMAIL;

    if (!contactEmail || !sendEmail) {
      return fail(500, { error: 'Mail service not configured.' });
    }

    const msg = createMimeMessage();
    msg.setSender({ name: 'Contact Form', addr: 'noreply@907.life' });
    msg.setRecipient(contactEmail);
    msg.setSubject(`Contact from ${name}`);
    msg.addMessage({ contentType: 'text/plain', data: `From: ${name} <${email}>\n\n${message}` });

    await sendEmail.send(new EmailMessage('noreply@907.life', contactEmail, msg.asRaw()));

    return { success: true };
  }
};
