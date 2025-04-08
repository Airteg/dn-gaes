import ResetPasswordForm from "@/components/resetPassword/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div>
      <h1>Скидання пароля</h1>
      <Suspense fallback={<p>Завантаження...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
