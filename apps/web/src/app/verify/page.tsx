import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const VerifyIdentityClient = dynamic(() => import('./VerifyIdentityClient'), {
  ssr: false,
});

export default function VerifyIdentityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-xl bg-white/95 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle>Loading verify page…</CardTitle>
              <CardDescription>Please wait while we prepare the identity verification page.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Connecting to your wallet and loading verifier tools…</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerifyIdentityClient />
    </Suspense>
  );
}
