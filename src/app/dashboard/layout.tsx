'use client';

import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DashboardNav } from '@/components/dashboard-nav';
import { Logo } from '@/components/logo';
import { LogOut, Settings } from 'lucide-react';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { collection } from 'firebase/firestore';
import type { Subscription } from '@/lib/types';

=======
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Subscription } from '@/lib/types';
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

<<<<<<< HEAD
  const subscriptionsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, `users/${user.uid}/subscriptions`);
  }, [firestore, user?.uid]);

  const { data: subscriptions, isLoading: isSubscriptionLoading } = useCollection<Subscription>(subscriptionsQuery);
=======
  const userSubscriptionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'subscriptions'), 
        where('status', '==', 'active'),
        orderBy('endDate', 'desc'),
        limit(1)
    );
  }, [firestore, user]);

  const { data: subscriptions, isLoading: isSubscriptionLoading } = useCollection<Subscription>(userSubscriptionsQuery);
  const activeSubscription = subscriptions?.[0];
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

<<<<<<< HEAD
  useEffect(() => {
    if (!isSubscriptionLoading && (!subscriptions || subscriptions.length === 0)) {
        router.push('/dashboard/subscription');
    }
  }, [subscriptions, isSubscriptionLoading, router]);
  
  if (isUserLoading || !user || isSubscriptionLoading) {
=======
  const isLoading = isUserLoading || isSubscriptionLoading;

  if (isLoading || !user) {
>>>>>>> 5755eb8 (Redesign the dashboard, bring everything to realtime, users have to subs)
    return null; // Or a loading spinner
  }

  const handleLogout = () => {
    auth.signOut();
  };
  
  const activeSubscription = subscriptions?.find(s => s.status === 'active');


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Logo />
            <SidebarTrigger className="hidden md:flex" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav activeSubscription={activeSubscription} />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2 rounded-md p-2 bg-secondary">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@user" data-ai-hint="avatar" />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">{user.displayName || user.email}</span>
                <span className="text-xs text-muted-foreground">{activeSubscription ? activeSubscription.name : 'No active plan'}</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-card px-6 md:justify-end">
            <SidebarTrigger className="flex md:hidden" />
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@user" data-ai-hint="avatar" />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
