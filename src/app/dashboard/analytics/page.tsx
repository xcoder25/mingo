
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { EmailAnalytics } from '@/lib/types';
import { collection, query, orderBy } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Mail, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const analyticsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, `users/${user.uid}/email_analytics`), orderBy('date', 'desc'));
  }, [firestore, user?.uid]);

  const { data: analyticsData, isLoading } = useCollection<EmailAnalytics>(analyticsQuery);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Email Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>A detailed log of your email delivery performance over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Opened</TableHead>
                <TableHead className="text-right">Bounced</TableHead>
                <TableHead className="text-right">Open Rate</TableHead>
                <TableHead className="text-right">CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading analytics...
                  </TableCell>
                </TableRow>
              ) : (
                analyticsData?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{format(parseISO(item.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">{item.sent.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.delivered.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.opened.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.bounced.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {item.delivered > 0 ? ((item.opened / item.delivered) * 100).toFixed(1) : '0.0'}%
                    </TableCell>
                     <TableCell className="text-right">
                      {item.clickThroughRate.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bounce Handling</CardTitle>
          <CardDescription>Details on emails that failed to deliver.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-4">
             <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">user@example-domain-that-doesnt-exist.com</p>
                    <p className="text-sm text-muted-foreground">Reason: Hard Bounce - Mailbox not found</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">Jun 28, 2024</div>
            </div>
             <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">another-user@invalid-email-provider.net</p>
                    <p className="text-sm text-muted-foreground">Reason: Hard Bounce - Domain does not accept mail</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">Jun 27, 2024</div>
            </div>
             <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                <CheckCircle className="h-6 w-6 text-yellow-500" />
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">full-inbox@example.com</p>
                    <p className="text-sm text-muted-foreground">Reason: Soft Bounce - Mailbox full</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">Jun 26, 2024</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
