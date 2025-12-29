'use client';

import 'react-phone-number-input/style.css';
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
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { useToast } from '@/hooks/use-toast';

export default function PhoneSignInPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (auth && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }
  }, [auth]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPossiblePhoneNumber(phoneNumber)) {
        toast({ variant: 'destructive', title: 'Invalid Phone Number' });
        return;
    }
    if (!recaptchaVerifierRef.current) return;

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Check your phone for the verification code.' });
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || otp.length !== 6) return;

    try {
      await confirmationResult.confirm(otp);
      // User is signed in. `onAuthStateChanged` will redirect.
      toast({ title: 'Success!', description: 'You are now signed in.' });
    } catch (error: any) {
      console.error('OTP confirmation error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid OTP or an error occurred.' });
    }
  };
  
  if (isUserLoading || user) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <div ref={recaptchaContainerRef}></div>
      <CardHeader className="items-center">
        <Logo />
        <CardTitle className="text-2xl pt-4">{isOtpSent ? 'Enter Verification Code' : 'Sign in with Phone'}</CardTitle>
        <CardDescription>{isOtpSent ? `We sent a code to ${phoneNumber}` : 'Please enter your phone number to continue.'}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isOtpSent ? (
            <form onSubmit={handlePhoneSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <PhoneInput
                        id="phone"
                        international
                        defaultCountry="US"
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value || '')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    </div>
                    <Button type="submit" className="w-full">
                        Send Verification Code
                    </Button>
                </div>
            </form>
        ) : (
            <form onSubmit={handleOtpSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="otp">6-Digit Code</Label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                    </div>
                    <Button type="submit" className="w-full">
                        Verify and Sign In
                    </Button>
                </div>
            </form>
        )}
      </CardContent>
      <CardFooter className="text-sm text-center block">
        <Link href="/login" className="underline">
          Back to other login methods
        </Link>
      </CardFooter>
    </Card>
  );
}
