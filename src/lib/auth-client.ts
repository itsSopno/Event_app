import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",  // Better Auth runs inside Next.js
})

export const { signUp, signIn, signOut, useSession } = authClient