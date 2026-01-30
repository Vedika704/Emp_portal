import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // 🔑 delete token cookie
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // use lax for consistency with login
    path: "/",
    maxAge: 0, // delete cookie
  });

  // ✅ create response with JSON and attach cookie
  const res = new NextResponse(
    JSON.stringify({ message: "Logged out" }),  
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    }
  );

  return res;
}
