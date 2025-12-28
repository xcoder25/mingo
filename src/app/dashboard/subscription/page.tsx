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

type Currency = {
  code: 'USD' | 'NGN' | 'GBP';
  name: string;
  symbol: string;
  rate: number; // Rate against USD
};

type Plan = {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  features: string[];
  isCurrent?: boolean;
};

const currencies: Currency[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1500 },
  { code: 'USD', name: 'United States Dollar', symbol: '$', rate: 1 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.8 },
];

const plans: Plan[] = [
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
    description: 'Your current plan. For growing businesses.',
    priceUSD: 99,
    features: [
      'Unlimited Email Sends',
      'Full Analytics Suite',
      'AI Delivery Optimizer',
      'Dedicated Support',
    ],
    isCurrent: true,
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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );
  const { toast } = useToast();

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
      email: 'user@mingo.com',
      amount: Math.round(plan.priceUSD * selectedCurrency.rate * 100), // Amount in kobo/cents
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      currency: selectedCurrency.code,
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = () => {
      toast({
        title: 'Payment Successful!',
        description: `Your subscription to the ${plan.name} plan is now active.`,
      });
    };

    const onClose = () => {
      // implementation for  whatever you want to do when the Paystack dialog closed.
      console.log('closed');
    };

    return (
      <Button className="w-full" onClick={() => initializePayment({onSuccess, onClose})}>
        {plan.priceUSD > (plans.find((p) => p.isCurrent)?.priceUSD || 0)
          ? 'Upgrade'
          : 'Downgrade'}
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
              Manage your billing and subscription plan.
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
                className={`flex flex-col ${
                  plan.isCurrent ? 'border-primary ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {plan.isCurrent && (
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
                  {plan.isCurrent ? (
                    <Button variant="outline" className="w-full">
                      Manage Plan
                    </Button>
                  ) : (
                    <PaystackButton plan={plan} />
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