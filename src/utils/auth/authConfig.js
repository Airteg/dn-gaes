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
        console.log("authConfig -> authorize -> user:", {
          email: credentials.email,
          found: !!user,
        });
        if (!user) throw new Error("UserNotRegistered");
        if (!user.methods?.includes("credentials")) {
          console.log("Credentials: No credentials method:", {
            email: credentials.email,
          });
          throw new Error("UseDifferentMethod");
        }

        const isValid = bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Credentials: Invalid password:", {
            email: credentials.email,
          });
          throw new Error("InvalidPassword");
        }

        console.log("Credentials: User authenticated:", {
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
    async jwt({ token, user }) {
      if (user) {
        console.log("✅ user:", !!user);
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account }) {
      // ✅ Повністю пропускаємо обробку OAuth-реєстрації/входу
      if (account?.provider !== "credentials") return true;

      // 🔒 Вхід через email: можна логувати
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      await users.updateOne(
        { email: user.email },
        { $set: { lastLogin: new Date() } },
      );

      return true;
    },

    async session({ session, token }) {
      const client = await clientPromise;
      const db = client.db();
      const user = await db
        .collection("users")
        .findOne({ email: session.user.email });
      // console.log("authConfig -> user", user);
      if (user) {
        session.user.id = user._id.toString();
        session.user.name = user.name;
        session.user.role = user.role;
        session.user.status = user.status;
        session.user.methods = user.methods;
        token.role = user.role;
      }

      return session;
    },
  },
};
