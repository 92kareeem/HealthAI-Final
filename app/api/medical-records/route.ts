import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patient_id")

    let query = supabase
      .from("medical_records")
      .select(`
        *,
        patient:users!medical_records_patient_id_fkey(name, email),
        doctor:users!medical_records_doctor_id_fkey(name, specialization)
      `)
      .order("created_at", { ascending: false })

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data: records, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, records })
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: record, error } = await supabase
      .from("medical_records")
      .insert([
        {
          patient_id: body.patient_id,
          doctor_id: body.doctor_id,
          record_type: body.record_type,
          title: body.title,
          description: body.description,
          file_name: body.file_name,
          file_size: body.file_size,
          ipfs_hash: body.ipfs_hash,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 })
  }
}
