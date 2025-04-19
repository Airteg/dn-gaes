import { auth } from "@/auth.js";
import React from "react";

export default async function AuthorizationHandle() {
  const session = await auth();
  // console.log("🚀 ~ session:", session);
  return <div>AH</div>;
}
