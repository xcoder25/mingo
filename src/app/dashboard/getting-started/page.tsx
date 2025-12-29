'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function GettingStartedContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const plan = searchParams.get('plan');
  const apiKey = searchParams.get('apiKey');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  if (!plan || !apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            Could not retrieve your plan details. Please check your subscription page.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Button asChild>
                <Link href="/dashboard/subscription">View Subscription</Link>
            </Button>
        </CardContent>
      </Card>
    )
  }

  const apiKeys = [
    { name: 'MingoSMTP API Key', value: apiKey },
    { name: 'Token Generator API Key', value: apiKey },
    { name: 'Formula 55 API Key', value: apiKey },
  ];

  return (
    <div className="grid gap-8">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-3xl">Welcome to {plan}!</CardTitle>
          <CardDescription className="text-lg">
            Your subscription is active. Here are your API keys to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </CardContent>
      </Card>

      {apiKeys.map((keyItem) => (
        <Card key={keyItem.name}>
          <CardHeader>
            <CardTitle>{keyItem.name}</CardTitle>
            <CardDescription>
              Use this key to authenticate your requests. Keep it secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Label htmlFor={keyItem.name.replace(/ /g, '-')} className="sr-only">
                {keyItem.name}
              </Label>
              <Input
                id={keyItem.name.replace(/ /g, '-')}
                type="text"
                readOnly
                value={keyItem.value}
                className="pr-10 font-mono"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full w-10"
                onClick={() => copyToClipboard(keyItem.value)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy API Key</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function GettingStartedPage() {
    return (
        <Suspense fallback={<div>Loading your details...</div>}>
            <GettingStartedContent />
        </Suspense>
    )
}
