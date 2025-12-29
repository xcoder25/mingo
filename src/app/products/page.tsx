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
import { FLW_PUBLIC_KEY } from '@/lib/flutterwave-config';

// Extend the Window interface to include FlutterwaveCheckout
declare global {
  interface Window {
    FlutterwaveCheckout?: (options: any) => void;
  }
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  features: string[];
  isOneTimePayment?: boolean;
  duration?: string;
}

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Mingo Basic',
    description: 'For individuals and small teams.',
    priceUSD: 37.5,
    features: ['10,000 Email Sends/month', 'Basic Analytics', 'Standard Support'],
    duration: '/18mo'
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
    duration: '/18mo'
  },
    {
    id: 'standard-12',
    name: 'Mingo Standard',
    description: 'Ideal for focused projects.',
    priceUSD: 21.62,
    features: [
      '50,000 Email Sends/month',
      'Full Analytics Suite',
      'Standard Support',
    ],
    duration: '/12mo'
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
    duration: '/18mo'
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
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
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

  const openEmailDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEmailDialogOpen(true);
  };
  
  const handleProceedToPayment = () => {
    if (!selectedPlan || !email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter your email address.',
      });
      return;
    }

    if (!FLW_PUBLIC_KEY) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Payment gateway is not configured correctly.',
      });
      return;
    }
    
    if (typeof window.FlutterwaveCheckout !== 'function') {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Payment library has not loaded yet. Please try again in a moment.',
      });
      return;
    }
    
    setIsEmailDialogOpen(false);

    const tx_ref = `MingoSMTP-${Date.now()}`;
    
    window.FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: tx_ref,
      amount: selectedPlan.priceUSD * currencyRates[currency],
      currency: currency,
      payment_options: "card,mobilemoney,ussd",
      redirect_url: `${window.location.origin}/payment-status`,
      customer: {
        email: email,
        name: email.split('@')[0],
      },
      customizations: {
        title: "MingoSMTP",
        description: `Payment for ${selectedPlan.name}`,
        logo: "https://www.mingosmtp.com/logo.png", // Replace with your actual logo URL
      },
      callback: function (data: any) {
        console.log("payment successful, data:", data);
        // The redirect_url will handle the final status check
      },
      onclose: function() {
        // This is called when the user closes the modal
        console.log("Checkout modal closed by user.");
      }
    });
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
              Choose the perfect plan for your needs. Subscriptions are available for 12 or 18 months.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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
                      <span className="text-base font-normal text-muted-foreground">{plan.duration}</span>
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
                  <Button className="w-full" onClick={() => openEmailDialog(plan)}>
                    {plan.isOneTimePayment ? 'Purchase' : 'Subscribe'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Your Email</DialogTitle>
              <DialogDescription>
                Please provide your email to proceed with the purchase of {selectedPlan?.name}.
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
            </div>
            <Button onClick={handleProceedToPayment}>
              Proceed to Payment
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
