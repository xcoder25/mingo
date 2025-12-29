'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface VerificationResult {
    status: 'success' | 'failed' | 'pending';
    message: string;
    apiKey?: string;
}

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const tx_ref = searchParams.get('tx_ref');
  const transaction_id = searchParams.get('transaction_id');
  const { toast } = useToast();

  const [verificationResult, setVerificationResult] = useState<VerificationResult>({ status: 'pending', message: 'Verifying your payment...' });

  useEffect(() => {
    if (status === 'successful' && transaction_id && tx_ref) {
      const verify = async () => {
        try {
          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id, tx_ref }),
          });

          const result = await response.json();

          if (response.ok && result.status === 'success') {
            setVerificationResult({
              status: 'success',
              message: 'Your payment has been successfully verified!',
              apiKey: result.apiKey,
            });
          } else {
             setVerificationResult({ status: 'failed', message: result.message || 'Payment verification failed.' });
          }
        } catch (error) {
          console.error('Verification API call failed:', error);
          setVerificationResult({ status: 'failed', message: 'An error occurred during payment verification.' });
        }
      };
      verify();
    } else if (status) {
        // Handle non-successful initial statuses from Flutterwave
        const message = status === 'cancelled' ? 'Your payment was cancelled.' : 'Your payment failed.';
        setVerificationResult({ status: 'failed', message });
    } else {
        setVerificationResult({ status: 'failed', message: 'Invalid payment status received.' });
    }
  }, [status, tx_ref, transaction_id]);

  const renderStatus = () => {
    switch (verificationResult.status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful & Verified!',
          description: verificationResult.message,
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          description: verificationResult.message,
        };
      case 'pending':
      default:
        return {
          icon: <Loader2 className="h-16 w-16 animate-spin text-gray-500" />,
          title: 'Verifying Payment...',
          description: `Please wait while we confirm your transaction (Ref: ${tx_ref}). This may take a moment.`,
        };
    }
  };

  const { icon, title, description } = renderStatus();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader className="items-center">
          {icon}
          <CardTitle className="mt-4 text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationResult.status === 'pending' && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-10 w-full" />
            </div>
          )}
          {verificationResult.status === 'success' && verificationResult.apiKey && (
            <div className="space-y-2 rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
              <div className='flex items-center justify-center gap-2'>
                <KeyRound className="h-5 w-5 text-muted-foreground"/>
                <p className="text-sm font-semibold text-muted-foreground">Your New API Key</p>
              </div>
              <div 
                className="relative rounded-md bg-gray-100 dark:bg-gray-900 p-3 font-mono text-sm break-all cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(verificationResult.apiKey!);
                  toast({ title: 'Copied!', description: 'API Key copied to clipboard.' });
                }}
              >
                {verificationResult.apiKey}
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">copy</span>
              </div>
              <p className='text-xs text-muted-foreground pt-2'>You can now use this key to access MingoSMTP services.</p>
            </div>
          )}
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
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <PaymentStatusContent />
        </Suspense>
    )
}
