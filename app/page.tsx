"use client";
import React, { useEffect, useMemo, useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2, RefreshCw, Coins } from "lucide-react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { celo } from "wagmi/chains";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { rewardConfig } from "@/abis/reward";
import { formatTime, formatTokenAmount, TOKEN_ADDRESS } from "@/utils";

export default function CommonsTokenClaimPage() {
  const [tokenPrice, setTokenPrice] = useState(null);

  const { toast } = useToast();
  const account = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  const countdownTime = useReadContract({
    abi: rewardConfig.abi,
    address: rewardConfig.address as `0x${string}`,
    functionName: "timeUntilNextClaim",
    args: [account.address as `0x${string}`],
    query: {
      refetchInterval: 1,
    },
  });

  const canClaim = useReadContract({
    abi: rewardConfig.abi,
    address: rewardConfig.address as `0x${string}`,
    functionName: "canClaimReward",
    args: [account.address as `0x${string}`],
    query: {
      refetchInterval: 1,
    },
  });

  const whitelisted = useReadContract({
    abi: rewardConfig.abi,
    address: rewardConfig.address as `0x${string}`,
    functionName: "whitelist",
    args: [account.address as `0x${string}`],
    query: {
      refetchInterval: 1,
    },
  });


  const tokenBalance = useBalance({
    address: account.address,
    chainId: celo.id,
    token: TOKEN_ADDRESS as `0x${string}`,
    query: {
      refetchInterval: 1,
    },
  });

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    chainId: celo.id,
    hash: hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Tx successfully confirmed",
        description: "Copy",
        action: (
          <ToastAction
            altText="Copy to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(`https://celoscan.io/tx/${hash}`);
            }}
          >
            Copy
          </ToastAction>
        ),
      });
    }
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tx failed",
        action: (
          <ToastAction
            altText="Copy to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(`https://celoscan.io/tx/${hash}`);
            }}
          >
            Copy
          </ToastAction>
        ),
      });
    }
  }, [isSuccess, isError]);

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-[350px]">
          <CardHeader className="text-center items-center">
            <CardTitle>Commons Builder Income</CardTitle>
            <CardDescription>
              You can claim 10 $COMMONS every 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {account.isConnected && (
              <div className="text-center mb-4">
                <p className="font-bold">Your Balance</p>
                <p className="text-2xl">
                  {`${formatTokenAmount(
                    tokenBalance.data?.value!,
                    tokenBalance.data?.decimals!
                  )}`}
                  {` $COMMONS`}
                </p>
                {tokenPrice !== null ? (
                  <p className="text-sm text-gray-500">
                    ($
                    {(
                      Number(
                        formatTokenAmount(
                          tokenBalance.data?.value!,
                          tokenBalance.data?.decimals!
                        )
                      ) * tokenPrice
                    ).toFixed(2)}
                    USD)
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Unable to fetch price</p>
                )}
                <Button disabled variant="outline" size="sm" className="mt-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Price
                </Button>
              </div>
            )}
            <ConnectButton />
            <Button
              onClick={() =>
                writeContract(
                  {
                    abi: rewardConfig.abi,
                    address: rewardConfig.address as `0x${string}`,
                    functionName: "claimReward",
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Success",
                        description: "tx sent successfully.",
                      });
                    },
                    onError: (e) => {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: e.message,
                      });
                    },
                  }
                )
              }
              className="w-full"
              disabled={isLoading || !account.isConnected || !canClaim.data}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4" />
              ) : (
                <Coins className="mr-2 h-4 w-4" />
              )}
              {!whitelisted.data ? "Not Eligible" : !canClaim.data ? "Patience, young commoner" : "Claim 10 $COMMONS"}
            </Button>
            <div className="text-center items-center">
              <p className="font-bold">Next Claim In</p>
              <p className="text-xl">
                {account.isConnected
                  ? formatTime(Number(countdownTime.data))
                  : "--------"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
