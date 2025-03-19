import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/db";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Users: "users",
    },
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        token.status = user.status || "pending";
        token.nickname = user.nickname || null;
        token.position = user.position || null;
        token.placeOfWork = user.placeOfWork || null;
        token.avatar = user.image || "/public/default-avatar.png"; // 🔹 Замінюємо image на avatar
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.nickname = token.nickname;
        session.user.position = token.position;
        session.user.placeOfWork = token.placeOfWork;
        session.user.avatar = token.avatar; // 🔹 Передаємо `avatar` у сесію
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const db = (await clientPromise).db();
      await db.collection("users").updateOne(
        { _id: user.id },
        {
          $set: {
            role: "user",
            status: "pending",
            nickname: null,
            position: null,
            placeOfWork: null,
            avatar: user.image || "/public/default-avatar.png", // 🔹 Додаємо avatar в базу
          },
        },
      );
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
