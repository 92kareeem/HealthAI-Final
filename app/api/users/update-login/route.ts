import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet_address } = body

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("wallet_address", wallet_address)
      .select()
      .single()

    if (error) {
      console.error("Error updating login:", error)
      return NextResponse.json({ error: "Failed to update login" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (error) {
    console.error("Error updating login:", error)
    return NextResponse.json({ error: "Failed to update login" }, { status: 500 })
  }
}
