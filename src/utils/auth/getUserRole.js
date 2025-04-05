import { auth } from "@/auth";

export async function getUserRole() {
  const session = await auth();
  console.log("🚀 ~ getUserRole session:", session?.user);
  return session?.user?.role;
}
