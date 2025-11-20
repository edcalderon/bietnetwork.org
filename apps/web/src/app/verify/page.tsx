'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount, usePublicClient, useSignMessage, useReadContract } from 'wagmi';
import { keccak256, encodePacked } from 'viem';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';

const BIET_IDENTITY_ADDRESS = process.env
  .NEXT_PUBLIC_BIET_IDENTITY_ADDRESS as `0x${string}`;

export default function VerifyIdentityPage() {
  const searchParams = useSearchParams();
  const { address: verifierAddress, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { signMessageAsync } = useSignMessage();

  const targetAddress = searchParams.get('address') || '';
  const name = searchParams.get('name') || '';
  const did = searchParams.get('did') || '';
  const country = searchParams.get('country') || '';
  const level = searchParams.get('level') || 'basic';

  const [isSigning, setIsSigning] = React.useState(false);
  const [signature, setSignature] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { data: verifierRole } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        inputs: [],
        name: 'VERIFIER_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    functionName: 'VERIFIER_ROLE',
  });

  const { data: hasVerifierRole } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'hasRole',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    functionName: 'hasRole',
    args:
      verifierAddress && verifierRole
        ? [verifierRole as `0x${string}`, verifierAddress]
        : undefined,
  });

  const handleSign = async () => {
    setError(null);
    setSignature(null);

    if (!isConnected || !verifierAddress) {
      setError('Connect your verifier wallet to sign this request.');
      return;
    }

    if (hasVerifierRole === false) {
      setError('This wallet does not have VERIFIER_ROLE on BietIdentity.');
      return;
    }
    if (!targetAddress) {
      setError('Missing target address in URL.');
      return;
    }

    try {
      setIsSigning(true);

      const nonce = await publicClient.readContract({
        address: BIET_IDENTITY_ADDRESS,
        abi: [
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'mintNonces',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        functionName: 'mintNonces',
        args: [targetAddress as `0x${string}`],
      });

      const identityHash = keccak256(
        encodePacked(
          ['address', 'string', 'string', 'string', 'string', 'uint256'],
          [targetAddress, name, did, country, level, nonce as bigint],
        ),
      );

      const sig = await signMessageAsync({
        message: { raw: identityHash },
      });

      setSignature(sig);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to sign attestation.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleCopySignature = async () => {
    if (!signature) return;
    try {
      await navigator.clipboard.writeText(signature);
    } catch {
      // ignore
    }
  };

  const unauthorized = isConnected && hasVerifierRole === false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-xl bg-white/95 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verify Identity Request
          </CardTitle>
          <CardDescription>
            This page is for wallets with the VERIFIER_ROLE on BietIdentity to sign
            identity attestations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!targetAddress ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200/70 dark:border-red-500/40 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">
                Missing identity parameters in URL. Please use a link generated from the
                Identity dashboard.
              </div>
            </div>
          ) : unauthorized ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200/70 dark:border-amber-500/50 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-100">
                This wallet does not have the VERIFIER_ROLE on BietIdentity and cannot
                sign identity attestations. Please switch to an authorized verifier
                wallet.
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Target address
                </p>
                <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {targetAddress}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Full name</p>
                  <p className="text-gray-700 dark:text-gray-300 break-words">{name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">DID</p>
                  <p className="text-gray-700 dark:text-gray-300 break-words">{did}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Country</p>
                  <p className="text-gray-700 dark:text-gray-300 break-words">{country}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Verification level
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 break-words">{level}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By clicking "Sign attestation", you will sign the hash of these exact
                fields plus the current nonce from BietIdentity. Only do this if you
                trust the requester and your wallet has VERIFIER_ROLE.
              </p>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200/70 dark:border-red-500/40 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                  <span className="text-xs text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              {signature && (
                <div className="p-3 bg-green-50 dark:bg-green-900/25 border border-green-200/70 dark:border-green-500/40 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Signature generated. Share this with the user so they can mint.
                    </span>
                  </div>
                  <textarea
                    className="w-full rounded border px-2 py-1 text-xs bg-background font-mono"
                    rows={3}
                    readOnly
                    value={signature}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopySignature}>
                      Copy signature
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const lines = [
                          'Biet identity verification signature',
                          '',
                          `Target address: ${targetAddress}`,
                          `Full name: ${name}`,
                          `DID: ${did}`,
                          `Country: ${country}`,
                          `Verification level: ${level}`,
                          '',
                          'Signature (paste this into the mint form):',
                          signature,
                        ];
                        const body = encodeURIComponent(lines.join('\n'));
                        const mailto = `mailto:?subject=Biet%20Identity%20Verification%20Signature&body=${body}`;
                        window.location.href = mailto;
                      }}
                    >
                      Send signature via email
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSign}
                disabled={
                  isSigning ||
                  !isConnected ||
                  !targetAddress ||
                  hasVerifierRole === false
                }
                className="flex items-center gap-2 w-full"
              >
                {isSigning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                {isSigning ? 'Signing…' : 'Sign attestation'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
