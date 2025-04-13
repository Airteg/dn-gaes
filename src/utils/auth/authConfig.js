import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/utils/db";
import { ObjectId } from "mongodb";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = (await clientPromise).db();
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user || !user.password) {
          console.log("❌ Користувача не знайдено або не встановлено пароль:", {
            email: credentials.email,
          });

          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.log("🚫 Невірний пароль:", {
            email: credentials.email,
          });

          return null;
        }

        console.log("✅ Користувача автентифіковано:", {
          email: credentials.email,
        });

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-authjs.session-token`
          : `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // domain видалений
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const db = (await clientPromise).db();
      const users = db.collection("users");
      const existing = await users.findOne({ email: user.email });

      if (account.provider === "google") {
        if (!existing) {
          const newUser = {
            email: user.email,
            name: user.name,
            role: "user",
            methods: ["google"],
            createdAt: new Date(),
            lastLogin: new Date(),
          };
          const result = await users.insertOne(newUser);
          user.id = result.insertedId.toString();
          console.log("🆕✅ Створено нового користувача Google:", {
            email: user.email,
            id: user.id,
          });
        } else {
          await users.updateOne(
            { email: user.email },
            {
              $set: { lastLogin: new Date() },
              $addToSet: { methods: "google" },
            },
          );
          user.id = existing._id.toString();
          console.log("🔄✅ Оновлено користувача Google:", {
            email: user.email,
            id: user.id,
          });
        }
      } else if (account.provider === "credentials" && existing) {
        await users.updateOne(
          { email: user.email },
          { $set: { lastLogin: new Date() } },
        );
        user.id = existing._id.toString();
        console.log("🔐✅ Оновлено користувача Credentials:", {
          email: user.email,
          id: user.id,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        token.name = user.name;
      }
      if (token.id) {
        try {
          const db = (await clientPromise).db();
          const dbUser = await db
            .collection("users")
            .findOne({ _id: ObjectId.createFromHexString(token.id) });
          if (dbUser) {
            token.role = dbUser.role || "user";
            console.log("🔑 JWT оновлено:", {
              email: dbUser.email,
              role: token.role,
            });
          } else {
            console.log("❌ Користувача не знайдено в jwt callback:", {
              id: token.id,
            });
          }
        } catch (error) {
          console.error("🧨 Помилка в jwt callback:", error);
        }
      } else {
        console.log("⚠️ Відсутній token.id у jwt callback");
      }
      return token;
    },
    async session({ session, token }) {
      const db = (await clientPromise).db();
      const user = await db
        .collection("users")
        .findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
        session.user.role = user.role || "user";
        session.user.name = user.name;
        console.log("🆗 Сесію оновлено:", {
          email: session.user.email,
          role: session.user.role,
        });
      } else {
        console.log("❌ Користувача не знайдено в session callback:", {
          email: session.user.email,
        });
      }
      // Додаємо дебаг для cookies
      console.log("🍪 Session callback — встановлено cookie:", {
        sessionToken:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
      });

      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("➡️ Redirect callback — версія 2:", {
        url,
        baseUrl,
      });

      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },
};
