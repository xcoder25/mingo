'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
    useCollection, 
    useUser, 
    useFirestore, 
    useMemoFirebase,
    addDocumentNonBlocking,
    deleteDocumentNonBlocking
} from '@/firebase';
import type { ApiKey } from '@/lib/types';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Key, Trash2, Copy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { generateApiKey } from '@/ai/flows/generate-api-key-flow';


export default function ApiKeysPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const apiKeysQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, `users/${user.uid}/apiKeys`);
  }, [firestore, user?.uid]);

  const { data: apiKeys, isLoading } = useCollection<Omit<ApiKey, 'key'>>(apiKeysQuery);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim() || !user || !firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Key name cannot be empty."
        });
        return;
    }

    const { key } = await generateApiKey({name: newKeyName.trim()});
    
    const keyData = {
      userId: user.uid,
      name: newKeyName.trim(),
      key, // In a real app, this would be a securely hashed version.
      createdAt: serverTimestamp(),
    };

    await addDocumentNonBlocking(collection(firestore, `users/${user.uid}/apiKeys`), keyData);
    
    setGeneratedKey(key);
    setNewKeyName('');
  };

  const handleDeleteKey = (keyId: string) => {
    if(!user || !firestore) return;
    const keyRef = doc(firestore, `users/${user.uid}/apiKeys`, keyId);
    deleteDocumentNonBlocking(keyRef);
    toast({
        title: "API Key Revoked",
        description: "The API key has been successfully deleted."
    });
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate New API Key</CardTitle>
          <CardDescription>
            Create an API key to send emails programmatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="My new application key"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleGenerateKey} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Key
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Manage your existing API keys. Keys are not displayed after creation for security.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading keys...</TableCell>
                  </TableRow>
                ) : (
                  apiKeys?.map(key => (
                    <TableRow key={key.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            {key.name}
                        </TableCell>
                        <TableCell>
                           {key.createdAt ? format(new Date((key.createdAt as any).seconds * 1000), 'MMM d, yyyy') : 'Just now'}
                        </TableCell>
                        <TableCell className="text-right">
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" /> Revoke
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the API key and any applications using it will no longer be able to authenticate.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteKey(key.id)}>
                                        Yes, Revoke Key
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                  ))
                )}
                 {!isLoading && apiKeys?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            No API keys generated yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
      
       {/* Modal to display newly generated key */}
      <AlertDialog open={!!generatedKey} onOpenChange={(open) => !open && setGeneratedKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API Key Generated Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Please copy your new API key. For security, you will not be able to see it again.
            </AlertDialogDescription>
          </header>
          <div className="p-4 bg-secondary rounded-md font-mono text-sm break-all relative">
            {generatedKey}
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => copyToClipboard(generatedKey || '')}>
                <Copy className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setGeneratedKey(null)}>
                I have copied my API key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
