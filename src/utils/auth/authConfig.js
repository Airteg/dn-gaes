import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/db";
import Google from "next-auth/providers/google";

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn called:", {
        email: user.email,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      const existingUser = await users.findOne({ email: user.email });
      if (existingUser) {
        console.log("Existing user found:", { email: existingUser.email });
        await users.updateOne(
          { email: user.email },
          { $set: { lastLogin: new Date() } },
        );
        return true;
      }

      console.log("User not found, blocking login:", { email: user.email });
      return "/register?error=UserNotRegistered";
    },
    async session({ session, token }) {
      console.log("session called:", {
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
      }
      return session;
    },
  },
};
