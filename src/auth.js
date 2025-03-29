import NextAuth from "next-auth";
import { authConfig } from "@/utils/auth/authConfig.js";

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
