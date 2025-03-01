"use client";

import { Toaster } from "@/components/ui/sonner";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../config/queryClient";
import { config as wagmiConfig } from "../config/wagmiConfig";
import { PrivyLoginProvider } from "./privy/privy-login";
interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<PrivyLoginProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={wagmiConfig}>
					{children}
					<Toaster />
				</WagmiProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</PrivyLoginProvider>
	);
}
