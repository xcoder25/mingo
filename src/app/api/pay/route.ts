import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, email, planName } = body;

    if (!amount || !currency || !email || !planName) {
      return NextResponse.json({ error: 'Missing required payment information.' }, { status: 400 });
    }

    const flutterwaveSecretKey = process.env.FLUTTERWAVE_CLIENT_SECRET;
    if (!flutterwaveSecretKey) {
      throw new Error('Flutterwave secret key is not configured.');
    }
    
    const tx_ref = `MingoSMTP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency,
        redirect_url: `${request.nextUrl.origin}/payment-status?tx_ref=${tx_ref}`,
        customer: {
          email,
        },
        customizations: {
          title: 'MingoSMTP',
          description: `Payment for ${planName}`,
          logo: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/mail-2533315-2122605.png',
        },
      }),
    });

    const responseData = await response.json();

    if (responseData.status === 'success') {
      return NextResponse.json({ paymentLink: responseData.data.link });
    } else {
      const errorMessage = responseData.message || 'Failed to create payment link.';
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

  } catch (error: any) {
    console.error('Flutterwave API Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
