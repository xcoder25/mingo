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
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Subscription } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user || !firestore) return;
      setIsSubscriptionLoading(true);
      const subscriptionsRef = collection(firestore, 'users', user.uid, 'subscriptions');
      const q = query(
        subscriptionsRef,
        where('status', '==', 'active'),
        orderBy('endDate', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const subDoc = querySnapshot.docs[0];
        setActiveSubscription({ id: subDoc.id, ...subDoc.data() } as Subscription);
      } else {
        router.push('/dashboard/subscription');
      }
      setIsSubscriptionLoading(false);
    }
    fetchSubscription();
  }, [user, firestore, router]);


  const isLoading = isUserLoading || isSubscriptionLoading;

  if (isLoading || !user) {
    return null; // Or a loading spinner
  }

  const handleLogout = () => {
    auth.signOut();
  };

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
        <header className="flex h-16 items-center justify-end border-b bg-card px-6">
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
