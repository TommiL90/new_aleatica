'use server'

import { signIn } from "@/lib/auth"

export async function loginWithAzureAd() {
  // NextAuth throws a NEXT_REDIRECT error on successful sign in
  // This is expected behavior for redirects in Server Actions
  await signIn("azure-ad", {
    redirectTo: "/usuarios/profile",
  })
}
