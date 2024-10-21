"use client";
import React, { useEffect } from "react";

import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
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
import { UserData } from "@/data";
import { useEthersSigner } from "@/hooks/useEthers";
import { ENSResolver } from "@/lib/ens";
import { DefaultAvatar } from "@/public";
import { SCHEMA_UID } from "@/utils";
const EASContractAddress = "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92";

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
  const signer = useEthersSigner({ chainId: 42220 });
  const eas = new EAS(EASContractAddress);
  eas.connect(signer!);

  const schemaEncoder = new SchemaEncoder(
    "string praise, address from, address to"
  );

  const { data: hash, writeContract } = useWriteContract();

  async function sendCommons(recipient: `0x${string}`, amount: string) {
    const tippedAmount = BigInt(amount) * BigInt(10 ** 18);
    writeContract({
      abi: commonsConfig.abi,
      address: commonsConfig.address as `0x${string}`,
      functionName: "transfer",
      args: [recipient, tippedAmount],
    });
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { comment, amount, address } = data;

    const recipient = await ensResolver.resolveAddress(address);

    console.log("account:", account.address);
    console.log("recipient:", recipient);

    const encodedData = schemaEncoder.encodeData([
      { name: "praise", type: "string", value: comment },
      { name: "from", type: "address", value: account.address! },
      { name: "to", type: "address", value: recipient! },
    ]);

    const transaction = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient: recipient!,
        expirationTime: BigInt(0),
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await transaction.wait();
    console.log("New attestation UID:", newAttestationUID);
    console.log("Transaction receipt:", transaction.receipt);

    sendCommons(recipient as `0x${string}`, amount);
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
              href={`https://celo.easscan.org/schema/view/0xa1215b03d4956c2e07792ccc30da1b48742a2c6dde9b12d2c97d5b16cf8263b8`}
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
