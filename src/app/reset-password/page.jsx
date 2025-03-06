"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <h1>Відновлення пароля</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Новий пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button type="submit">Змінити пароль</button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
