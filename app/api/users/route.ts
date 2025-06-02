import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet_address")

    if (walletAddress) {
      // Get specific user by wallet address
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      return NextResponse.json({ success: true, user })
    } else {
      // Get all users
      const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return NextResponse.json({ success: true, users })
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // First check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", body.wallet_address)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    // If user exists, update instead of insert
    if (existingUser) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          name: body.name,
          email: body.email,
          role: body.role,
          specialization: body.specialization,
          license_number: body.license_number,
          hospital: body.hospital,
          is_verified: body.role === "patient",
          last_login_at: new Date().toISOString(),
        })
        .eq("wallet_address", body.wallet_address)
        .select()
        .single()

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: "User profile updated successfully",
      })
    }

    // If user doesn't exist, create new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          wallet_address: body.wallet_address,
          name: body.name,
          email: body.email,
          role: body.role,
          specialization: body.specialization,
          license_number: body.license_number,
          hospital: body.hospital,
          is_verified: body.role === "patient",
        },
      ])
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
