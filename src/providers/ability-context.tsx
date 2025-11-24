"use client";
import { createContextualCan } from "@casl/react";
import type { User } from "next-auth";
import { createContext, type ReactNode, useContext } from "react";
import { type AppAbility, defineAbilitiesFor } from "@/lib/permissions/ability";

const AbilityContext = createContext<AppAbility>({} as AppAbility);

export const AbilityProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) => {
  const ability = defineAbilitiesFor(user);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const Can = createContextualCan(AbilityContext.Consumer);

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useAbility must be used within an AbilityProvider");
  }
  return context;
};
