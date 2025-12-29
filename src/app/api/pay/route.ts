
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { FLW_AUTH_URL, FLW_API_URL, FLW_CLIENT_ID, FLW_CLIENT_SECRET } from '@/lib/flutterwave-config';

// In-memory cache for the token
let token: {
  value: string | null;
  expiresAt: number | null;
} = {
  value: null,
  expiresAt: null,
};


async function getAccessToken(): Promise<string | null> {
    // Refresh if token is null, or if it expires in the next 60 seconds
    if (!token.value || !token.expiresAt || (token.expiresAt - Date.now() < 60000)) {
        try {
            if (!FLW_CLIENT_ID || !FLW_CLIENT_SECRET) {
              throw new Error('Flutterwave client ID or secret is not configured.');
            }
            
            const response = await fetch(FLW_AUTH_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                'client_id': FLW_CLIENT_ID,
                'client_secret': FLW_CLIENT_SECRET,
                'grant_type': 'client_credentials',
              }),
            });
    
            const data = await response.json();
            if (!response.ok || !data.access_token) {
              console.error('Flutterwave token refresh failed:', data);
              throw new Error('Failed to get Flutterwave token');
            }
            
            token.value = data.access_token;
            // Set expiration time from 'expires_in' (in seconds)
            token.expiresAt = Date.now() + (data.expires_in * 1000);
            
        } catch (error) {
            console.error('Error refreshing Flutterwave token:', error);
            token.value = null;
            token.expiresAt = null;
            return null;
        }
    }
    return token.value;
}


export async function POST(request: Request) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error('Could not authenticate with payment provider.');
    }

    const body = await request.json();
    const { amount, currency, email, planName, card } = body;

    if (!amount || !currency || !email || !planName || !card) {
      return NextResponse.json({ error: 'Missing required payment information.' }, { status: 400 });
    }
    
    // Step 1: Create Payment Method
    const traceId = randomUUID();
    const idempotencyKey = randomUUID();

    const pmResponse = await fetch(`${FLW_API_URL}/payment-methods`, {
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
    
    const chargeResponse = await fetch(`${FLW_API_URL}/charges`, {
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
            customer: {
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
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
