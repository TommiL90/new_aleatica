"use client";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { AbilityProvider } from "./ability-context";

interface CaslProviderProps {
  children: React.ReactNode;
}

export const CaslProvider = ({ children }: CaslProviderProps) => {
  const session = useSession();

  if (session.status === "loading") {
    return null;
  }

  const user = session.data?.user as User;
  return <AbilityProvider user={user}>{children}</AbilityProvider>;
};
