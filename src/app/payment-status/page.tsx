'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const tx_ref = searchParams.get('tx_ref');

  const renderStatus = () => {
    switch (status) {
      case 'successful':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful!',
          description: `Your transaction (Ref: ${tx_ref}) was completed successfully. A confirmation has been sent to your email.`,
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-yellow-500" />,
          title: 'Payment Cancelled',
          description: `Your transaction (Ref: ${tx_ref}) was cancelled. You have not been charged.`,
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          description: `Unfortunately, your transaction (Ref: ${tx_ref}) could not be processed. Please try again or use a different payment method.`,
        };
      default:
        return {
          icon: <AlertCircle className="h-16 w-16 text-gray-500" />,
          title: 'Payment Status Unknown',
          description: 'We are waiting for confirmation of your payment. Please check back shortly or contact support if this persists.',
        };
    }
  };

  const { icon, title, description } = renderStatus();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="items-center">
          {icon}
          <CardTitle className="mt-4 text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/products">Return to Products</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentStatusContent />
        </Suspense>
    )
}
