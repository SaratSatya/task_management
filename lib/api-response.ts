import { NextResponse } from "next/server";

export function successResponse(
  message: string,
  data?: unknown,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data: data ?? null,
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status: number = 500,
  errors?: Record<string, string | string[]>
) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors: errors ?? null,
    },
    { status }
  );
}