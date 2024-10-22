"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { celo } from "wagmi/chains";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import {mainnet} from "@wagmi/core/chains";

export const config = getDefaultConfig({
  appName: "$COMMONS Claimer",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [celo, mainnet],
  ssr: true,
});
const client = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <title>$COMMONS Claimer</title>
        <meta
          name="description"
          content="build public goods and earn $COMMONS"
        />
        <link rel="icon" href="/favicon.ico" />
        <WagmiProvider config={config} reconnectOnMount={true}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>
              <Header />
              <Toaster />
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
