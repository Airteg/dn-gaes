import SignInForm from "@/components/signIn/SignInForm.jsx";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div>
      <h1>Увійти</h1>
      <Suspense fallback={<p>Завантаження...</p>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
