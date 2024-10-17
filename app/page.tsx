"use client";
import React, { useEffect, useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2, Check, Coins } from "lucide-react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
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

export default function CommonsTokenClaimPage() {
  const { toast } = useToast();
  const { data: hash, writeContract } = useWriteContract();

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Commons Token Claim</CardTitle>
            <CardDescription>
              Connect your wallet and claim your tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConnectButton />
            {/* <Button
              onClick={checkEligibility}
              // disabled={!walletConnected}
              className="w-full"
            >
              <Check className="mr-2 h-4 w-4" />
              Check Eligibility
            </Button>
            {isEligible !== null && (
              <Alert variant={isEligible ? "default" : "destructive"}>
                <AlertTitle>
                  {isEligible ? "Eligible" : "Not Eligible"}
                </AlertTitle>
                <AlertDescription>
                  {isEligible
                    ? "You are eligible to claim Commons tokens."
                    : "Sorry, you are not eligible to claim Commons tokens."}
                </AlertDescription>
              </Alert>
            )} */}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4" />
              ) : (
                <Coins className="mr-2 h-4 w-4" />
              )}
              Claim Tokens
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
