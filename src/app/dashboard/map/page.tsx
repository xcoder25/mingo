'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Geolocation Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Open Locations</CardTitle>
          <CardDescription>A world map showing where your emails are being opened in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-secondary rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
                <MapIcon className="h-16 w-16 mx-auto" />
                <p className="mt-2 font-semibold">Map Placeholder</p>
                <p className="text-sm">A real map integration would be shown here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
