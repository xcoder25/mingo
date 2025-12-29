import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/firebase/admin';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// Initialize Firebase Admin SDK
const { firestore } = initializeAdmin();

// This is a mock API route. In a real app, this would use a transactional email service
// like SendGrid, AWS SES, or Postmark to actually send the email.

export async function POST(request: Request) {
  const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1];
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Unauthorized: Missing API key' }, { status: 401 });
  }

  // Find the user associated with the API key
  // This is a simplified lookup. In a production app, you might have a more direct way
  // to query keys, potentially from a different collection or database optimized for this.
  const allUsers = await firestore.collection('users').get();
  let ownerId: string | null = null;
  let keyValid = false;
  
  for (const userDoc of allUsers.docs) {
    const apiKeysRef = collection(firestore, 'users', userDoc.id, 'apiKeys');
    const q = query(apiKeysRef, where('key', '==', apiKey), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      keyValid = true;
      ownerId = userDoc.id;
      break; 
    }
  }

  if (!keyValid || !ownerId) {
    return NextResponse.json({ error: 'Unauthorized: Invalid API key' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { to, from, subject, html, text } = body;

    // Basic validation
    if (!to || !from || !subject || (!html && !text)) {
      return NextResponse.json({ error: 'Missing required fields: to, from, subject, and html or text.' }, { status: 400 });
    }

    // --- MOCK SENDING LOGIC ---
    // Here, you would integrate your email sending service.
    // For now, we'll just log the request and return a success response.
    console.log('--- MOCK EMAIL SEND ---');
    console.log('API Key Owner:', ownerId);
    console.log('To:', to);
    console.log('From:', from);
    console.log('Subject:', subject);
    console.log('-----------------------');

    // You could also add this request to a "sent_emails" collection in Firestore for tracking.

    return NextResponse.json({ 
        message: 'Email request received and processed (mock).',
        id: `mock_send_${Date.now()}` 
    });

  } catch (error) {
    console.error('API Send Error:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
