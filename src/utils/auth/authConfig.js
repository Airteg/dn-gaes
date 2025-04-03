import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/db";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email });
        if (!user) {
          console.log("❗ Credentials: User not found:", {
            email: credentials.email,
          });
          throw new Error("UserNotRegistered");
        }

        if (!user.methods.includes("credentials")) {
          console.log("⚠️ Credentials: No credentials method:", {
            email: credentials.email,
          });
          throw new Error("UseDifferentMethod");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          console.log("❌ Credentials: Invalid password:", {
            email: credentials.email,
          });
          throw new Error("InvalidPassword");
        }

        console.log("✅ Credentials: User authenticated:", {
          email: credentials.email,
        });
        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("📦 signIn called:", {
        email: user.email,
        provider: account?.provider,
        providerAccountId: account?.providerAccountId,
      });
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      const existingUser = await users.findOne({ email: user.email });
      if (existingUser) {
        console.log("✅ Existing user found:", {
          email: existingUser.email,
          methods: existingUser.methods,
        });
        if (
          account?.provider === "google" &&
          !existingUser.methods.includes("google")
        ) {
          return "/login?error=UseDifferentMethod";
        }
        await users.updateOne(
          { email: user.email },
          { $set: { lastLogin: new Date() } },
        );
        return true;
      }

      console.log("🆕 New user, redirecting to register:", {
        email: user.email,
      });
      return "/register";
    },
    async session({ session, token }) {
      console.log("📦 session called:", {
        email: session.user.email,
        userId: token.sub,
      });
      const client = await clientPromise;
      const db = client.db();
      const dbUser = await db
        .collection("users")
        .findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.methods = dbUser.methods;
      }
      return session;
    },
  },
};
