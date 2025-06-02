"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Brain, FileText, Activity, AlertTriangle, CheckCircle, Upload, Stethoscope } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { AnemiaDetectionCard } from "@/components/ui/anemia-detection-card"

interface DiagnosisResult {
  condition: string
  confidence: number
  category: string
  recommendations: string[]
  urgency: string
  next_steps: string[]
}

export default function AIDiagnosisPage() {
  const [symptoms, setSymptoms] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState(5)
  const [medicalHistory, setMedicalHistory] = useState("")
  const [vitalSigns, setVitalSigns] = useState({
    heart_rate: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    temperature: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [diagnosisType, setDiagnosisType] = useState("general")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("symptoms")

  const handleSymptomAnalysis = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockResult: DiagnosisResult = {
        condition: "Migraine",
        confidence: 87,
        category: "Neurological",
        recommendations: [
          "Rest in a quiet, dark room",
          "Stay hydrated",
          "Consider over-the-counter pain relief like ibuprofen",
          "Apply a cold compress to your forehead"
        ],
        urgency: "medium",
        next_steps: [
          "Monitor symptom progression",
          "Consult a neurologist if symptoms persist beyond 72 hours",
          "Keep a headache diary to identify triggers"
        ]
      };

      setResult(mockResult);
    } catch (err) {
      setError("Failed to connect to AI service")
    } finally {
      setLoading(false)
    }
  }

  const handleImageAnalysis = async () => {
    if (!selectedFile) {
      setError("Please select an image file")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockResult: DiagnosisResult = {
        condition: "Anemia (Iron Deficiency)",
        confidence: 92,
        category: "Hematological",
        recommendations: [
          "Increase iron-rich foods in your diet",
          "Consider iron supplements after consulting with your doctor",
          "Schedule follow-up blood tests in 3 months",
          "Monitor for symptoms like fatigue and shortness of breath"
        ],
        urgency: "low",
        next_steps: [
          "Consult with a hematologist",
          "Complete full blood work panel",
          "Evaluate potential causes of iron deficiency"
        ]
      };

      setResult(mockResult);
    } catch (err) {
      setError("Failed to analyze image")
    } finally {
      setLoading(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Activity className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Medical Diagnosis</h1>
          <p className="text-gray-600 mt-2">
            Advanced AI-powered symptom analysis and medical image diagnosis to help you understand potential health concerns
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Diagnosis Options Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="symptoms">
              <Stethoscope className="h-4 w-4 mr-2" />
              Symptom Analysis
            </TabsTrigger>
            <TabsTrigger value="image">
              <Upload className="h-4 w-4 mr-2" />
              Image Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Symptom Analysis
                </CardTitle>
                <CardDescription>
                  Describe your symptoms in detail for comprehensive AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms Description *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail (e.g., 'Sharp pain in lower right abdomen that started yesterday, worsens with movement')..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-gray-500">
                    Be as specific as possible about location, type of pain, triggers, and timing
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., '3 days', '2 hours'"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity (1-10)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="severity"
                        min={1}
                        max={10}
                        value={[severity]}
                        onValueChange={(value) => setSeverity(value[0])}
                        className="flex-1"
                      />
                      <span className="w-8 text-center font-medium">{severity}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical-history">Medical History</Label>
                  <Input
                    id="medical-history"
                    placeholder="e.g., 'Diabetes, Hypertension, Asthma'"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    List any known medical conditions, separated by commas
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Vital Signs (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                      <Input
                        id="heart-rate"
                        type="number"
                        placeholder="e.g., 72"
                        value={vitalSigns.heart_rate}
                        onChange={(e) => setVitalSigns((prev) => ({ ...prev, heart_rate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 98.6"
                        value={vitalSigns.temperature}
                        onChange={(e) => setVitalSigns((prev) => ({ ...prev, temperature: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bp-systolic">Blood Pressure (Systolic)</Label>
                      <Input
                        id="bp-systolic"
                        type="number"
                        placeholder="e.g., 120"
                        value={vitalSigns.blood_pressure_systolic}
                        onChange={(e) => setVitalSigns((prev) => ({ ...prev, blood_pressure_systolic: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bp-diastolic">Blood Pressure (Diastolic)</Label>
                      <Input
                        id="bp-diastolic"
                        type="number"
                        placeholder="e.g., 80"
                        value={vitalSigns.blood_pressure_diastolic}
                        onChange={(e) => setVitalSigns((prev) => ({ ...prev, blood_pressure_diastolic: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSymptomAnalysis} 
                  disabled={loading || !symptoms.trim()} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image">
            <AnemiaDetectionCard 
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              onAnalyze={handleImageAnalysis}
              loading={loading}
            />
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {result && (
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Brain className="h-5 w-5" />
                AI Diagnosis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{result.condition}</h3>
                  <p className="text-gray-600 mt-1">Category: {result.category}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge variant={getUrgencyColor(result.urgency)} className="flex items-center gap-1">
                    {getUrgencyIcon(result.urgency)}
                    {result.urgency.toUpperCase()} PRIORITY
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{result.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Recommendations:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Next Steps:</h4>
                  <ul className="space-y-2">
                    {result.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.urgency === "high" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Urgent Medical Attention Required</AlertTitle>
                  <AlertDescription>
                    This condition requires immediate medical attention. Please contact emergency services or visit the nearest emergency room without delay.
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}