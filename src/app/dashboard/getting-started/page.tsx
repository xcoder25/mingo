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
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Welcome! You can generate and manage your API keys from the API Keys section.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Button asChild>
                <Link href="/dashboard/api-keys">Go to API Keys</Link>
            </Button>
        </CardContent>
      </Card>
    )
  }

  const apiKeys = [
    { name: 'MingoSMTP API Key', value: apiKey },
    { name: 'Your Blog API Key', value: 'mingo_xxxx...' },
    { name: 'Staging Environment Key', value: 'mingo_xxxx...' },
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
            Your subscription is active. Here is your first API key to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </CardContent>
      </Card>

      {apiKeys.map((keyItem, index) => (
        <Card key={keyItem.name}>
          <CardHeader>
            <CardTitle>{keyItem.name}</CardTitle>
            <CardDescription>
              {index === 0 ? "Use this key to authenticate your requests. Keep it secure." : "You can create more keys for other applications."}
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
                disabled={index > 0}
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
