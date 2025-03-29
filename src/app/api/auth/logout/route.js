// import { NextResponse } from "next/server";

// export async function POST() {
//   return NextResponse.json({ message: "Вихід успішний" }, { status: 200 });
// }
import { logout } from "@/utils/authActions/auth";

export async function POST() {
  await logout();
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
