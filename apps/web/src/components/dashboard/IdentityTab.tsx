"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useSignMessage, usePublicClient, useWalletClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Award,
  CheckCircle,
  FileText,
  Globe,
  Hash,
  Loader2,
  Shield,
  TrendingUp,
  User,
} from "lucide-react";
import { Client, ConsentState, type Identifier, type Signer } from "@xmtp/browser-sdk";
import { encodePacked, hexToBytes, keccak256 } from "viem";
import { useWallet } from "@/contexts/WalletContext";
import { 
  BIET_IDENTITY_ADDRESS,
  BIET_IDENTITY_ABI,
} from "@/config/contracts";

export function IdentityTab() {
  const { address } = useAccount();
  const { isAdmin } = useWallet();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [adminTarget, setAdminTarget] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminDid, setAdminDid] = useState("");
  const [adminCountry, setAdminCountry] = useState("");
  const [adminLevel, setAdminLevel] = useState("basic");
  const [adminSignature, setAdminSignature] = useState<string | null>(null);

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userDid, setUserDid] = useState("");
  const [didTouched, setDidTouched] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [userLevel, setUserLevel] = useState("basic");
  const [userSignature, setUserSignature] = useState("");

  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [xmtpStatus, setXmtpStatus] = useState<
    "idle" | "connecting" | "listening" | "signature_received" | "unreachable" | "error"
  >("idle");
  const [xmtpError, setXmtpError] = useState<string | null>(null);

  const fullUserName = `${userFirstName} ${userLastName}`.trim();

  const computeDid = () => {
    if (userDid) return userDid;
    if (!address || !fullUserName) return "";
    const didBase = fullUserName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return `did:biet:${didBase}:${address.toLowerCase()}`;
  };

  useEffect(() => {
    if (didTouched) return;
    if (!address || !fullUserName) return;
    const didBase = fullUserName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setUserDid(`did:biet:${didBase}:${address.toLowerCase()}`);
  }, [address, fullUserName, didTouched]);

  const isIdentityFormComplete = !!(fullUserName && userCountry && userLevel);

  const verifiers = [
    {
      id: "biet-deployer",
      name: "Biet Deployer Verifier",
      address: "0xdd070e6123c718FD63bf298DF8041889BFcB8b50",
    },
  ];

  const [selectedVerifierId, setSelectedVerifierId] = useState(verifiers.length > 0 ? verifiers[0].id : "");
  const selectedVerifier = verifiers.find((v) => v.id === selectedVerifierId) || verifiers[0];

  const { data: identity } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: BIET_IDENTITY_ABI,
    functionName: "getIdentityByAddress",
    args: address ? [address] : undefined,
  });

  const { data: identityBalance } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: verificationFee } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        inputs: [],
        name: "verificationFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "verificationFee",
  });

  const handleCopyRequestForVerifier = async () => {
    if (!address || !isIdentityFormComplete) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (!origin) return;

    const params = new URLSearchParams({
      address,
      name: fullUserName,
      did: computeDid(),
      country: userCountry,
      level: userLevel,
    });

    const url = `${origin}/verify?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore clipboard errors
    }
  };

  const buildXmtpSigner = (): Signer | null => {
    if (!address || !walletClient) return null;

    const accountIdentifier: Identifier = {
      identifier: address.toLowerCase(),
      identifierKind: "Ethereum",
    };

    const signer: Signer = {
      type: "EOA",
      getIdentifier: () => accountIdentifier,
      signMessage: async (message: string): Promise<Uint8Array> => {
        const signature = await walletClient.signMessage({ account: address, message });
        return hexToBytes(signature as `0x${string}`);
      },
    };

    return signer;
  };

  const handleStartXmtpListener = async () => {
    try {
      setXmtpError(null);
      setXmtpStatus("connecting");

      if (!address || !walletClient || !selectedVerifier || !isIdentityFormComplete) {
        setXmtpStatus("error");
        setXmtpError("Connect wallet, complete the form, and select a verifier first.");
        return;
      }

      const signer = buildXmtpSigner();
      if (!signer) {
        setXmtpStatus("error");
        setXmtpError("Unable to build XMTP signer for this wallet.");
        return;
      }

      let client = xmtpClient;
      if (!client) {
        client = await Client.create(signer, { env: "dev" });
        setXmtpClient(client);
      }

      const identifiers: Identifier[] = [
        { identifier: selectedVerifier.address.toLowerCase(), identifierKind: "Ethereum" },
      ];

      const canMsgMap = await Client.canMessage(identifiers);
      const canMessageVerifier = canMsgMap.get(selectedVerifier.address.toLowerCase());

      if (!canMessageVerifier) {
        setXmtpStatus("unreachable");
        setXmtpError("Verifier is not reachable on XMTP dev network.");
        return;
      }

      setXmtpStatus("listening");

      const stream = await client.conversations.streamAllMessages({
        consentStates: [ConsentState.Allowed],
        onValue: (message: any) => {
          try {
            if (xmtpStatus === "signature_received") return;
            const raw = (message && (message.content ?? message)) as unknown;
            const text = typeof raw === "string" ? raw : String(raw ?? "");
            const trimmed = text.trim();
            if (trimmed.startsWith("0x") && trimmed.length > 100) {
              setUserSignature(trimmed as `0x${string}`);
              setXmtpStatus("signature_received");
            }
          } catch {
            // ignore
          }
        },
        onError: (err: any) => {
          setXmtpStatus("error");
          setXmtpError(err?.message ?? "XMTP stream error");
        },
      });

      void stream;
    } catch (e: any) {
      setXmtpStatus("error");
      setXmtpError(e?.message ?? "Failed to start XMTP listener.");
    }
  };

  const handleAdminGenerateSignature = async () => {
    if (!adminTarget) return;

    const nonce = await publicClient.readContract({
      address: BIET_IDENTITY_ADDRESS,
      abi: [
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "mintNonces",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ] as const,
      functionName: "mintNonces",
      args: [adminTarget as `0x${string}`],
    });

    const identityHash = keccak256(
      encodePacked(
        ["address", "string", "string", "string", "string", "uint256"],
        [adminTarget, adminName, adminDid, adminCountry, adminLevel, nonce as bigint],
      ),
    );

    const signature = await signMessageAsync({
      message: { raw: identityHash },
    });

    setAdminSignature(signature);
  };

  const handleUserMintWithSignature = () => {
    if (!address || !userSignature || !isIdentityFormComplete || !verificationFee) return;

    writeContract({
      address: BIET_IDENTITY_ADDRESS,
      abi: [
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "did", type: "string" },
            { internalType: "string", name: "country", type: "string" },
            { internalType: "string", name: "verificationLevel", type: "string" },
            { internalType: "bytes", name: "signature", type: "bytes" },
          ],
          name: "mintIdentity",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ] as const,
      functionName: "mintIdentity",
      args: [
        address,
        fullUserName,
        computeDid(),
        userCountry,
        userLevel,
        userSignature as `0x${string}`,
      ],
      value: verificationFee as bigint,
    });
  };

  const createdAtRaw = identity && ((identity as any).createdAt ?? (identity as any)[4]);
  const createdAtNumber =
    typeof createdAtRaw === "bigint" || typeof createdAtRaw === "number" ? Number(createdAtRaw) : null;
  const createdAtFormatted =
    createdAtNumber && createdAtNumber > 0
      ? new Date(createdAtNumber * 1000).toLocaleString()
      : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Identity
          </CardTitle>
          <CardDescription>
            Create and manage your decentralized identity on Biet Network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {identityBalance && identityBalance > 0n && identity ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200/60 dark:border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-700 dark:text-green-300">
                  Identity Created Successfully
                </h4>
              </div>
              <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
                <p>
                  <strong>Full Name:</strong> {(identity as any).name ?? (identity as any)[0]}
                </p>
                <p>
                  <strong>DID:</strong> {(identity as any).did ?? (identity as any)[1]}
                </p>
                <p>
                  <strong>Country:</strong> {(identity as any).country ?? (identity as any)[2]}
                </p>
                <p>
                  <strong>Verification Level:</strong>{" "}
                  {(identity as any).verificationLevel ?? (identity as any)[3]}
                </p>
                <p>
                  <strong>Created At:</strong> {createdAtFormatted ? createdAtFormatted : "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200/60 dark:border-yellow-500/40 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-100">
                No identity found for this address yet. Use the verifier attestation flow
                below to mint your verified identity on-chain.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-700 dark:text-red-300">Error Creating Identity</h4>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-700 dark:text-green-300">Transaction Confirmed!</h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your identity has been created on the blockchain.
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">📋 Identity Information</h4>
            <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
              <p>• Your identity is stored on-chain and cryptographically secure</p>
              <p>• Includes verification levels and country information</p>
              <p>• Required for full participation in Biets</p>
              <p>• Can be updated but never deleted</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Identity Fields</CardTitle>
          <CardDescription>Information stored in your on-chain identity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">DID (Decentralized ID)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Country</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Verification Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Reputation Score</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Created Date</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Verifier Tools (Admin / Biet)</CardTitle>
            <CardDescription>
              Generate attestation signatures for user identities (client-side only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Only wallets with the on-chain VERIFIER_ROLE should use this. Make sure the fields you enter here
              match exactly what the user will enter in the mint form; otherwise the signature will be rejected.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="User address (0x...)"
                value={adminTarget}
                onChange={(e) => setAdminTarget(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Full name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="DID (optional)"
                value={adminDid}
                onChange={(e) => setAdminDid(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Country"
                value={adminCountry}
                onChange={(e) => setAdminCountry(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Verification level (basic/verified/premium)"
                value={adminLevel}
                onChange={(e) => setAdminLevel(e.target.value)}
              />
            </div>
            <Button onClick={handleAdminGenerateSignature} disabled={isPending || isConfirming}>
              Generate Attestation Signature
            </Button>
            {adminSignature && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Signature (share with user or use directly to mint):
                </p>
                <textarea
                  className="w-full rounded border px-3 py-2 text-xs bg-background font-mono"
                  rows={3}
                  value={adminSignature}
                  readOnly
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(!identityBalance || identityBalance === 0n) && (
        <Card className="border border-emerald-200/70 dark:border-emerald-700/60 bg-white dark:bg-gray-900/60">
          <CardHeader>
            <CardTitle>Mint Identity with Attestation</CardTitle>
            <CardDescription>Use a verifier-provided signature to mint your identity on-chain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              The values below must be identical to what your verifier used when generating the signature (address,
              name, DID, country, verification level). If any field differs, the contract will treat the signature as
              invalid.
            </p>
            <p className="text-xs text-muted-foreground">
              Share these fields with a trusted verifier (with VERIFIER_ROLE). They will paste them into the Verifier
              Tools card above, generate a signature, and send it back to you to paste here.
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              First name, last name, country, and verification level are required before you can generate links or mint
              your identity.
            </p>
            {verifiers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
                <span className="text-muted-foreground">Select verifier:</span>
                <select
                  className="rounded border bg-background px-2 py-1 text-xs"
                  value={selectedVerifierId}
                  onChange={(e) => setSelectedVerifierId(e.target.value)}
                >
                  {verifiers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.address.slice(0, 6)}...{v.address.slice(-4)})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">First name</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  placeholder="First name"
                  value={userFirstName}
                  onChange={(e) => setUserFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                  Last name (apellidos)
                </label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  placeholder="Last name"
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">DID (optional)</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  placeholder="did:... (leave blank to auto-generate)"
                  value={userDid}
                  onChange={(e) => {
                    setUserDid(e.target.value);
                    setDidTouched(true);
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Country</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  value={userCountry}
                  onChange={(e) => setUserCountry(e.target.value)}
                >
                  <option value="">Select country</option>
                  <option value="MX">Mexico</option>
                  <option value="US">United States</option>
                  <option value="CO">Colombia</option>
                  <option value="AR">Argentina</option>
                  <option value="ES">Spain</option>
                  <option value="BR">Brazil</option>
                  <option value="CL">Chile</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                  Verification level
                </label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="basic">basic</option>
                  <option value="verified">verified</option>
                  <option value="premium">premium</option>
                </select>
              </div>
            </div>
            <textarea
              className="w-full rounded border px-3 py-2 text-xs bg-background font-mono"
              rows={3}
              placeholder="Verifier signature (0x...)"
              value={userSignature}
              onChange={(e) => setUserSignature(e.target.value)}
            />
            {xmtpStatus !== "idle" && (
              <p className="text-[11px] text-muted-foreground">
                {xmtpStatus === "connecting" && "Connecting to XMTP dev network…"}
                {xmtpStatus === "listening" &&
                  "Listening for verifier messages on XMTP. Ask them to reply with the signature."}
                {xmtpStatus === "signature_received" &&
                  "Signature received via XMTP and applied. You can now mint your identity."}
                {xmtpStatus === "unreachable" &&
                  "Verifier is not reachable on XMTP dev network. Use copy link or email instead."}
                {xmtpStatus === "error" && xmtpError && `XMTP error: ${xmtpError}`}
              </p>
            )}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Button
                onClick={handleUserMintWithSignature}
                disabled={
                  isPending ||
                  isConfirming ||
                  !isIdentityFormComplete ||
                  !userSignature ||
                  !verificationFee
                }
                className="flex items-center gap-2 flex-1"
              >
                {isPending || isConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                Mint My Verified Identity
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto text-xs"
                onClick={handleCopyRequestForVerifier}
                disabled={!isIdentityFormComplete || !address}
              >
                Copy verification link
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto text-xs"
                onClick={() => {
                  const origin = typeof window !== "undefined" ? window.location.origin : "";
                  if (!origin || !address || !isIdentityFormComplete) return;
                  const params = new URLSearchParams({
                    address,
                    name: fullUserName,
                    did: computeDid(),
                    country: userCountry,
                    level: userLevel,
                  });
                  const url = `${origin}/verify?${params.toString()}`;
                  const mailto = `mailto:?subject=Biet%20Identity%20Verification&body=${encodeURIComponent(
                    `Please open this link with your verifier wallet to sign my identity attestation:\n\n${url}`,
                  )}`;
                  window.location.href = mailto;
                }}
              >
                Send link via email
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto text-xs"
                onClick={handleStartXmtpListener}
                disabled={
                  !isIdentityFormComplete ||
                  !address ||
                  xmtpStatus === "connecting" ||
                  xmtpStatus === "listening"
                }
              >
                {xmtpStatus === "listening" || xmtpStatus === "connecting"
                  ? "Listening on XMTP…"
                  : "Listen for XMTP signature"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
