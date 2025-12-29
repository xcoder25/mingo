'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth, useUser, initiateEmailSignUp, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if(!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && firestore) {
            // New user, create their profile document
            const userRef = doc(firestore, 'users', user.uid);
            const userData = {
                id: user.uid,
                email: user.email,
                fullName: fullName || user.displayName,
                subscriptionPlan: null,
                subscriptionStatus: 'inactive',
                createdAt: serverTimestamp(),
            };
            // Don't block navigation
            setDocumentNonBlocking(userRef, userData, { merge: true });
        }
    });
    return () => unsubscribe();
  }, [auth, firestore, fullName]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    initiateEmailSignUp(auth, email, password);
  };
  
  if (isUserLoading || user) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center">
        <Logo />
        <CardTitle className="text-2xl pt-4">Create an account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
            Create account
            </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-center block">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
