
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { tokenManager } from '@/lib/flutterwave-token-manager';
import { FLW_API_URL } from '@/lib/flutterwave-config';


export async function POST(request: Request) {
  try {
    const accessToken = await tokenManager.getToken();
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
