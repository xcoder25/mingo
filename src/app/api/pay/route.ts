import { NextResponse } from 'next/server';
import getConfig from 'next/config';
import { randomUUID } from 'crypto';

async function getFlutterwaveToken(clientId: string, clientSecret: string) {
  try {
    const response = await fetch('https://idp-sandbox.flutterwave.com/realms/flutterwave/protocol/openid-connect/token', {
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
    const { amount, currency, email, planName, card } = body;

    if (!amount || !currency || !email || !planName || !card) {
      return NextResponse.json({ error: 'Missing required payment information.' }, { status: 400 });
    }
    
    // Step 1: Create Payment Method
    const traceId = randomUUID();
    const idempotencyKey = randomUUID();

    const pmResponse = await fetch('https://developersandbox-api.flutterwave.com/payment-methods', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Trace-Id': traceId,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        type: 'card',
        card: card,
      }),
    });

    const pmData = await pmResponse.json();

    if (pmData.status !== 'success' || !pmData.data?.id) {
       return NextResponse.json({ error: pmData.message || 'Failed to create payment method.' }, { status: pmResponse.status });
    }

    const paymentMethodId = pmData.data.id;

    // Step 2: Create Charge
    const chargeTraceId = randomUUID();
    const chargeIdempotencyKey = randomUUID();
    const chargeReference = `MingoSMTP-${Date.now()}`;
    
    const chargeResponse = await fetch('https://developersandbox-api.flutterwave.com/charges', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Trace-Id': chargeTraceId,
            'X-Idempotency-Key': chargeIdempotencyKey,
        },
        body: JSON.stringify({
            reference: chargeReference,
            currency,
            amount,
            payment_method_id: paymentMethodId,
            redirect_url: `${request.nextUrl.origin}/payment-status?tx_ref=${chargeReference}`,
            customer: { // Assuming customer creation is not needed for this simple flow
                email: email,
            },
            meta: {
                plan_name: planName,
            }
        })
    });

    const chargeData = await chargeResponse.json();
    
    if (chargeData.status === 'success') {
      return NextResponse.json(chargeData);
    } else {
      const errorMessage = chargeData.message || 'Failed to create charge.';
      return NextResponse.json({ error: errorMessage }, { status: chargeResponse.status });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
