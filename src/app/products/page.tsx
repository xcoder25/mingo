import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const plans = [
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

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
             <header className="px-4 lg:px-6 h-16 flex items-center bg-card shadow-sm sticky top-0 z-50">
                <Logo />
                <nav className="ml-auto flex gap-4 sm:gap-6">
                <Button variant="ghost" asChild>
                    <Link href="/">Home</Link>
                </Button>
                <Button asChild>
                    <Link href="#">Get Started</Link>
                </Button>
                </nav>
            </header>
            <main className="flex-1 py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Our Pricing Plans</h1>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Choose the perfect plan for your needs.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className="flex flex-col"
                        >
                            <CardHeader className="pb-4">
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                            <div className="text-4xl font-bold">
                                ${plan.priceUSD}
                                {!plan.isOneTimePayment && <span className="text-base font-normal text-muted-foreground">/mo</span>}
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
                            <div className="p-6 pt-0">
                                <Button className="w-full">
                                    {plan.isOneTimePayment ? 'Purchase' : 'Subscribe'}
                                </Button>
                            </div>
                        </Card>
                        ))}
                    </div>
                </div>
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
    )
}
