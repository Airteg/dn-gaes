"use client";

import { logout } from "@/utils/authActions/auth.js";
import Button from "./ui/Button.jsx";

export default function ButtonLogout() {
  return (
    <Button
      onClick={() => logout()}
      className="ml-4 bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
    >
      Вийти
    </Button>
  );
}
