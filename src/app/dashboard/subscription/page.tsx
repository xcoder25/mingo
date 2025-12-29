'use client';

import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
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
<<<<<<< HEAD
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
=======
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import type { Subscription } from '@/lib/types';
import { add } from 'date-fns';

>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)

type Currency = {
  code: 'USD' | 'NGN' | 'GBP';
  name: string;
  symbol: string;
  rate: number; // Rate against USD
};

export type Plan = {
  id: 'basic' | 'pro' | 'enterprise' | 'growth' | 'scale' | 'ultimate';
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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );
  const { toast } = useToast();

  const userSubscriptionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'subscriptions'), 
        where('status', '==', 'active'),
        orderBy('endDate', 'desc'),
        limit(1)
    );
  }, [firestore, user]);

  const { data: subscriptions, isLoading } = useCollection<Subscription>(userSubscriptionsQuery);
  const activeSubscription = subscriptions?.[0];

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
  
  const PaystackButton = ({ plan }: { plan: Plan }) => {
    const config = {
      reference: new Date().getTime().toString(),
      email: user?.email || '',
      amount: Math.round(plan.priceUSD * selectedCurrency.rate * 100), // Amount in kobo/cents
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_a68285a855938575510b644f7724ffe8c79af8c0',
      currency: selectedCurrency.code,
    };

    const initializePayment = usePaystackPayment(config);

<<<<<<< HEAD
    const onSuccess = () => {
      if (!user || !firestore) return;

      const subscriptionRef = doc(firestore, `users/${user.uid}/subscriptions`, plan.id);
      
      const subscriptionData = {
        id: plan.id,
        userId: user.uid,
        status: 'active',
        planName: plan.name,
        price: plan.priceUSD,
        currency: selectedCurrency.code,
        startDate: serverTimestamp(),
        endDate: null, // or calculate based on subscription duration
        createdAt: serverTimestamp(),
      };
      
      setDocumentNonBlocking(subscriptionRef, subscriptionData, { merge: true });
=======
    const onSuccess = (transaction: any) => {
        if (!user) return;

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
            transactionRef: transaction.reference,
        };

        addDocumentNonBlocking(subscriptionsRef, newSubscription);
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)

      toast({
        title: 'Payment Successful!',
        description: `Your subscription to the ${plan.name} plan is now active.`,
      });
    };

    const onClose = () => {
<<<<<<< HEAD
      console.log('closed');
    };

    return (
      <Button className="w-full" onClick={() => initializePayment({onSuccess, onClose})}>
        Choose Plan
=======
      console.log('Payment dialog closed');
    };

    const currentPlanPrice = plans.find((p) => p.id === activeSubscription?.planId)?.priceUSD || 0;

    return (
      <Button className="w-full" onClick={() => initializePayment({onSuccess, onClose})}>
        {plan.priceUSD > currentPlanPrice
          ? 'Upgrade'
          : plan.priceUSD < currentPlanPrice ? 'Downgrade' : 'Subscribe'}
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
      </Button>
    );
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Manage your billing and subscription plan. Your current plan is{' '}
              <span className="font-semibold text-primary">{activeSubscription ? activeSubscription.name : 'None'}</span>.
            </CardDescription>
          </div>
          <div className="w-[180px]">
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
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
<<<<<<< HEAD
                className="flex flex-col"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
=======
                className={`flex flex-col ${
                  plan.id === activeSubscription?.planId ? 'border-primary ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {plan.id === activeSubscription?.planId && (
                      <Zap className="h-6 w-6 text-primary" />
                    )}
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
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
<<<<<<< HEAD
                  <PaystackButton plan={plan} />
=======
                  {plan.id === activeSubscription?.planId ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <PaystackButton plan={plan} />
                  )}
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
