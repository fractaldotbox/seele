"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useAccount } from "wagmi";
import { PrivyLogin, PrivyLogout } from "./privy/privy-login";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { VerifyHumanityModal } from "./VerifyHumanityModal";
import { useLocalStorage } from "usehooks-ts";
import type { HumanityVerification } from "@/lib/types";
import { verifyHumanity } from "@/lib/humanity";

export const Navbar = () => {
  const { authenticated: isAuthenticated } = usePrivy();
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHumanityVerified, setIsHumanityVerified] = useState(false);
  const [humanityVerification] = useLocalStorage<HumanityVerification>(
    "humanityVerification",
    {
      isHuman: false,
      address: "",
      proof: "",
    },
  );

  useEffect(() => {
    if (address && humanityVerification.proof) {
      const _verifyHumanity = async () => {
        const isValid = await verifyHumanity(
          address,
          humanityVerification.proof,
        );
        setIsHumanityVerified(isValid);
      };

      _verifyHumanity();
    }
  }, [address, humanityVerification.proof]);

  return (
    <>
      <nav className="fixed top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/75 pr-[var(--removed-body-scroll-bar-size)]">
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
                <Link
                  href="/controls"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Access Controls
                </Link>
              </div>

              <div className="border-l border-gray-400 h-8" />

              {isAuthenticated ? (
                <>
                  {address && (
                    <div className="flex flex-col gap-1x items-center px-2 py-1">
                      <div className="text-sm text-gray-700 dark:text-gray-300 text-bold">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </div>
                      <Badge
                        variant={
                          humanityVerification.isHuman
                            ? "default"
                            : "destructive"
                        }
                        className="ml-2"
                      >
                        {humanityVerification.isHuman
                          ? "Humanity Verified"
                          : "Humanity Not Verified"}
                      </Badge>
                    </div>
                  )}

                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="outline"
                  >
                    Verify Humanity
                  </Button>
                  <PrivyLogout />
                </>
              ) : (
                <PrivyLogin />
              )}
            </div>
          </div>
        </div>
      </nav>

      <VerifyHumanityModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};
