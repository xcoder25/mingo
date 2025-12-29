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
import { CheckCircle, Zap, Map } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import type { UserProfile, EmailAnalytics } from '@/lib/types';
import { subDays } from 'date-fns';
import { useRouter } from 'next/navigation';


type Currency = {
  code: 'USD' | 'NGN' | 'GBP';
  name: string;
  symbol: string;
  rate: number; // Rate against USD
};

export type Plan = {
  id: 'basic' | 'pro' | 'enterprise' | 'map-api';
  name: string;
  description: string;
  priceUSD: number;
  features: string[];
  isOneTimePayment?: boolean;
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
    priceUSD: 37.5,
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
   {
    id: 'map-api',
    name: 'Map API Access',
    description: 'One-time purchase for geolocation analytics.',
    priceUSD: 17,
    features: [
      'Visualize email opens on a world map',
      'Real-time location data',
      'Lifetime access',
    ],
    isOneTimePayment: true,
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
  
  const userProfileRef = useMemoFirebase(() => {
      if (!user || !firestore) return null;
      return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const formatPrice = (priceUSD: number, isOneTime: boolean = false) => {
    const convertedPrice = priceUSD * selectedCurrency.rate;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 2,
    }).format(convertedPrice);

    if (isOneTime) return formatted;
    return `${formatted} / 18 months`;
  };
  
  const handleSelectPlan = async (plan: Plan) => {
    if (!user || !firestore || !userProfileRef) return;

    // Simulate payment with Flutterwave (client-side)
    toast({
        title: 'Redirecting to payment gateway...',
        description: 'You will be redirected to complete your payment.',
    });

    // After a delay to simulate redirection
    setTimeout(async () => {
        let updatedProfile: Partial<UserProfile> = {};
        
        if (plan.isOneTimePayment) {
            updatedProfile = {
                hasMapApiAccess: true
            };
        } else {
             updatedProfile = {
                subscriptionPlan: plan.id as 'basic' | 'pro' | 'enterprise',
                subscriptionStatus: 'active',
            };

            // Only generate dummy data for main subscriptions
            const analyticsRef = collection(firestore, `users/${user.uid}/email_analytics`);
            for (let i = 0; i < 7; i++) {
                const date = subDays(new Date(), i);
                const sent = Math.floor(Math.random() * (1500 - 500 + 1) + 500);
                const delivered = sent - Math.floor(Math.random() * 50);
                const bounced = sent - delivered;
                const opened = Math.floor(delivered * (Math.random() * (0.4 - 0.2) + 0.2));
                const clickThroughRate = Math.random() * (7 - 2) + 2;

                const analyticsData: Omit<EmailAnalytics, 'id' | 'userId'> = {
                    sent,
                    delivered,
                    bounced,
                    opened,
                    clickThroughRate,
                    date: date.toISOString(),
                };
                await addDocumentNonBlocking(analyticsRef, { userId: user.uid, ...analyticsData });
            }
        }
        
        setDocumentNonBlocking(userProfileRef, updatedProfile, { merge: true });

        if (plan.isOneTimePayment) {
             toast({
                title: 'Purchase Successful!',
                description: `You now have access to the ${plan.name}.`,
            });
            // Optional: Redirect to the map page or stay here
            router.push('/dashboard/map');
        } else {
            // Generate an API Key for main subscriptions
            const apiKey = `mingo_${crypto.randomUUID().replace(/-/g, '')}`;
            const apiKeyData = {
              userId: user.uid,
              name: `${plan.name} Initial Key`,
              key: apiKey,
              createdAt: serverTimestamp(),
            };
            const apiKeysRef = collection(firestore, `users/${user.uid}/apiKeys`);
            await addDocumentNonBlocking(apiKeysRef, apiKeyData);

            toast({
                title: 'Plan Activated!',
                description: `Your subscription to the ${plan.name} plan is now active.`,
            });
             // Redirect to the getting-started page for main subscriptions
            router.push(`/dashboard/getting-started?plan=${plan.name}&apiKey=${apiKey}`);
        }
    }, 2000);
  }


  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }
  
  const activePlanId = userProfile?.subscriptionStatus === 'active' ? userProfile.subscriptionPlan : null;
  const hasMapAccess = userProfile?.hasMapApiAccess === true;


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              {activePlanId ? (
                <>
                Your current plan is{' '}
                <span className="font-semibold text-primary">{plans.find(p => p.id === activePlanId)?.name}</span>.
                </>
              ) : 'Choose a plan or feature to get started.'}
               {hasMapAccess && !activePlanId && ' You have access to the Map API.'}
               {hasMapAccess && activePlanId && ' You also have access to the Map API.'}
            </CardDescription>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[180px]">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
               const isCurrentPlan = plan.id === activePlanId;
               const isPurchasedAddon = plan.isOneTimePayment && hasMapAccess;
               const buttonDisabled = (plan.isOneTimePayment ? isPurchasedAddon : !!activePlanId) && !isCurrentPlan;
              
              return (
              <Card
                key={plan.id}
                className={`flex flex-col ${
                  isCurrentPlan || isPurchasedAddon ? 'border-primary ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {(isCurrentPlan || isPurchasedAddon) && (
                      <Zap className="h-6 w-6 text-primary" />
                    )}
                     {plan.id === 'map-api' && !(isCurrentPlan || isPurchasedAddon) && (
                        <Map className="h-6 w-6 text-muted-foreground" />
                     )}
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold">
                    {formatPrice(plan.priceUSD, plan.isOneTimePayment)}
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
                   {isCurrentPlan || isPurchasedAddon ? (
                     <Button variant="outline" className="w-full" disabled>
                      {isPurchasedAddon ? 'Purchased' : 'Current Plan'}
                    </Button>
                   ) : (
                     <Button className="w-full" onClick={() => handleSelectPlan(plan)} disabled={buttonDisabled}>
                        {plan.isOneTimePayment ? 'Purchase' : (activePlanId ? 'Change Plan Unavailable' : 'Subscribe')}
                    </Button>
                   )}
                </CardFooter>
              </Card>
            )})}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
