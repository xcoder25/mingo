'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { encryptAES } from '@/lib/utils';
import { FLW_PUBLIC_ENCRYPTION_KEY } from '@/lib/flutterwave-config';


export interface Plan {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  features: string[];
  isOneTimePayment?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Mingo Basic',
    description: 'For individuals and small teams.',
    priceUSD: 37.5,
    features: ['10,000 Email Sends/month', 'Basic Analytics', 'Standard Support'],
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
    features: ['Visualize email opens on a world map', 'Real-time location data', 'Lifetime access'],
    isOneTimePayment: true,
  },
];

const currencyRates = {
  NGN: 1480, // 1 USD to NGN
  USD: 1,
  EUR: 0.92, // 1 USD to EUR
};

type Currency = keyof typeof currencyRates;

export default function ProductsPage() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getPrice = (priceUSD: number) => {
    const rate = currencyRates[currency];
    const price = priceUSD * rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openPaymentDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentDialogOpen(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !email || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill out all payment fields.',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const encryptionKey = FLW_PUBLIC_ENCRYPTION_KEY;
      if (!encryptionKey) {
        throw new Error('Payment gateway is not configured correctly.');
      }
      
      const nonce = window.crypto.randomUUID().substring(0, 12);

      const encryptedCardNumber = await encryptAES(cardNumber, encryptionKey, nonce);
      const encryptedExpiryMonth = await encryptAES(expiryMonth, encryptionKey, nonce);
      const encryptedExpiryYear = await encryptAES(expiryYear, encryptionKey, nonce);
      const encryptedCvv = await encryptAES(cvv, encryptionKey, nonce);
      
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.priceUSD * currencyRates[currency],
          currency: currency,
          email: email,
          planName: selectedPlan.name,
          card: {
            encrypted_card_number: encryptedCardNumber,
            encrypted_expiry_month: encryptedExpiryMonth,
            encrypted_expiry_year: encryptedExpiryYear,
            encrypted_cvv: encryptedCvv,
            nonce: nonce,
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        toast({
            title: 'Payment Successful',
            description: 'Your payment has been processed successfully.',
        });
        setIsPaymentDialogOpen(false);
      } else {
        throw new Error(data.error || 'Failed to process payment.');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: error.message || 'Could not process your payment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card shadow-sm sticky top-0 z-50">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </nav>
      </header>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Our Pricing Plans
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the perfect plan for your needs. All subscriptions are for 18 months.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold">
                    {getPrice(plan.priceUSD)}
                    {!plan.isOneTimePayment && (
                      <span className="text-base font-normal text-muted-foreground">/18mo</span>
                    )}
                  </div>
                  <ul className="grid gap-3 text-sm text-muted-foreground pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" onClick={() => openPaymentDialog(plan)}>
                    {plan.isOneTimePayment ? 'Purchase' : 'Subscribe'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Enter your payment details for {selectedPlan?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry-month">Expires (MM)</Label>
                  <Input 
                    id="expiry-month" 
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    placeholder="MM"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry-year">Expires (YY)</Label>                  
                  <Input 
                    id="expiry-year" 
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    placeholder="YY"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                   />
                </div>
              </div>
            </div>
            <Button onClick={handleProceedToPayment} disabled={isLoading}>
              {isLoading ? 'Processing...' : `Pay ${getPrice(selectedPlan?.priceUSD || 0)}`}
            </Button>
          </DialogContent>
        </Dialog>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 MingoSMTP. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
