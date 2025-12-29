'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
<<<<<<< HEAD
import { Bot, CreditCard, LayoutDashboard, BarChart, Send } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Subscription } from '@/lib/types';


const defaultNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: 'Dashboard' },
  { href: '/dashboard/analytics', icon: BarChart, label: 'Analytics', tooltip: 'Analytics' },
  { href: '/dashboard/senders', icon: Send, label: 'Senders', tooltip: 'Senders' },
  { href: '/dashboard/subscription', icon: CreditCard, label: 'Subscription', tooltip: 'Subscription' },
];

const proNavItems = [
  { href: '/dashboard/optimize', icon: Bot, label: 'AI Optimizer', tooltip: 'AI Optimizer' },
]

export function DashboardNav() {
=======
import { Bot, CreditCard, LayoutDashboard } from 'lucide-react';
import type { Subscription } from '@/lib/types';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
  requiredPlanIds?: string[];
};

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: 'Dashboard' },
  { 
    href: '/dashboard/optimize', 
    icon: Bot, 
    label: 'AI Optimizer', 
    tooltip: 'AI Optimizer',
    requiredPlanIds: ['pro', 'enterprise', 'growth', 'scale', 'ultimate'] 
  },
  { href: '/dashboard/subscription', icon: CreditCard, label: 'Subscription', tooltip: 'Subscription' },
];

export function DashboardNav({ activeSubscription }: { activeSubscription?: Subscription }) {
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const subscriptionsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, `users/${user.uid}/subscriptions`);
  }, [firestore, user?.uid]);

  const { data: subscriptions } = useCollection<Subscription>(subscriptionsQuery);

  const hasProSubscription = subscriptions?.some(plan => plan.id === 'pro' && plan.status === 'active');

  const navItems = hasProSubscription ? [...defaultNavItems, ...proNavItems] : defaultNavItems;


  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredPlanIds) {
      return true; // Item doesn't require a subscription
    }
    if (!activeSubscription) {
      return false; // User has no active subscription
    }
    return item.requiredPlanIds.includes(activeSubscription.planId);
  });

  return (
    <SidebarMenu>
      {filteredNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
            tooltip={{ children: item.tooltip, side: 'right' }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
