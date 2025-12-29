'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BarChart, Bot, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const testimonialUser1 = PlaceHolderImages.find((img) => img.id === 'testimonial-user-1');
  const testimonialUser2 = PlaceHolderImages.find((img) => img.id === 'testimonial-user-2');
  const testimonialUser3 = PlaceHolderImages.find((img) => img.id === 'testimonial-user-3');

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

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">What Our Customers Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from businesses who trust MingoSMTP for their critical email communications.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      "MingoSMTP's AI optimizer is a game-changer. Our open rates have increased by 20% since we started using it. The analytics are incredibly detailed and easy to understand."
                    </p>
                    <div className="flex items-center gap-4">
                      {testimonialUser1 && (
                        <Avatar>
                          <AvatarImage src={testimonialUser1.imageUrl} alt="@user1" data-ai-hint={testimonialUser1.imageHint} />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm font-semibold">Alex Rivera</p>
                        <p className="text-sm text-muted-foreground">CEO, Tech Innovators</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      "The reliability is top-notch. We send thousands of transactional emails daily and haven't had a single issue. The customer support is also fantastic."
                    </p>
                    <div className="flex items-center gap-4">
                      {testimonialUser2 && (
                        <Avatar>
                          <AvatarImage src={testimonialUser2.imageUrl} alt="@user2" data-ai-hint={testimonialUser2.imageHint} />
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm font-semibold">Brenda Smith</p>
                        <p className="text-sm text-muted-foreground">CTO, E-Commerce Co.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      "Setting up our sender domains was incredibly simple. The step-by-step guides for DNS records made the whole process seamless for our team."
                    </p>
                    <div className="flex items-center gap-4">
                       {testimonialUser3 && (
                        <Avatar>
                          <AvatarImage src={testimonialUser3.imageUrl} alt="@user3" data-ai-hint={testimonialUser3.imageHint} />
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm font-semibold">Chen Liu</p>
                        <p className="text-sm text-muted-foreground">Marketing Lead, SaaS Startup</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Boost Your Email Delivery?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account and start sending smarter emails today. No credit card required to get started.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/register">Create Your Free Account</Link>
              </Button>
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
