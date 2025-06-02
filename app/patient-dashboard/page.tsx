"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Brain, Video, Heart, Activity, Bell, Settings, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { User, HealthRecord, MedicalRecord, AnemiaAnalysis } from "@/lib/supabase"

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [anemiaAnalyses, setAnemiaAnalyses] = useState<AnemiaAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
    loadHealthData()
  }, [])

  const loadUserData = () => {
    // Get user from localStorage (set during authentication)
    const userData = localStorage.getItem("healthai_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }

  const loadHealthData = async () => {
    try {
      const userData = localStorage.getItem("healthai_user")
      if (!userData) return

      const user = JSON.parse(userData)

      // Load health records
      const healthResponse = await fetch(`/api/health-records?patient_id=${user.id}`)
      const healthData = await healthResponse.json()
      if (healthData.success) {
        setHealthRecords(healthData.records)
      }

      // Load medical records
      const medicalResponse = await fetch(`/api/medical-records?patient_id=${user.id}`)
      const medicalData = await medicalResponse.json()
      if (medicalData.success) {
        setMedicalRecords(medicalData.records)
      }

      // Load anemia analyses
      const anemiaResponse = await fetch(`/api/anemia-detection?patient_id=${user.id}`)
      const anemiaData = await anemiaResponse.json()
      if (anemiaData.success) {
        setAnemiaAnalyses(anemiaData.analyses)
      }
    } catch (error) {
      console.error("Error loading health data:", error)
      toast({
        title: "Error",
        description: "Failed to load health data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getLatestVitals = () => {
    if (healthRecords.length === 0) return null
    return healthRecords[0] // Most recent record
  }

  const calculateHealthScore = () => {
    // Simple health score calculation based on available data
    let score = 70 // Base score

    const latestVitals = getLatestVitals()
    if (latestVitals) {
      // Heart rate check (60-100 is normal)
      if (latestVitals.heart_rate && latestVitals.heart_rate >= 60 && latestVitals.heart_rate <= 100) {
        score += 10
      }

      // Temperature check (98-99°F is normal)
      if (latestVitals.temperature && latestVitals.temperature >= 36 && latestVitals.temperature <= 37.5) {
        score += 10
      }

      // Recent anemia check
      const recentAnemia = anemiaAnalyses.find((a) => a.prediction === "Non-Anemic")
      if (recentAnemia) {
        score += 10
      }
    }

    return Math.min(score, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const latestVitals = getLatestVitals()
  const healthScore = calculateHealthScore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HealthAI</span>
            </Link>
            <Badge variant="secondary">Patient Portal</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0] || "Patient"}!</h1>
          <p className="text-gray-600">Here's your health overview for today</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/ai-diagnosis">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">AI Diagnosis</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai-diagnosis/anemia-detection">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Anemia Detection</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/medical-records">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Medical Records</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/emergency">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Video className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Emergency</h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestVitals ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{latestVitals.heart_rate || "N/A"}</div>
                      <div className="text-sm text-gray-600">Heart Rate</div>
                      <div className="text-xs text-green-600">
                        {latestVitals.heart_rate && latestVitals.heart_rate >= 60 && latestVitals.heart_rate <= 100
                          ? "Normal"
                          : "Check Required"}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{latestVitals.blood_pressure || "N/A"}</div>
                      <div className="text-sm text-gray-600">Blood Pressure</div>
                      <div className="text-xs text-green-600">Normal</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {latestVitals.temperature ? `${latestVitals.temperature}°C` : "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="text-xs text-green-600">
                        {latestVitals.temperature && latestVitals.temperature >= 36 && latestVitals.temperature <= 37.5
                          ? "Normal"
                          : "Check Required"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No health data recorded yet</p>
                    <Button className="mt-4" onClick={() => (window.location.href = "/health-tracking")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Health Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Medical Records */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Medical Records</CardTitle>
                <Button size="sm" asChild>
                  <Link href="/medical-records">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {medicalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {medicalRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{record.title}</h3>
                          <p className="text-sm text-gray-600">{record.record_type}</p>
                          <p className="text-sm text-gray-500">{new Date(record.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline">{record.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No medical records yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Anemia Analyses */}
            {anemiaAnalyses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Anemia Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {anemiaAnalyses.slice(0, 2).map((analysis) => (
                      <div key={analysis.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm">
                            {analysis.analysis_type === "eye_anemia" ? "Eye" : "Nail"} analysis: {analysis.prediction}
                          </p>
                          <p className="text-xs text-gray-500">
                            Confidence: {analysis.confidence}% • {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600">{healthScore}</div>
                  <div className="text-sm text-gray-600">
                    {healthScore >= 90
                      ? "Excellent"
                      : healthScore >= 80
                        ? "Good"
                        : healthScore >= 70
                          ? "Fair"
                          : "Needs Attention"}
                  </div>
                </div>
                <Progress value={healthScore} className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vital Signs</span>
                    <span className={latestVitals ? "text-green-600" : "text-yellow-600"}>
                      {latestVitals ? "Good" : "No Data"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent Checkup</span>
                    <span className={medicalRecords.length > 0 ? "text-green-600" : "text-yellow-600"}>
                      {medicalRecords.length > 0 ? "Complete" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anemia Status</span>
                    <span
                      className={
                        anemiaAnalyses.some((a) => a.prediction === "Non-Anemic") ? "text-green-600" : "text-yellow-600"
                      }
                    >
                      {anemiaAnalyses.some((a) => a.prediction === "Non-Anemic") ? "Normal" : "Check Needed"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Health Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/ai-diagnosis/anemia-detection">
                    <Activity className="w-4 h-4 mr-2" />
                    Check for Anemia
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/health-tracking">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Health Data
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/emergency">
                    <Heart className="w-4 h-4 mr-2" />
                    Emergency Services
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Health Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthScore >= 85 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Great Health!</p>
                      <p className="text-xs text-green-600">
                        Your health metrics are looking excellent. Keep up the good work!
                      </p>
                    </div>
                  )}

                  {!latestVitals && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Missing Data</p>
                      <p className="text-xs text-yellow-600">
                        Consider logging your vital signs for better health tracking
                      </p>
                    </div>
                  )}

                  {anemiaAnalyses.length === 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Anemia Screening</p>
                      <p className="text-xs text-blue-600">Try our AI-powered anemia detection for early screening</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
