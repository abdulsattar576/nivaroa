import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ products: [] });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, quantity, is_featured, image_path")
    .ilike("name", `%${q.trim()}%`)
    .limit(8);

  if (error) {
    return NextResponse.json({ products: [] }, { status: 500 });
  }

  return NextResponse.json({ products: data || [] });
}

