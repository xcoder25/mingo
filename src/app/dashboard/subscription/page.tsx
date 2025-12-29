'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Zap } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import type { Subscription, EmailAnalytics } from '@/lib/types';
import { add, subDays } from 'date-fns';
import { useRouter } from 'next/navigation';

type Currency = {
  code: 'USD' | 'NGN' | 'GBP';
  name: string;
  symbol: string;
  rate: number; // Rate against USD
};

export type Plan = {
  id: 'basic' | 'pro' | 'enterprise';
  name: string;
  description: string;
  priceUSD: number;
  features: string[];
};

const currencies: Currency[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1500 },
  { code: 'USD', name: 'United States Dollar', symbol: '$', rate: 1 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.8 },
];

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Mingo Basic',
    description: 'For individuals and small teams.',
    priceUSD: 29,
    features: [
      '10,000 Email Sends/month',
      'Basic Analytics',
      'Standard Support',
    ],
  },
  {
    id: 'pro',
    name: 'Mingo Pro',
    description: 'For growing businesses.',
    priceUSD: 99,
    features: [
      'Unlimited Email Sends',
      'Full Analytics Suite',
      'AI Delivery Optimizer',
      'Dedicated Support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Mingo Enterprise',
    description: 'For large-scale organizations.',
    priceUSD: 249,
    features: [
      'Unlimited Email Sends',
      'Full Analytics Suite',
      'AI Delivery Optimizer',
      'Dedicated Support',
      'Advanced API Access',
      'Team Management',
    ],
  },
];

export default function SubscriptionPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );
  const { toast } = useToast();
  
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
        if(!user) setIsLoading(false);
        return;
    };

    const fetchSubscription = async () => {
      setIsLoading(true);
      try {
        const subscriptionsRef = collection(firestore, 'users', user.uid, 'subscriptions');
        const q = query(
          subscriptionsRef,
          where('status', '==', 'active'),
          orderBy('endDate', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const subDoc = querySnapshot.docs[0];
          setActiveSubscription({ id: subDoc.id, ...subDoc.data() } as Subscription);
        } else {
          setActiveSubscription(null);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch subscription details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, firestore, toast]);

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const formatPrice = (priceUSD: number) => {
    const convertedPrice = priceUSD * selectedCurrency.rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 2,
    }).format(convertedPrice);
  };
  
  const handleSelectPlan = async (plan: Plan) => {
    if (!user || !firestore) return;

    const subscriptionsRef = collection(firestore, 'users', user.uid, 'subscriptions');
    const startDate = new Date();
    const endDate = add(startDate, { months: 1 });

    const newSubscription: Omit<Subscription, 'id'> = {
        userId: user.uid,
        planId: plan.id,
        name: plan.name,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: serverTimestamp(),
        price: plan.priceUSD,
        currency: selectedCurrency.code,
        transactionRef: `mock_${new Date().getTime()}`,
    };

    const docRef = await addDocumentNonBlocking(subscriptionsRef, newSubscription);

    if (docRef) {
        setActiveSubscription({ id: docRef.id, ...newSubscription } as Subscription);

        const apiKey = `mingo_${crypto.randomUUID().replace(/-/g, '')}`;
        const apiKeyData = {
          userId: user.uid,
          name: `${plan.name} Initial Key`,
          key: apiKey,
          createdAt: serverTimestamp(),
        };
        await addDocumentNonBlocking(collection(firestore, `users/${user.uid}/apiKeys`), apiKeyData);

        const analyticsRef = collection(firestore, `users/${user.uid}/email_analytics`);
        for (let i = 0; i < 7; i++) {
            const date = subDays(new Date(), i);
            const sent = Math.floor(Math.random() * (1500 - 500 + 1) + 500);
            const delivered = sent - Math.floor(Math.random() * 50);
            const bounced = sent - delivered;
            const opened = Math.floor(delivered * (Math.random() * (0.4 - 0.2) + 0.2));
            const clickThroughRate = Math.random() * (7 - 2) + 2;

            const analyticsData: Omit<EmailAnalytics, 'id'> = {
                userId: user.uid,
                date: date.toISOString(),
                sent,
                delivered,
                bounced,
                opened,
                clickThroughRate,
            };
            await addDocumentNonBlocking(analyticsRef, analyticsData);
        }
        
        toast({
            title: 'Plan Activated!',
            description: `Your subscription to the ${plan.name} plan is now active.`,
        });

        router.push(`/dashboard/getting-started?plan=${plan.name}&apiKey=${apiKey}`);
    } else {
        toast({
            variant: "destructive",
            title: 'Subscription Failed',
            description: `There was an error activating the ${plan.name} plan.`,
        });
    }
  }

  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              {activeSubscription ? (
                <>
                Your current plan is{' '}
                <span className="font-semibold text-primary">{activeSubscription.name}</span>.
                It will renew on {new Date(activeSubscription.endDate as string).toLocaleDateString()}.
                </>
              ) : 'Choose a plan to get started.'}
            </CardDescription>
          </div>
          <div className="w-full sm:w-[180px]">
            <Select
              defaultValue={selectedCurrency.code}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex flex-col ${
                  plan.id === activeSubscription?.planId ? 'border-primary ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {plan.id === activeSubscription?.planId && (
                      <Zap className="h-6 w-6 text-primary" />
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold">
                    {formatPrice(plan.priceUSD)}
                    <span className="text-base font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <ul className="grid gap-3 text-sm text-muted-foreground pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />{' '}
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.id === activeSubscription?.planId ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleSelectPlan(plan)} disabled={!!activeSubscription}>
                      {activeSubscription ? 'Renew/Change Unavailable' : 'Subscribe'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
