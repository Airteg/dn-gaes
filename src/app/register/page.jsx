"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nickname: "",
    position: "",
    placeOfWork: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Реєстрація успішна! Очікуйте підтвердження адміністратора.");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(data.error || "Помилка реєстрації.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="p-6 bg-white/20 shadow-md rounded-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4">Реєстрація</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="text"
          name="firstName"
          placeholder="Ім'я"
          required
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Прізвище"
          required
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="nickname"
          placeholder="Нікнейм"
          required
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          required
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Посада"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="placeOfWork"
          placeholder="Місце роботи"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Зареєструватися
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:underline">
            Вже маєте акаунт? Увійти
          </a>
        </div>
      </form>
    </div>
  );
}
