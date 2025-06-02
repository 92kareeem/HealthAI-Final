"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, FileText, Upload } from "lucide-react"
import Link from "next/link"

export default function AddMedicalRecordPage() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    record_type: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        // 20MB limit
        toast({
          title: "Error",
          description: "File size must be less than 20MB",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData = localStorage.getItem("healthai_user")
      if (!userData) {
        toast({
          title: "Error",
          description: "Please log in first",
          variant: "destructive",
        })
        return
      }

      const user = JSON.parse(userData)

      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: user.id,
          doctor_id: user.id, // For now, same user
          title: formData.title,
          description: formData.description,
          record_type: formData.record_type,
          file_name: selectedFile?.name || null,
          file_size: selectedFile?.size || null,
          ipfs_hash: null, // Will implement file upload later
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Medical record added successfully!",
        })
        setFormData({
          title: "",
          description: "",
          record_type: "",
        })
        setSelectedFile(null)
      } else {
        throw new Error(data.error || "Failed to add medical record")
      }
    } catch (error) {
      console.error("Error adding medical record:", error)
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/medical-records" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Medical Record</h1>
          <p className="text-muted-foreground">Upload and store your medical documents</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            New Medical Record
          </CardTitle>
          <CardDescription>Add a new medical record to your health profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Blood Test Results"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="record_type">Record Type *</Label>
              <Select value={formData.record_type} onValueChange={(value) => handleInputChange("record_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab_results">Lab Results</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="imaging">Medical Imaging</SelectItem>
                  <SelectItem value="consultation">Consultation Notes</SelectItem>
                  <SelectItem value="vaccination">Vaccination Record</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Additional notes or description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 20MB</p>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-green-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || !formData.title || !formData.record_type} className="flex-1">
                {loading ? "Adding..." : "Add Record"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/medical-records">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
