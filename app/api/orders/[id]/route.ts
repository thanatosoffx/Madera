import { NextResponse } from "next/server";
import { getOrderWithLogs } from "@/lib/db/orders";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const order = await getOrderWithLogs(params.id).catch(() => null);
  if (!order) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json(order);
}
