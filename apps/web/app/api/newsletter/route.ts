import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const server = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!apiKey || !audienceId || !server) {
      return NextResponse.json({ ok: true, mode: 'noop' }, { status: 202 });
    }

    const response = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email_address: email, status: 'subscribed' })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Mailchimp request failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
