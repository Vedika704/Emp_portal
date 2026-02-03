import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL || "NOT FOUND",
    JWT_SECRET: process.env.JWT_SECRET || "NOT FOUND",
  });
}
