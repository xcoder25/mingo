'use client';

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  features: string[];
  isOneTimePayment?: boolean;
}

interface PaymentDetails extends Plan {
    amount: number;
    currency: string;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (options: any) => void;
  }
}

export function handlePayment(details: PaymentDetails) {
  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
  
  if (!publicKey) {
    console.error('Flutterwave public key is not set.');
    alert('Payment gateway is not configured. Please contact support.');
    return;
  }
  
  const tx_ref = `MingoSMTP-${Date.now()}-${Math.random()}`;

  window.FlutterwaveCheckout({
    public_key: publicKey,
    tx_ref,
    amount: details.amount,
    currency: details.currency,
    payment_options: 'card,mobilemoney,ussd',
    redirect_url: '', // Can be a success page
    meta: {
      plan_id: details.id,
    },
    customer: {
      // These would typically be collected from a form
      email: 'customer@example.com',
      phone_number: '08012345678',
      name: 'John Doe',
    },
    customizations: {
      title: 'MingoSMTP',
      description: `Payment for ${details.name}`,
      logo: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/mail-2533315-2122605.png',
    },
    onclose: () => {
      console.log('Payment modal closed.');
    },
    callback: (response: any) => {
        console.log('Payment successful. Response:', response);
        if (response.status === 'successful') {
            console.log('Generating credentials for successful payment...');
            console.log('API Key: MINGO-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
            console.log('SMTP Host: smtp.mingosmtp.com');
            console.log('SMTP Port: 587');
            alert('Payment successful! Check the browser console for your mock credentials.');
        } else {
            console.error('Payment was not successful. Status:', response.status);
            alert('Payment was not successful. Please try again.');
        }
    }
  });
}
