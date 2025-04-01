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
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      // Оновлюємо lastLogin для існуючого користувача
      const existingUser = await users.findOne({ email: user.email });
      if (existingUser) {
        await users.updateOne(
          { email: user.email },
          { $set: { lastLogin: new Date() } },
        );
      }
      return true; // Дозволяємо адаптеру завершити зв’язування
    },
    async session({ session, token }) {
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
