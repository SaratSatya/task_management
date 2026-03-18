import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json(
      {
        success: true,
        message: "Database connected successfully",
        readyState: mongoose.connection.readyState,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}