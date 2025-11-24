import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

export default async function SessionProviderForClient({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider basePath={"/auth"} session={session}>
      {children}
    </SessionProvider>
  );
}
