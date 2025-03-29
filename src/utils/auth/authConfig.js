import Google from "next-auth/providers/google";
// import User from "@/models/User";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   async jwt({ token, account, profile }) {
  //     // 🔹 Викликається тільки після входу (не на кожен запит)
  //     if (account && profile) {
  //       const existingUser = await User.findOne({ email: token.email });

  //       if (!existingUser) {
  //         const newUser = await User.create({
  //           name: profile.name,
  //           email: profile.email,
  //           image: profile.picture,
  //           role: "user", // за замовчуванням
  //           createdAt: new Date(),
  //         });

  //         token.role = newUser.role;
  //       } else {
  //         token.role = existingUser.role;
  //       }
  //     }

  //     return token;
  //   },

  //   async session({ session, token }) {
  //     session.user.role = token.role;
  //     return session;
  //   },
  // },
};
