"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Thermometer,
  Activity,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function AISymptomChecker() {
  const [step, setStep] = useState(1)
  const [symptoms, setSymptoms] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        condition: "Upper Respiratory Infection",
        confidence: 85,
        urgency: "Low",
        recommendations: [
          "Rest and stay hydrated",
          "Consider over-the-counter pain relievers",
          "Monitor symptoms for 3-5 days",
          "Seek medical attention if symptoms worsen",
        ],
        whenToSeek:
          "Immediate medical attention if you experience difficulty breathing, high fever (>101.5°F), or symptoms persist beyond 7 days",
      })
      setIsAnalyzing(false)
      setStep(3)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/patient-dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HealthAI</span>
          </Link>
          <Badge className="bg-purple-100 text-purple-700">AI Symptom Checker</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">AI Symptom Assessment</CardTitle>
              <CardDescription>
                Describe your symptoms and get an AI-powered preliminary assessment. This is not a substitute for
                professional medical advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="symptoms" className="text-base font-medium">
                  What symptoms are you experiencing?
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail (e.g., headache, fever, cough, fatigue...)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-base font-medium">
                    How long have you had these symptoms?
                  </Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 days, 1 week"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="severity" className="text-base font-medium">
                    Severity (1-10 scale)
                  </Label>
                  <Input
                    id="severity"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1 = mild, 10 = severe"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!symptoms || !duration || !severity}
              >
                Continue Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Additional Information</CardTitle>
              <CardDescription>Help us provide a more accurate assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Vital Signs (if known)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-red-500" />
                      <Input placeholder="Temperature (°F)" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-500" />
                      <Input placeholder="Heart Rate (bpm)" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <Input placeholder="Blood Pressure" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Medical History</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Diabetes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Hypertension</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Heart Disease</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Allergies</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleAnalyze}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Analyze Symptoms
                  <Brain className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && !isAnalyzing && results && (
          <div className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Assessment Complete</CardTitle>
                <CardDescription>Based on your symptoms, here's what our AI analysis suggests</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Preliminary Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Possible Condition:</span>
                      <Badge className="bg-blue-100 text-blue-700">{results.condition}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Confidence Level:</span>
                      <span className="text-green-600 font-semibold">{results.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Urgency Level:</span>
                      <Badge variant={results.urgency === "Low" ? "secondary" : "destructive"}>{results.urgency}</Badge>
                    </div>
                  </div>
                  <Progress value={results.confidence} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    When to Seek Care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">{results.whenToSeek}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3">Self-Care Recommendations:</h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Next Steps:</h3>
                    <div className="space-y-2">
                      <Link href="/book-appointment">
                        <Button className="w-full justify-start" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Doctor Appointment
                        </Button>
                      </Link>
                      <Link href="/telemedicine">
                        <Button className="w-full justify-start" variant="outline">
                          <Clock className="w-4 h-4 mr-2" />
                          Schedule Video Consultation
                        </Button>
                      </Link>
                      <Link href="/patient-dashboard">
                        <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Return to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">Important Disclaimer</h3>
                    <p className="text-sm text-red-700">
                      This AI assessment is for informational purposes only and should not replace professional medical
                      advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Analyzing Your Symptoms</h2>
              <p className="text-gray-600 mb-6">Our AI is processing your information...</p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <span>Processing symptom patterns</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <span>Comparing with medical database</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span>Generating recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
