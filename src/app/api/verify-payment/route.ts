// src/app/api/verify-payment/route.ts
import { NextResponse } from 'next/server';
import { FLW_SECRET_KEY } from '@/lib/flutterwave-config';

async function verifyTransaction(transactionId: string) {
  const url = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flutterwave API Error:', errorText);
      throw new Error(`Flutterwave API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
}

function generateApiKey(tx_ref: string): string {
  const prefix = "Mingo_prod_";
  const hash = Buffer.from(`${tx_ref}-${Date.now()}`).toString('base64');
  return prefix + hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
}


export async function POST(request: Request) {
  try {
    const { transaction_id, tx_ref } = await request.json();

    if (!transaction_id || !tx_ref) {
      return NextResponse.json({ error: 'Transaction ID and reference are required' }, { status: 400 });
    }

    const data = await verifyTransaction(transaction_id);

    if (data.status === 'success' && data.data.tx_ref === tx_ref && data.data.status === 'successful') {
        // Payment is successful and verified
        // Here you would typically update your database, provision services, etc.
        // For now, we will generate and return a unique API key as proof of provisioning.
        const apiKey = generateApiKey(tx_ref);

        return NextResponse.json({ 
            status: 'success', 
            message: 'Payment verified successfully.',
            apiKey: apiKey,
            customer: data.data.customer,
            amount: data.data.amount,
            currency: data.data.currency,
        });
    } else {
      // This means the transaction was not successful or the details don't match.
      return NextResponse.json({ status: 'failed', message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verification POST handler error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
