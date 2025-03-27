"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) router.push("/profile");
    else alert("Невірний логін або пароль");
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Sign in with Google
      </button>

      <div className="text-center text-sm text-gray-600 space-y-1">
        <p>
          Немає акаунта?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Зареєструватися
          </a>
        </p>
        <p>
          <a
            href="/reset-password/request"
            className="text-blue-500 hover:underline"
          >
            Забули пароль?
          </a>
        </p>
      </div>
    </div>
  );
}
