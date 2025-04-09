"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      {error && <p>Помилка: {error}</p>}
      <button onClick={() => signIn("google")}>Увійти через Google</button>
    </div>
  );
}
