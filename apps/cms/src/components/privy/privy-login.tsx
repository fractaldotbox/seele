"use client";

import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import type { PropsWithChildren } from "react";
import { useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import { baseSepolia } from "viem/chains";

export const PrivyLoginProvider = ({
  children,
  appId,
}: PropsWithChildren<{ appId: string }>) => {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export const PrivyLogin = () => {
  const { ready: isReady, authenticated: isAuthenticated, login } = usePrivy();
  const disableLogin = !isReady || (isReady && isAuthenticated);

  return (
    <Button disabled={disableLogin} onClick={login}>
      Login
    </Button>
  );
};

export const PrivyLogout = () => {
  const { authenticated: isAuthenticated, logout } = usePrivy();
  const { disconnect } = useDisconnect();
  const disableLogout = !isAuthenticated;

  return (
    <Button
      disabled={disableLogout}
      onClick={async () => {
        await disconnect();
        await logout();
      }}
    >
      Logout
    </Button>
  );
};
