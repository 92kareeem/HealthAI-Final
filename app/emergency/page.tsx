"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Ambulance,
  Phone,
  Video,
  AlertTriangle,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Zap,
  Play,
  Users,
  Timer,
  Shield,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function EmergencyPage() {
  const [emergencyType, setEmergencyType] = useState("")
  const [location, setLocation] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [ambulanceStatus, setAmbulanceStatus] = useState("idle")
  const [eta, setEta] = useState(0)
  const [clientValue, setClientValue] = useState<number | null>(null)

  const emergencyTypes = [
    { id: "cardiac", name: "Cardiac Emergency", icon: Heart, priority: "critical", color: "red" },
    { id: "stroke", name: "Stroke/Neurological", icon: Brain, priority: "critical", color: "red" },
    { id: "respiratory", name: "Breathing Difficulty", icon: Activity, priority: "high", color: "orange" },
    { id: "trauma", name: "Accident/Trauma", icon: AlertTriangle, priority: "high", color: "orange" },
    { id: "general", name: "General Emergency", icon: Stethoscope, priority: "medium", color: "yellow" },
  ]

  const emergencyDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Emergency",
      specialty: "Emergency Medicine",
      status: "available",
      responseTime: "< 30 seconds",
      rating: 4.9,
    },
    {
      id: "2",
      name: "Dr. Michael Trauma",
      specialty: "Trauma Surgery",
      status: "available",
      responseTime: "< 1 minute",
      rating: 4.8,
    },
    {
      id: "3",
      name: "Dr. Lisa Cardio",
      specialty: "Cardiology",
      status: "busy",
      responseTime: "< 2 minutes",
      rating: 4.9,
    },
  ]

  const emergencyVideos = [
    {
      id: "1",
      title: "CPR - Cardiopulmonary Resuscitation",
      duration: "3:45",
      views: "2.1M",
      doctor: "Dr. Sarah Emergency",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "2",
      title: "Choking - Heimlich Maneuver",
      duration: "2:30",
      views: "1.8M",
      doctor: "Dr. Michael Trauma",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "3",
      title: "Stroke Recognition - FAST Method",
      duration: "4:15",
      views: "1.5M",
      doctor: "Dr. Lisa Cardio",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const handleEmergencyCall = async () => {
    setIsConnecting(true)
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false)
      // Redirect to video call or show connection established
    }, 3000)
  }

  const handleAmbulanceRequest = async () => {
    setAmbulanceStatus("requesting")
    // Simulate ambulance booking
    setTimeout(() => {
      setAmbulanceStatus("dispatched")
      setEta(12) // 12 minutes ETA
    }, 2000)
  }

  useEffect(() => {
    if (ambulanceStatus === "dispatched" && eta > 0) {
      const timer = setInterval(() => {
        setEta((prev) => (prev > 0 ? prev - 1 : 0))
      }, 60000) // Update every minute
      return () => clearInterval(timer)
    }
  }, [ambulanceStatus, eta])

  useEffect(() => {
    setClientValue(window.innerWidth) // or Date.now(), Math.random(), etc.
  }, [])

  if (clientValue === null) return null // or a loading state

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Emergency Header */}
      <header className="bg-red-600 text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold">HealthAI Emergency</span>
            </Link>
            <Badge className="bg-red-800 text-white animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              EMERGENCY MODE
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-90">Emergency Hotline</p>
              <p className="text-lg font-bold">+1-800-HEALTH-AI</p>
            </div>
            <Button
              onClick={handleEmergencyCall}
              disabled={isConnecting}
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              {isConnecting ? (
                <>
                  <Timer className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Call
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Alert */}
        <div className="bg-red-100 border border-red-300 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h2 className="text-xl font-bold text-red-800">Emergency Services Active</h2>
              <p className="text-red-700">
                If this is a life-threatening emergency, call your local emergency number (911, 112, etc.) immediately.
                This platform provides additional support and guidance.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Emergency Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Zap className="w-6 h-6" />
                  Immediate Emergency Actions
                </CardTitle>
                <CardDescription>Get instant help for critical situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleEmergencyCall}
                    disabled={isConnecting}
                    className="h-20 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <div className="text-center">
                      <Video className="w-8 h-8 mx-auto mb-2" />
                      <div>Emergency Video Call</div>
                      <div className="text-xs opacity-90">Connect with doctor now</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleAmbulanceRequest}
                    disabled={ambulanceStatus !== "idle"}
                    className="h-20 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <div className="text-center">
                      <Ambulance className="w-8 h-8 mx-auto mb-2" />
                      <div>Request Ambulance</div>
                      <div className="text-xs opacity-90">Priority dispatch</div>
                    </div>
                  </Button>
                </div>

                {ambulanceStatus !== "idle" && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Ambulance className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-800">
                          Ambulance {ambulanceStatus === "requesting" ? "Requesting..." : "Dispatched"}
                        </p>
                        {eta > 0 && (
                          <p className="text-orange-600">
                            ETA: {eta} minutes • Tracking ID: AMB-{Math.random().toString(36).substr(2, 9)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Emergency</CardTitle>
                <CardDescription>Help us understand your situation for better assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Emergency Type</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    {emergencyTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={emergencyType === type.id ? "default" : "outline"}
                        onClick={() => setEmergencyType(type.id)}
                        className={`h-16 justify-start ${
                          emergencyType === type.id
                            ? type.color === "red"
                              ? "bg-red-600 hover:bg-red-700"
                              : type.color === "orange"
                                ? "bg-orange-600 hover:bg-orange-700"
                                : "bg-yellow-600 hover:bg-yellow-700"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <type.icon className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-semibold">{type.name}</div>
                            <div className="text-xs opacity-75">Priority: {type.priority}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms Description</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe what's happening in simple terms..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      placeholder="Address or landmark"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Emergency Contact</Label>
                    <Input id="contact" placeholder="Phone number" />
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Submit Emergency Request
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Emergency Response Videos
                </CardTitle>
                <CardDescription>
                  Doctor-created emergency response guides in simple, easy-to-understand language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {emergencyVideos.map((video) => (
                    <div key={video.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="relative mb-3">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" className="rounded-full bg-red-600 hover:bg-red-700">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                          {video.duration}
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-1">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">By {video.doctor}</p>
                      <p className="text-xs text-gray-500">{video.views} views</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Sidebar */}
          <div className="space-y-6">
            {/* Available Emergency Doctors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Emergency Doctors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>
                          <Stethoscope className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{doctor.name}</h4>
                        <p className="text-xs text-gray-600">{doctor.specialty}</p>
                      </div>
                      <Badge
                        variant={doctor.status === "available" ? "default" : "secondary"}
                        className={doctor.status === "available" ? "bg-green-500" : ""}
                      >
                        {doctor.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Response: {doctor.responseTime}</span>
                      <span>⭐ {doctor.rating}</span>
                    </div>
                    {doctor.status === "available" && (
                      <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
                        <Video className="w-3 h-3 mr-1" />
                        Connect Now
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-red-800">Local Emergency</p>
                    <p className="text-sm text-red-600">Life-threatening emergencies</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    911
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-blue-800">Poison Control</p>
                    <p className="text-sm text-blue-600">Poisoning emergencies</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Call
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">Mental Health</p>
                    <p className="text-sm text-green-600">Crisis support</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Emergency Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Stay Calm</p>
                      <p className="text-xs text-yellow-600">Take deep breaths and think clearly</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Assess Safety</p>
                      <p className="text-xs text-blue-600">Ensure the area is safe before helping</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Call for Help</p>
                      <p className="text-xs text-green-600">Don't hesitate to call emergency services</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
