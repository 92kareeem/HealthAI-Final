import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://zdsgdbuqumziqdlksgoi.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkc2dkYnVxdW16aXFkbGtzZ29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NzUzMjEsImV4cCI6MjA2NDM1MTMyMX0.wd3tAF2R2B0lyf2AV3GV1KN-6JqFxbJpJX3yzGoTES0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          name: string
          email: string
          role: "patient" | "doctor" | "admin"
          specialization: string | null
          license_number: string | null
          hospital: string | null
          is_verified: boolean
          created_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          wallet_address: string
          name: string
          email: string
          role: "patient" | "doctor" | "admin"
          specialization?: string | null
          license_number?: string | null
          hospital?: string | null
          is_verified?: boolean
          created_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          wallet_address?: string
          name?: string
          email?: string
          role?: "patient" | "doctor" | "admin"
          specialization?: string | null
          license_number?: string | null
          hospital?: string | null
          is_verified?: boolean
          created_at?: string
          last_login_at?: string | null
        }
      }
    }
  }
}
