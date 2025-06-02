import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("wallet_address", params.wallet).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
