/**
 * Cloudflare Worker: 907.life
 *
 * Serves static assets from Hugo build and handles POST /contact
 * for contact form submissions.
 *
 * Environment variables required (set in Cloudflare dashboard):
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key
 * - CONTACT_EMAIL: Destination email (geoff@907.life)
 * - RESEND_API_KEY: Resend API key for sending emails
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

    // Send email via Resend API
    const emailResult = await sendEmailViaResend({
      apiKey: env.RESEND_API_KEY,
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[907.life] ${subject}`,
      name: name,
      senderEmail: email,
      message: message,
    });

    if (!emailResult.success) {
      console.error('Email send failed:', emailResult.error);
      return new Response(
        JSON.stringify({ error: emailResult.error || 'Failed to send email. Please try again later.' }),
        { status: 500, headers }
      );
    }

    // Success
    console.log('Email sent successfully:', emailResult.id);
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
 * Send email via Resend API
 *
 * Resend is a modern email API that replaced MailChannels for Cloudflare Workers.
 * MailChannels discontinued their free Cloudflare Workers integration on August 31, 2024.
 *
 * Resend free tier: 3,000 emails/month (100/day)
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 *
 * @param {Object} params - Email parameters
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
async function sendEmailViaResend(params) {
  const { apiKey, to, replyTo, subject, name, senderEmail, message } = params;

  // Check for API key
  if (!apiKey) {
    return {
      success: false,
      error: 'Email service not configured. RESEND_API_KEY environment variable is missing.'
    };
  }

  try {
    const emailBody = `From: ${name} <${senderEmail}>

Message:
${message}

---
Sent via 907.life contact form`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Note: Using Resend test sender since 907.life domain not verified yet
        // To use contact@907.life, verify domain in Resend dashboard
        from: 'Onboarding <onboarding@resend.dev>',
        to: [to],
        reply_to: replyTo,
        subject: subject,
        text: emailBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', response.status, JSON.stringify(result));

      // Provide more specific error messages
      if (response.status === 401) {
        return { success: false, error: 'Email service authentication failed. Please contact site administrator.' };
      }
      if (response.status === 403) {
        return { success: false, error: 'Email domain not verified. Please contact site administrator.' };
      }
      if (response.status === 422) {
        return { success: false, error: `Email validation error: ${result.message || 'Invalid request'}` };
      }
      if (response.status === 429) {
        return { success: false, error: 'Too many requests. Please try again in a few minutes.' };
      }

      return { success: false, error: result.message || 'Failed to send email' };
    }

    return { success: true, id: result.id };

  } catch (error) {
    console.error('Resend send error:', error);
    return { success: false, error: 'Network error while sending email' };
  }
}
