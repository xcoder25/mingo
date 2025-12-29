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
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, ResponsiveContainer } from 'recharts';
import { Mail, CheckCircle, AlertCircle, Eye, MousePointerClick } from 'lucide-react';
<<<<<<< HEAD
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { WithId } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import type { EmailAnalytics } from '@/lib/types';
import { format, parseISO } from 'date-fns';
=======
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { EmailAnalytics } from '@/lib/types';
import { useMemo } from 'react';
import { format } from 'date-fns';
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)

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
   bounced: {
    label: 'Bounced',
    color: 'hsl(var(--destructive))',
  },
  clickThroughRate: {
    label: 'Click-Through Rate',
    color: 'hsl(var(--chart-4))',
  },
};

export default function DashboardPage() {
<<<<<<< HEAD
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

=======
    const { user } = useUser();
    const firestore = useFirestore();

    const analyticsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'email_analytics'),
            orderBy('date', 'desc'),
            limit(7)
        );
    }, [firestore, user]);

    const { data: analyticsData, isLoading } = useCollection<EmailAnalytics>(analyticsQuery);

    const chartData = useMemo(() => {
        if (!analyticsData) return [];
        return analyticsData.slice().reverse().map(item => ({
            ...item,
            date: format(new Date(item.date), 'MMM d'),
        }));
    }, [analyticsData]);

    const latestAnalytics = analyticsData?.[0];

    const totalSent = latestAnalytics?.sent || 0;
    const totalDelivered = latestAnalytics?.delivered || 0;
    const totalBounced = latestAnalytics?.bounced || 0;
    const totalOpened = latestAnalytics?.opened || 0;
    const clickThroughRate = latestAnalytics?.clickThroughRate || 0;

    const deliveryPercentage = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const bouncePercentage = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;

    if (isLoading) {
        return <div>Loading dashboard...</div>
    }

>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
  return (
    <div className="grid gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                    <div className="text-2xl font-bold">{totals.sent?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-muted-foreground">Total emails processed</p>
=======
                    <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total emails queued</p>
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                    <div className="text-2xl font-bold">{totals.delivered?.toLocaleString() || '0'} ({percentages.delivered?.toFixed(1) || '0'}%)</div>
=======
                    <div className="text-2xl font-bold">{totalDelivered.toLocaleString()} ({deliveryPercentage.toFixed(1)}%)</div>
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
                    <p className="text-xs text-muted-foreground">Successfully reached inbox</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bounced</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                    <div className="text-2xl font-bold">{totals.bounced?.toLocaleString() || '0'} ({percentages.bounced?.toFixed(1) || '0'}%)</div>
=======
                    <div className="text-2xl font-bold">{totalBounced.toLocaleString()} ({bouncePercentage.toFixed(1)}%)</div>
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
                    <p className="text-xs text-muted-foreground">Failed deliveries</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                    <div className="text-2xl font-bold">{percentages.opened?.toFixed(1) || '0'}%</div>
=======
                    <div className="text-2xl font-bold">{openRate.toFixed(1)}%</div>
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
                    <p className="text-xs text-muted-foreground">Based on delivered emails</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                    <div className="text-2xl font-bold">{totals.clickThrough?.toFixed(1) || '0'}%</div>
                    <p className="text-xs text-muted-foreground">Latest campaign CTR</p>
=======
                    <div className="text-2xl font-bold">{clickThroughRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Based on opened emails</p>
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Last 7 Days Overview</CardTitle>
                    <CardDescription>Performance of your email sends over the past week.</CardDescription>
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
                                dataKey="date"
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
                                dot={true}
                                name="Sent"
                            />
                            <Line
                                dataKey="delivered"
                                type="monotone"
                                stroke="var(--color-delivered)"
                                strokeWidth={2}
                                dot={true}
                                name="Delivered"
                            />
                             <Line
                                dataKey="opened"
                                type="monotone"
                                stroke="var(--color-opened)"
                                strokeWidth={2}
                                dot={true}
                                name="Opened"
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Performance Breakdown</CardTitle>
                    <CardDescription>
                        A closer look at your most recent email statistics.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                       <BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis yAxisId="left" orientation="left" stroke="var(--color-sent)" tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="var(--color-clickThroughRate)" tickLine={false} axisLine={false}/>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="sent" fill="var(--color-sent)" radius={4} yAxisId="left" name="Sent" />
                            <Bar dataKey="clickThroughRate" fill="var(--color-clickThroughRate)" radius={4} yAxisId="right" name="Click Rate (%)" />
                       </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
