"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { celo } from "wagmi/chains";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

import { commonsConfig } from "@/abis/commons";
import { praiseConfig } from "@/abis/praise";
import { UserData } from "@/data";
import { ENSResolver } from "@/lib/ens";
import { DefaultAvatar } from "@/public";

const formSchema = z.object({
  comment: z
    .string()
    .min(2, {
      message: "Comment must be between 2 and 50 characters",
    })
    .max(50, {
      message: "Comment must be between 2 and 50 characters",
    }),
  amount: z.string(),
  address: z.string(),
});

export default function Tipping({ name, address, imageUrl }: UserData) {
  const account = useAccount();

  const ensResolver = new ENSResolver();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      amount: "",
      address: address,
    },
  });

  const { data: hash, writeContract } = useWriteContract();

  async function handleSetAllowance(amount: string) {
    const allowanceAmount = parseUnits(amount, 18);
    writeContract(
      {
        abi: commonsConfig.abi,
        address: commonsConfig.address as `0x${string}`,
        functionName: "approve",
        args: [praiseConfig.address as `0x${string}`, allowanceAmount],
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Allowance set successfully.",
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
    );
  }

  async function praise(
    comment: string,
    recipient: `0x${string}`,
    amount: string
  ) {
    const tippedAmount = parseUnits(amount, 18);

    writeContract(
      {
        abi: praiseConfig.abi,
        address: praiseConfig.address as `0x${string}`,
        functionName: "praiseWithTip",
        args: [
          comment,
          account.address as `0x${string}`,
          recipient,
          tippedAmount,
        ],
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Tx submitted successfully.",
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
    );
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { comment, amount, address } = data;

    const recipient = await ensResolver.resolveAddress(address);

    await handleSetAllowance(amount);
    await praise(comment, recipient as `0x${string}`, amount);
  }

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    chainId: celo.id,
    hash: hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Tx successfully confirmed",
        description: "Tx confirmed",
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
  }, [isSuccess, isError, hash, toast]);
  return (
    <div className="flex items-center justify-between shadow-lg w-full max-w-xl p-4 rounded-md mx-auto">
      <div className="flex items-center flex-grow">
        <Image
          src={imageUrl || DefaultAvatar}
          alt={name}
          className="rounded-full object-cover mr-4"
          width={48}
          height={48}
        />
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-600 font-mono break-all">{address}</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger>tip</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tip to {name} with comment</DialogTitle>
            <DialogDescription>
              tipped amount will be sent to {name} directly. The comment and
              amount will be stored on-chain via EAS.
            </DialogDescription>
            <a
              className="text-sm text-gray-600 font-mono break-all"
              href={`https://celo.easscan.org/schema/view/0x593a851ab1a1c24f811b6fc5a4df86a4df7dd14f441c2d99476af3d5ef56341a`}
              target="_blank"
              rel="noreferrer"
            >
              view schema on easscan
            </a>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Leave a comment"
                        className="border border-gray-300 rounded-md p-2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave a comment for {name}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-4 gap-2">
                        <Input
                          id="amount"
                          placeholder="0"
                          className="border border-gray-300 rounded-md p-2"
                          {...field}
                        />
                        $COMMONS
                      </div>
                    </FormControl>
                    <FormDescription>
                      Leave a comment for {name}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading || !account.isConnected}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
