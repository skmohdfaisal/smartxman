import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/blog";
    const secret = searchParams.get("secret");

    const validSecret = process.env.REVALIDATION_SECRET || "smartxman-revalidate-secret";
    if (secret && secret !== validSecret) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    revalidatePath(path);
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
