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
          <CardTitle>Welcome to MingoSMTP</CardTitle>
          <CardDescription>
            It looks like you don&apos;t have an active subscription. Please subscribe to a plan to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Button asChild>
                <Link href="/dashboard/subscription">Choose a Plan</Link>
            </Button>
        </CardContent>
      </Card>
    )
  }

  const generatedKeyName = `${plan} Initial Key`;

  return (
    <div className="grid gap-8">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4 text-3xl">Welcome to the {plan} Plan!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your subscription is active. Here is your first API key to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{generatedKeyName}</CardTitle>
          <CardDescription>
            Use this key to authenticate your requests. Keep it secure, as it won&apos;t be shown again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Label htmlFor="api-key" className="sr-only">
              Your New API Key
            </Label>
            <Input
              id="api-key"
              type="text"
              readOnly
              value={apiKey}
              className="pr-10 font-mono"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 h-full w-10"
              onClick={() => copyToClipboard(apiKey)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy API Key</span>
            </Button>
          </div>
        </CardContent>
      </Card>

       <Card>
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
            <CardDescription>
              Here are a few things you can do to get the most out of MingoSMTP.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                <div>
                    <p className="font-semibold">Verify Your Sender Domain</p>
                    <p className="text-muted-foreground">Go to the "Senders" page to add and verify your domain. This is crucial for email deliverability.</p>
                     <Button variant="link" className="p-0 h-auto" asChild>
                        <Link href="/dashboard/senders">Go to Senders</Link>
                    </Button>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                <div>
                    <p className="font-semibold">Explore Your Dashboard</p>
                    <p className="text-muted-foreground">Check out your new analytics dashboard to monitor your sending performance.</p>
                     <Button variant="link" className="p-0 h-auto" asChild>
                        <Link href="/dashboard">View Dashboard</Link>
                    </Button>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                <div>
                    <p className="font-semibold">Generate More API Keys</p>
                    <p className="text-muted-foreground">Visit the "API Keys" section to create more keys for different applications or environments.</p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                        <Link href="/dashboard/api-keys">Manage API Keys</Link>
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
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
