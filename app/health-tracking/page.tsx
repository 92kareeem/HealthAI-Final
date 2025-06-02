"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Heart, Activity, Thermometer, Weight, Ruler } from "lucide-react"
import Link from "next/link"

export default function HealthTrackingPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    heart_rate: "",
    blood_pressure: "",
    temperature: "",
    weight: "",
    height: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

      const response = await fetch("/api/health-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: user.id,
          heart_rate: formData.heart_rate ? Number.parseInt(formData.heart_rate) : null,
          blood_pressure: formData.blood_pressure || null,
          temperature: formData.temperature ? Number.parseFloat(formData.temperature) : null,
          weight: formData.weight ? Number.parseFloat(formData.weight) : null,
          height: formData.height ? Number.parseFloat(formData.height) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Health data saved successfully!",
        })
        setFormData({
          heart_rate: "",
          blood_pressure: "",
          temperature: "",
          weight: "",
          height: "",
        })
      } else {
        throw new Error(data.error || "Failed to save health data")
      }
    } catch (error) {
      console.error("Error saving health data:", error)
      toast({
        title: "Error",
        description: "Failed to save health data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/patient-dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Health Tracking</h1>
          <p className="text-muted-foreground">Log your vital signs and health metrics</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Record Health Data
          </CardTitle>
          <CardDescription>Enter your current health metrics. All fields are optional.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heart_rate" className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Heart Rate (bpm)
                </Label>
                <Input
                  id="heart_rate"
                  type="number"
                  placeholder="e.g., 72"
                  value={formData.heart_rate}
                  onChange={(e) => handleInputChange("heart_rate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_pressure" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Blood Pressure
                </Label>
                <Input
                  id="blood_pressure"
                  placeholder="e.g., 120/80"
                  value={formData.blood_pressure}
                  onChange={(e) => handleInputChange("blood_pressure", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 36.5"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-green-500" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 70.5"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-purple-500" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 175"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Health Data"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/patient-dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
