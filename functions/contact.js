/**
 * Cloudflare Pages Function: Contact Form Handler
 *
 * Handles POST requests to /contact
 * - Validates Cloudflare Turnstile token
 * - Sends email via Fastmail JMAP API
 * - Returns JSON response
 *
 * Environment variables required:
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key
 * - FASTMAIL_API_TOKEN: Fastmail App Password
 * - FASTMAIL_ACCOUNT_ID: Fastmail account ID
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

    // 3. Send email via Fastmail JMAP
    const emailSent = await sendEmailViaFastmail({
      from: env.CONTACT_EMAIL,
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[907.life] ${subject}`,
      name: name,
      senderEmail: email,
      message: message,
      apiToken: env.FASTMAIL_API_TOKEN,
      accountId: env.FASTMAIL_ACCOUNT_ID,
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
 * Send email via Fastmail JMAP API
 *
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} - Success status
 */
async function sendEmailViaFastmail(params) {
  const {
    from,
    to,
    replyTo,
    subject,
    name,
    senderEmail,
    message,
    apiToken,
    accountId,
  } = params;

  try {
    // Step 1: Get JMAP session
    const sessionResponse = await fetch('https://api.fastmail.com/jmap/session', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!sessionResponse.ok) {
      console.error('Failed to get JMAP session');
      return false;
    }

    const session = await sessionResponse.json();
    const apiUrl = session.apiUrl;

    // Step 2: Create email
    const emailBody = `From: ${name} <${senderEmail}>

Message:
${message}

---
Sent via 907.life contact form`;

    const jmapRequest = {
      using: ['urn:ietf:params:jmap:core', 'urn:ietf:params:jmap:mail', 'urn:ietf:params:jmap:submission'],
      methodCalls: [
        [
          'Email/set',
          {
            accountId: accountId,
            create: {
              draft: {
                mailboxIds: {
                  // This will be the Drafts folder - JMAP will handle it
                },
                from: [{ email: from }],
                to: [{ email: to }],
                replyTo: [{ email: replyTo }],
                subject: subject,
                textBody: [
                  {
                    partId: 'body',
                    type: 'text/plain',
                  },
                ],
                bodyValues: {
                  body: {
                    value: emailBody,
                  },
                },
              },
            },
          },
          'a',
        ],
        [
          'EmailSubmission/set',
          {
            accountId: accountId,
            create: {
              submission: {
                emailId: '#draft',
                identityId: accountId,
              },
            },
          },
          'b',
        ],
      ],
    };

    // Step 3: Send via JMAP
    const jmapResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jmapRequest),
    });

    if (!jmapResponse.ok) {
      console.error('JMAP request failed:', await jmapResponse.text());
      return false;
    }

    const jmapResult = await jmapResponse.json();

    // Check if email was created and sent successfully
    const emailCreated = jmapResult.methodResponses[0][1].created;
    const submissionCreated = jmapResult.methodResponses[1][1].created;

    return !!(emailCreated && submissionCreated);

  } catch (error) {
    console.error('Fastmail JMAP error:', error);
    return false;
  }
}
