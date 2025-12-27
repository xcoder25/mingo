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

const chartData = [
  { month: 'January', sent: 18600, delivered: 18000, opened: 15000 },
  { month: 'February', sent: 30500, delivered: 29000, opened: 22000 },
  { month: 'March', sent: 23700, delivered: 22500, opened: 19000 },
  { month: 'April', sent: 27300, delivered: 26000, opened: 21000 },
  { month: 'May', sent: 20900, delivered: 19900, opened: 17000 },
  { month: 'June', sent: 21400, delivered: 20500, opened: 18000 },
];

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
  return (
    <div className="grid gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45,231</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">44,890 (99.2%)</div>
                    <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bounced</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">341 (0.8%)</div>
                    <p className="text-xs text-muted-foreground">-0.2% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">35.7%</div>
                    <p className="text-xs text-muted-foreground">+3.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.9%</div>
                    <p className="text-xs text-muted-foreground">+0.8% from last month</p>
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
                                tickFormatter={(value) => value.slice(0, 3)}
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
