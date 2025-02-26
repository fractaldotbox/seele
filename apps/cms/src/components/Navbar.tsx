"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useAccount } from "wagmi";
import { PrivyLogin, PrivyLogout } from "./privy/privy-login";

export const Navbar = () => {
	const { authenticated: isAuthenticated } = usePrivy();
	const { address } = useAccount();

	return (
		<nav className="fixed top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/75">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold">
							Seele{" "}
						</Link>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex space-x-4 mr-4">
							<Link
								href="/arena"
								className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
							>
								Arena
							</Link>
							<Link
								href="/cms"
								className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
							>
								CMS
							</Link>
						</div>
						{isAuthenticated ? (
							<>
								{address && (
									<div className="text-sm text-gray-700 dark:text-gray-300 text-bold border border-gray-300 rounded-md px-2 py-1">
										{address.slice(0, 6)}...{address.slice(-4)}
									</div>
								)}
								<PrivyLogout />
							</>
						) : (
							<PrivyLogin />
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
