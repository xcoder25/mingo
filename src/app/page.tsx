'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BarChart, Bot, CheckCircle, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const { user, isUserLoading } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card shadow-sm sticky top-0 z-50">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {!isUserLoading && !user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
          {!isUserLoading && user && (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && (
                <Image
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                  data-ai-hint={heroImage.imageHint}
                  height="600"
                  src={heroImage.imageUrl}
                  width="600"
                />
              )}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Reliable Email Delivery, Optimized by AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MingoSMTP provides a robust platform for sending your emails with confidence, backed by powerful analytics and AI-powered delivery optimization.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/register">Start Your Subscription</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need for Perfect Email Delivery</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From analytics to AI, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 pt-12">
              <div className="grid gap-1 text-center">
                <Mail className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Reliable SMTP Service</h3>
                <p className="text-sm text-muted-foreground">Send emails with a service built for deliverability and performance.</p>
              </div>
              <div className="grid gap-1 text-center">
                <BarChart className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Email Analytics</h3>
                <p className="text-sm text-muted-foreground">Visualize your success with a comprehensive dashboard for all key metrics.</p>
              </div>
              <div className="grid gap-1 text-center">
                <Bot className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">AI Delivery Optimization</h3>
                <p className="text-sm text-muted-foreground">Leverage AI to improve engagement by optimizing content and delivery strategy.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Simple, All-Inclusive Pricing</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose a plan that fits your needs.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Mingo Pro</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="text-4xl font-bold">
                    &#8358;148,500
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <ul className="grid gap-2 text-left text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Unlimited Email Sends</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Full Analytics Suite</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> AI Delivery Optimizer</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Dedicated Support</li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/subscription">Choose Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
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
