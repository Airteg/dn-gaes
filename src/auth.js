import NextAuth from "next-auth";
import { authConfig } from "@/utils/auth/config";

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
