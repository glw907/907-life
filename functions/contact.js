/**
 * Cloudflare Pages Function: Contact Form Handler
 *
 * Handles POST requests to /contact
 * - Validates Cloudflare Turnstile token
 * - Sends email via MailChannels (Cloudflare's email API)
 * - Returns JSON response
 *
 * Environment variables required:
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key
 * - CONTACT_EMAIL: Destination email (geoff@907.life)
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // Set CORS headers for JSON response
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    // 1. Parse form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const turnstileToken = formData.get('cf-turnstile-response');

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers }
      );
    }

    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: 'Turnstile validation required' }),
        { status: 400, headers }
      );
    }

    // 2. Validate Turnstile token
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({ error: 'Turnstile validation failed. Please try again.' }),
        { status: 400, headers }
      );
    }

    // 3. Send email via MailChannels
    const emailSent = await sendEmailViaMailChannels({
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[907.life] ${subject}`,
      name: name,
      senderEmail: email,
      message: message,
    });

    if (!emailSent) {
      return new Response(
        JSON.stringify({ error: 'Failed to send email. Please try again later.' }),
        { status: 500, headers }
      );
    }

    // 4. Return success
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers }
    );
  }
}

/**
 * Send email via MailChannels API
 * MailChannels is free for Cloudflare Workers/Pages
 *
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} - Success status
 */
async function sendEmailViaMailChannels(params) {
  const {
    to,
    replyTo,
    subject,
    name,
    senderEmail,
    message,
  } = params;

  try {
    const emailBody = `From: ${name} <${senderEmail}>

Message:
${message}

---
Sent via 907.life contact form`;

    const emailRequest = {
      personalizations: [
        {
          to: [{ email: to }],
          reply_to: { email: replyTo, name: name },
        },
      ],
      from: {
        email: 'noreply@907.life',
        name: '907.life Contact Form',
      },
      subject: subject,
      content: [
        {
          type: 'text/plain',
          value: emailBody,
        },
      ],
    };

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailRequest),
    });

    if (!response.ok) {
      console.error('MailChannels error:', response.status, await response.text());
      return false;
    }

    return true;

  } catch (error) {
    console.error('MailChannels send error:', error);
    return false;
  }
}
