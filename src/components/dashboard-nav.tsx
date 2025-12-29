'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Bot, CreditCard, LayoutDashboard, BarChart, Send, Key, Map } from 'lucide-react';
import type { Plan } from '@/app/dashboard/subscription/page';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';


type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
  requiredPlanIds?: string[];
  requiresMapAccess?: boolean;
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
  {
    href: '/dashboard/map',
    icon: Map,
    label: 'Map Analytics',
    tooltip: 'Map Analytics',
    requiresMapAccess: true,
  },
  { href: '/dashboard/api-keys', icon: Key, label: 'API Keys', tooltip: 'API Keys' },
  { href: '/dashboard/subscription', icon: CreditCard, label: 'Subscription', tooltip: 'Subscription' },
];

export function DashboardNav({ activePlan }: { activePlan: Plan | null | undefined }) {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const filteredNavItems = navItems.filter(item => {
    // Pro/Enterprise features
    if (item.requiredPlanIds) {
        if (!activePlan) return false;
        return item.requiredPlanIds.includes(activePlan.id);
    }
    // Map API feature
    if (item.requiresMapAccess) {
        return userProfile?.hasMapApiAccess === true;
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
