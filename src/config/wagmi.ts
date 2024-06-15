import { injected } from "@wagmi/connectors";
import { createConfig, http } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});
