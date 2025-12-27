'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { optimizeEmailDelivery, OptimizeEmailDeliveryOutput } from '@/ai/flows/optimize-email-delivery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type FormState = {
  data: OptimizeEmailDeliveryOutput | null;
  error: string | null;
  timestamp: number; // To re-trigger effects on new submissions
};

const initialState: FormState = {
  data: null,
  error: null,
  timestamp: Date.now(),
};

async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const emailContent = formData.get('emailContent') as string;
  const recipientEngagementData = formData.get('recipientEngagementData') as string;
  
  if (!emailContent || !recipientEngagementData) {
    return { data: null, error: 'Both fields are required.', timestamp: Date.now() };
  }

  try {
    const result = await optimizeEmailDelivery({ emailContent, recipientEngagementData });
    return { data: result, error: null, timestamp: Date.now() };
  } catch (e: any) {
    return { data: null, error: e.message || 'An unknown error occurred.', timestamp: Date.now() };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Optimizing...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Optimize Now
        </>
      )}
    </Button>
  );
}

export function AIForm() {
  const [state, formActionWithState] = useFormState(formAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: state.error,
      });
    }
  }, [state.error, state.timestamp, toast]);

  return (
    <div className="grid gap-8">
      <form action={formActionWithState} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>Paste the full content of your email below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="emailContent"
                name="emailContent"
                placeholder="Subject: Big News!..."
                className="min-h-[300px] font-mono text-sm"
                required
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recipient Engagement Data</CardTitle>
              <CardDescription>Provide any relevant data about your recipients. For example: open rates, demographics, past interactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="recipientEngagementData"
                name="recipientEngagementData"
                placeholder="Example: Audience is developers, open rate is 20%, click rate is 5%. Best engagement on Tuesdays."
                className="min-h-[300px] font-mono text-sm"
                required
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
      
      {state.data && (
        <div className="grid gap-6 md:grid-cols-2 animate-in fade-in-0 duration-500">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Email Content</CardTitle>
              <CardDescription>The AI's suggestion for a higher-performing email.</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">{state.data.optimizedEmailContent}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Recommendations</CardTitle>
              <CardDescription>Actionable advice to improve your email delivery strategy.</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">{state.data.deliveryRecommendations}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
