"use client";

import Link from "next/link";
import { PrivyLogin, PrivyLogout } from "./privy/privy-login";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

export const Navbar = () => {
  const { authenticated: isAuthenticated } = usePrivy();
  const { address } = useAccount();

  return (
    <nav className="fixed top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              AI Model Voting
            </Link>
          </div>

          <div className="flex items-center gap-4">
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
