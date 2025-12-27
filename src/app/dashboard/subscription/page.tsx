import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your billing and subscription plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle>Mingo Pro</CardTitle>
                  </div>
                <CardDescription>Your current plan.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-4xl font-bold">$23,534.65<span className="text-base font-normal text-muted-foreground">/year</span></div>
                <p className="text-xs text-muted-foreground pt-1">
                  Your subscription will renew on December 31, 2024.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Cancel Subscription</Button>
              </CardFooter>
            </Card>

            <div className="rounded-lg border bg-card text-card-foreground p-6">
                <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                 <ul className="grid gap-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Unlimited Email Sends</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Full Analytics Suite</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> AI Delivery Optimizer</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Dedicated Support</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Advanced API Access</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Team Management</li>
                  </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
