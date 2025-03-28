import Google from "next-auth/providers/google";
import { db } from "@/utils/db";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   async jwt({ token }) {
  //     const userInDb = await db
  //       .collection("users")
  //       .findOne({ email: token.email });

  //     if (!userInDb) {
  //       // Додаємо користувача з роллю user
  //       await db.collection("users").insertOne({
  //         email: token.email,
  //         name: token.name,
  //         role: "user",
  //         createdAt: new Date(),
  //       });
  //       token.role = "user";
  //     } else {
  //       token.role = userInDb.role;
  //     }

  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.user.role = token.role;
  //     return session;
  //   },
  // },
};
