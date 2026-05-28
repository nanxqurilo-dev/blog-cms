import { NextResponse } from "next/server";

let DB: any = {};

export async function POST(req: Request) {
  const body = await req.json();
  const id = crypto.randomUUID();
  DB[id] = body;
  return NextResponse.json({ id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  return NextResponse.json(DB[id]);
}
