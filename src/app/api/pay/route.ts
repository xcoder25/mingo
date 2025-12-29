import { NextResponse } from 'next/server';
import getConfig from 'next/config';

async function getFlutterwaveToken(clientId: string, clientSecret: string) {
  try {
    const response = await fetch('https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'client_credentials',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to get Flutterwave token');
    }
    return data.access_token;
  } catch (error) {
    console.error('Error fetching Flutterwave token:', error);
    throw new Error('Could not authenticate with payment provider.');
  }
}

export async function POST(request: Request) {
  try {
    const { serverRuntimeConfig } = getConfig();
    const { flutterwavePublicKey, flutterwaveSecretKey } = serverRuntimeConfig;
    
    if (!flutterwavePublicKey || !flutterwaveSecretKey) {
      return NextResponse.json({ error: 'Payment processor is not configured correctly.' }, { status: 500 });
    }

    const accessToken = await getFlutterwaveToken(flutterwavePublicKey, flutterwaveSecretKey);

    const body = await request.json();
    const { amount, currency, email, planName } = body;

    if (!amount || !currency || !email || !planName) {
      return NextResponse.json({ error: 'Missing required payment information.' }, { status: 400 });
    }

    const tx_ref = `MingoSMTP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
