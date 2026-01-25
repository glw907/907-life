/**
 * Cloudflare Worker: 907.life
 *
 * Serves static assets from Hugo build and handles POST /contact
 * for contact form submissions.
 *
 * Environment variables required (set in Cloudflare dashboard):
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key
 * - CONTACT_EMAIL: Destination email (geoff@907.life)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle contact form POST requests
    if (url.pathname === '/contact' && request.method === 'POST') {
      return handleContactForm(request, env);
    }

    // Serve static assets for all other requests
    return env.ASSETS.fetch(request);
  }
};

/**
 * Handle contact form submissions
 * @param {Request} request - Incoming request
 * @param {Object} env - Environment bindings
 * @returns {Response} JSON response
 */
async function handleContactForm(request, env) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    // Parse form data
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

    // Validate Turnstile token
    // Use testing secret key if testing site key is in use, otherwise use production key
    // Testing secret key (always passes): 1x0000000000000000000000000000000AA
    // Testing tokens look like: XXXX.DUMMY.TOKEN.XXXX
    const isTestingToken = turnstileToken.includes('DUMMY');
    const secretKey = isTestingToken
      ? '1x0000000000000000000000000000000AA'
      : env.TURNSTILE_SECRET_KEY;

    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: secretKey,
          response: turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error('Turnstile validation failed:', turnstileResult);
      return new Response(
        JSON.stringify({ error: 'Turnstile validation failed. Please try again.' }),
        { status: 400, headers }
      );
    }

    // Send email via MailChannels
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

    // Success
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
 * MailChannels is free for Cloudflare Workers
 *
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} Success status
 */
async function sendEmailViaMailChannels(params) {
  const { to, replyTo, subject, name, senderEmail, message } = params;

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
      headers: { 'Content-Type': 'application/json' },
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
