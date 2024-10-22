import { http, createConfig, getEnsAddress, Config } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { normalize } from "viem/ens";

export class ENSResolver {
  private config: Config;

  constructor() {
    this.config = createConfig({
      chains: [mainnet],
      transports: {
        [mainnet.id]: http(),
      },
    });
  }

  async resolveAddress(address: string): Promise<string | null> {
    if (!address) {
      return null;
    }

    try {
      return await getEnsAddress(this.config, {
        name: normalize(address),
      });
    } catch (error) {
      console.error(`Error resolving address for name ${address}:`, error);
      return null;
    }
  }
}
