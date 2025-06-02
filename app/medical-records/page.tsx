"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, FileText, Search, Plus, Calendar } from "lucide-react"
import Link from "next/link"

interface MedicalRecord {
  id: string
  title: string
  description: string
  record_type: string
  file_name: string
  created_at: string
  status: string
  patient?: { name: string; email: string }
  doctor?: { name: string; specialization: string }
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadMedicalRecords()
  }, [])

  const loadMedicalRecords = async () => {
    try {
      const userData = localStorage.getItem("healthai_user")
      if (!userData) return

      const user = JSON.parse(userData)

      const response = await fetch(`/api/medical-records?patient_id=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setRecords(data.records)
      } else {
        throw new Error(data.error || "Failed to load records")
      }
    } catch (error) {
      console.error("Error loading medical records:", error)
      toast({
        title: "Error",
        description: "Failed to load medical records",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(
    (record) =>
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.record_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "lab_results":
        return "bg-blue-100 text-blue-800"
      case "prescription":
        return "bg-green-100 text-green-800"
      case "imaging":
        return "bg-purple-100 text-purple-800"
      case "consultation":
        return "bg-orange-100 text-orange-800"
      case "vaccination":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medical records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/patient-dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">View and manage your medical documents</p>
        </div>
        <Button asChild>
          <Link href="/medical-records/add">
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search records..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medical Records</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No records match your search." : "You haven't added any medical records yet."}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/medical-records/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Record
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {record.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {record.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <Badge className={getRecordTypeColor(record.record_type)}>
                    {record.record_type.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                    {record.file_name && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {record.file_name}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{record.status}</Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
