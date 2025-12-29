'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Bot, CreditCard, LayoutDashboard, BarChart, Send } from 'lucide-react';
import type { Subscription } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
  requiredPlanIds?: string[];
};

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: 'Dashboard' },
  { href: '/dashboard/analytics', icon: BarChart, label: 'Analytics', tooltip: 'Analytics' },
  { href: '/dashboard/senders', icon: Send, label: 'Senders', tooltip: 'Senders' },
  { 
    href: '/dashboard/optimize', 
    icon: Bot, 
    label: 'AI Optimizer', 
    tooltip: 'AI Optimizer',
    requiredPlanIds: ['pro', 'enterprise'] 
  },
  { href: '/dashboard/subscription', icon: CreditCard, label: 'Subscription', tooltip: 'Subscription' },
];

export function DashboardNav({ activeSubscription }: { activeSubscription?: Subscription }) {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const filteredNavItems = navItems.filter(item => {
    if (item.href === '/dashboard/optimize') {
        if (!activeSubscription) return false;
        return item.requiredPlanIds?.includes(activeSubscription.planId);
    }
    return true;
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
