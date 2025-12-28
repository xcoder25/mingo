'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Mail, CheckCircle, AlertCircle, Eye, MousePointerClick } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { WithId } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import type { EmailAnalytics } from '@/lib/types';
import { format, parseISO } from 'date-fns';

const chartConfig = {
  sent: {
    label: 'Sent',
    color: 'hsl(var(--chart-1))',
  },
  delivered: {
    label: 'Delivered',
    color: 'hsl(var(--chart-2))',
  },
  opened: {
    label: 'Opened',
    color: 'hsl(var(--chart-3))',
  },
};

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const analyticsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, `users/${user.uid}/email_analytics`),
      orderBy('date', 'desc'),
      limit(6)
    );
  }, [firestore, user?.uid]);

  const { data: analyticsData, isLoading } = useCollection<EmailAnalytics>(analyticsQuery);

  const { chartData, totals, percentages } = useMemo(() => {
    if (!analyticsData) {
      return { chartData: [], totals: {}, percentages: {} };
    }

    const reversedData = [...analyticsData].reverse();

    const chartData = reversedData.map((item) => ({
      month: format(parseISO(item.date), 'MMM'), // format date to month abbreviation
      sent: item.sent,
      delivered: item.delivered,
      opened: item.opened,
    }));

    const totals = analyticsData.reduce(
      (acc, curr) => {
        acc.sent += curr.sent;
        acc.delivered += curr.delivered;
        acc.bounced += curr.bounced;
        acc.opened += curr.opened;
        return acc;
      },
      { sent: 0, delivered: 0, bounced: 0, opened: 0, clickThrough: 0 }
    );
    
    // This is a simplified calculation for CTR for the last data point
    const lastClickThrough = analyticsData[0]?.clickThroughRate || 0;
    totals.clickThrough = lastClickThrough;


    const percentages = {
      delivered: totals.sent > 0 ? (totals.delivered / totals.sent) * 100 : 0,
      bounced: totals.sent > 0 ? (totals.bounced / totals.sent) * 100 : 0,
      opened: totals.delivered > 0 ? (totals.opened / totals.delivered) * 100 : 0,
    };

    return { chartData, totals, percentages };
  }, [analyticsData]);
  

  if (isLoading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="grid gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.sent?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-muted-foreground">Total emails processed</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.delivered?.toLocaleString() || '0'} ({percentages.delivered?.toFixed(1) || '0'}%)</div>
                    <p className="text-xs text-muted-foreground">Successfully reached inbox</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bounced</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.bounced?.toLocaleString() || '0'} ({percentages.bounced?.toFixed(1) || '0'}%)</div>
                    <p className="text-xs text-muted-foreground">Failed deliveries</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{percentages.opened?.toFixed(1) || '0'}%</div>
                    <p className="text-xs text-muted-foreground">Based on delivered emails</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.clickThrough?.toFixed(1) || '0'}%</div>
                    <p className="text-xs text-muted-foreground">Latest campaign CTR</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                             />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line
                                dataKey="sent"
                                type="monotone"
                                stroke="var(--color-sent)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="delivered"
                                type="monotone"
                                stroke="var(--color-delivered)"
                                strokeWidth={2}
                                dot={false}
                            />
                             <Line
                                dataKey="opened"
                                type="monotone"
                                stroke="var(--color-opened)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Summary of your recent email campaigns.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                     <div className="flex items-center gap-4">
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Weekly Newsletter</p>
                            <p className="text-sm text-muted-foreground">Sent to 10,000 subscribers</p>
                        </div>
                        <div className="ml-auto font-medium">+45% Open Rate</div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Product Update</p>
                            <p className="text-sm text-muted-foreground">Sent to 5,200 users</p>
                        </div>
                        <div className="ml-auto font-medium">+28% Open Rate</div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Onboarding Sequence</p>
                            <p className="text-sm text-muted-foreground">Sent to 231 new users</p>
                        </div>
                        <div className="ml-auto font-medium">+65% Open Rate</div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Holiday Promotion</p>
                            <p className="text-sm text-muted-foreground">Sent to 25,000 customers</p>
                        </div>
                        <div className="ml-auto font-medium">+32% Open Rate</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
