import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patient_id")

    let query = supabase
      .from("health_records")
      .select(`
        *,
        patient:users!health_records_patient_id_fkey(name, email)
      `)
      .order("recorded_at", { ascending: false })

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data: records, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, records })
  } catch (error) {
    console.error("Error fetching health records:", error)
    return NextResponse.json({ error: "Failed to fetch health records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: record, error } = await supabase
      .from("health_records")
      .insert([
        {
          patient_id: body.patient_id,
          heart_rate: body.heart_rate,
          blood_pressure: body.blood_pressure,
          temperature: body.temperature,
          weight: body.weight,
          height: body.height,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error("Error creating health record:", error)
    return NextResponse.json({ error: "Failed to create health record" }, { status: 500 })
  }
}
