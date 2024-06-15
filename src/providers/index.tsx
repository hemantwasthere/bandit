"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { ConnectKitProvider } from "connectkit";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

// const config = createConfig(
//   getDefaultConfig({
//     appName: "ConnectKit Next.js demo",
//     walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
//     chains: [scrollSepolia, polygonMumbai],
//   })
// );

// 1. Your WalletConnect Cloud project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

// 2. Create wagmiConfig
const metadata = {
  name: "Bandit",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, sepolia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions // Optional - Override createConfig parameters
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>
          <Toaster
            position="bottom-right"
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "bg-[#FFDEAD] border gap-3 right-0 font-semibold border-mainBg text-black/80 flex items-center p-4 rounded-xl shadow-lg bg-[linear-gradient(180deg,_#ffdead_0%,_#e1d77d_100%)]",
              },
            }}
          />

          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
