import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const analysisType = formData.get("analysis_type") as string
    const patientId = formData.get("patient_id") as string

    if (!image || !analysisType || !patientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert image to base64 for processing
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    // Simulate AI prediction (replace with actual model)
    const mockPrediction = Math.random() > 0.5 ? "Anemic" : "Non-Anemic"
    const mockConfidence = Math.random() * 40 + 60 // 60-100%

    // Save analysis to database
    const { data: analysis, error } = await supabase
      .from("anemia_analyses")
      .insert([
        {
          patient_id: patientId,
          analysis_type: analysisType,
          prediction: mockPrediction,
          confidence: mockConfidence,
          roi_detected: true,
          image_data: base64Image.substring(0, 1000), // Store first 1000 chars for demo
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      analysis,
      result: {
        prediction: mockPrediction,
        confidence: mockConfidence,
        roi_detected: true,
        recommendations:
          mockPrediction === "Anemic"
            ? [
                "Consult with a hematologist",
                "Increase iron-rich foods in diet",
                "Consider iron supplements",
                "Regular blood tests recommended",
              ]
            : ["Continue healthy diet", "Regular health checkups", "Monitor for any symptoms"],
      },
    })
  } catch (error) {
    console.error("Error in anemia detection:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patient_id")

    let query = supabase
      .from("anemia_analyses")
      .select(`
        *,
        patient:users!anemia_analyses_patient_id_fkey(name, email)
      `)
      .order("created_at", { ascending: false })

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data: analyses, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, analyses })
  } catch (error) {
    console.error("Error fetching anemia analyses:", error)
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
  }
}
