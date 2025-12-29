import { NextResponse } from 'next/server';

// This is a mock API route. In a real app, this would use a transactional email service
// like SendGrid, AWS SES, or Postmark to actually send the email.
// The Firebase Admin SDK has been removed to allow deployment without a service account key.
// As a result, API key validation is currently bypassed.

export async function POST(request: Request) {
  const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1];
  
  // A basic check for the presence of an API key.
  // The actual validation against Firestore is removed.
  if (!apiKey) {
    return NextResponse.json({ error: 'Unauthorized: Missing API key' }, { status: 401 });
  }

  // The key is not validated, but we proceed as if it were for mock purposes.

  try {
    const body = await request.json();
    const { to, from, subject, html, text } = body;

    // Basic validation
    if (!to || !from || !subject || (!html && !text)) {
      return NextResponse.json({ error: 'Missing required fields: to, from, subject, and html or text.' }, { status: 400 });
    }

    // --- MOCK SENDING LOGIC ---
    console.log('--- MOCK EMAIL SEND (API Key NOT Validated) ---');
    console.log('To:', to);
    console.log('From:', from);
    console.log('Subject:', subject);
    console.log('-----------------------');

    return NextResponse.json({ 
        message: 'Email request received and processed (mock).',
        id: `mock_send_${Date.now()}` 
    });

  } catch (error) {
    // Check if the error is due to JSON parsing
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
    }
    console.error('API Send Error:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
