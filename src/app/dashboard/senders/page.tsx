'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollection, useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, useDoc, setDocumentNonBlocking } from '@/firebase';
import type { Sender, UserProfile } from '@/lib/types';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Copy } from 'lucide-react';

export default function SendersPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newDomain, setNewDomain] = useState('');
  const { toast } = useToast();
  
  const sendersQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, `users/${user.uid}/senders`);
  }, [firestore, user?.uid]);

  const { data: senders, isLoading } = useCollection<Sender>(sendersQuery);

  const handleAddDomain = () => {
    if (!newDomain.trim() || !user || !firestore) return;

    const domainData = {
      userId: user.uid,
      domain: newDomain.trim(),
      status: 'pending',
      spfRecord: `v=spf1 include:mail.mingosmtp.com ~all`,
      dkimRecord: `v=DKIM1; k=rsa; p=${crypto.randomUUID().replace(/-/g, '')}`,
      dmarcRecord: `v=DMARC1; p=none; rua=mailto:dmarc-reports@mingosmtp.com`,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(firestore, `users/${user.uid}/senders`), domainData);
    
    toast({
      title: 'Domain Added',
      description: `Verification records for ${newDomain.trim()} are now available.`,
    });
    setNewDomain('');
  };
  
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Sender Settings</h1>
      
      <ProfileCard />
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Domain</CardTitle>
          <CardDescription>
            Add a domain you want to send emails from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleAddDomain} className="w-full sm:w-auto">Add Domain</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>Manage and verify your sending domains.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading domains...</TableCell>
                  </TableRow>
                ): (
                  senders?.map(sender => (
                    <DnsRecordRow key={sender.id} sender={sender} />
                  ))
                )}
                 {!isLoading && senders?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            No domains added yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileCard() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

    const [fullName, setFullName] = useState(userProfile?.fullName || '');

    useEffect(() => {
        if(userProfile) {
            setFullName(userProfile.fullName || '');
        }
    }, [userProfile]);

    const handleSaveProfile = () => {
        if (!userProfileRef) return;
        setDocumentNonBlocking(userProfileRef, { fullName }, { merge: true });
        toast({ title: 'Profile Updated', description: 'Your name has been updated successfully.'});
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input 
                    id="full-name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} readOnly disabled />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveProfile} disabled={isLoading || fullName === userProfile?.fullName}>Save</Button>
            </CardFooter>
        </Card>
    )
}

function DnsRecordRow({ sender }: { sender: Sender }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{sender.domain}</TableCell>
        <TableCell>
          <Badge variant={sender.status === 'verified' ? 'default' : 'secondary'}>
            {sender.status.charAt(0).toUpperCase() + sender.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Hide Records' : (sender.status === 'verified' ? 'View Records' : 'Verify')}
          </Button>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={3}>
            <div className="p-4 bg-secondary rounded-md grid gap-4">
                <h4 className="font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> DNS Records for Authentication</h4>
                <p className="text-sm text-muted-foreground">Add the following TXT records to your domain's DNS settings to improve deliverability and protect against spoofing.</p>
                
                {/* SPF Record */}
                <div className="grid gap-2 text-sm">
                    <Label className="font-semibold">SPF Record</Label>
                    <div className="flex items-center justify-between p-2 rounded-md bg-background font-mono text-xs">
                        <span>{sender.spfRecord}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(sender.spfRecord)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Helps prevent spoofing by specifying which mail servers are allowed to send email for your domain.</p>
                </div>
                
                {/* DKIM Record */}
                <div className="grid gap-2 text-sm">
                    <Label className="font-semibold">DKIM Record</Label>
                     <div className="flex items-center justify-between p-2 rounded-md bg-background font-mono text-xs">
                        <span className="truncate">{sender.dkimRecord}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(sender.dkimRecord)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Adds a digital signature to emails, allowing receiving servers to verify that the message was not altered in transit.</p>
                </div>

                {/* DMARC Record */}
                <div className="grid gap-2 text-sm">
                    <Label className="font-semibold">DMARC Record</Label>
                     <div className="flex items-center justify-between p-2 rounded-md bg-background font-mono text-xs">
                        <span>{sender.dmarcRecord}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(sender.dmarcRecord)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Specifies how to handle emails that fail SPF or DKIM checks, providing an additional layer of protection.</p>
                </div>

                <div className="flex justify-end pt-2">
                    <Button><Check className="mr-2 h-4 w-4" /> Verify Records</Button>
                </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
