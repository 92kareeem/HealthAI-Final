"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  MessageCircle,
  Users,
  FileText,
  Video,
  Heart,
  Search,
  Bell,
  Settings,
  Plus,
  TrendingUp,
  AlertCircle,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const patients = [
    { id: 1, name: "John Doe", age: 45, condition: "Hypertension", lastVisit: "2 days ago", status: "stable" },
    { id: 2, name: "Sarah Smith", age: 32, condition: "Diabetes", lastVisit: "1 week ago", status: "monitoring" },
    { id: 3, name: "Mike Johnson", age: 58, condition: "Heart Disease", lastVisit: "3 days ago", status: "critical" },
    { id: 4, name: "Emily Brown", age: 28, condition: "Asthma", lastVisit: "5 days ago", status: "stable" },
  ]

  const appointments = [
    { id: 1, patient: "John Doe", time: "9:00 AM", type: "Follow-up", duration: "30 min" },
    { id: 2, patient: "Sarah Smith", time: "10:30 AM", type: "Video Call", duration: "20 min" },
    { id: 3, patient: "Mike Johnson", time: "2:00 PM", type: "Consultation", duration: "45 min" },
    { id: 4, patient: "Emily Brown", time: "3:30 PM", type: "Check-up", duration: "30 min" },
  ]

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
            <Badge className="bg-green-100 text-green-700">Doctor Portal</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search patients..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>DW</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Wilson!</h1>
          <p className="text-gray-600">You have 8 appointments today and 3 urgent messages</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-gray-600">Today's Appointments</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">Unread Messages</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-600">Urgent Cases</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Today's Schedule</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appointment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {appointment.type === "Video Call" ? (
                          <Video className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Stethoscope className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{appointment.patient}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.time} • {appointment.duration}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {appointment.type === "Video Call" && (
                          <Badge className="bg-green-100 text-green-600">Video</Badge>
                        )}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Patients you've seen recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients
                    .filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((patient) => (
                      <div key={patient.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            Age: {patient.age} • {patient.condition}
                          </p>
                          <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              patient.status === "critical"
                                ? "destructive"
                                : patient.status === "monitoring"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {patient.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View Records
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Write Prescription
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>

            {/* Urgent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Urgent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-sm">Mike Johnson</p>
                    <p className="text-xs text-red-600">Chest pain reported - requires immediate attention</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-sm">Sarah Smith</p>
                    <p className="text-xs text-yellow-600">Blood sugar levels elevated</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-sm">Emily Brown</p>
                    <p className="text-xs text-orange-600">Medication refill request</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Messages
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  AI Practice Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Patient Trends</p>
                    <p className="text-xs text-blue-600">15% increase in respiratory cases this week</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Efficiency Tip</p>
                    <p className="text-xs text-green-600">
                      Consider grouping similar appointments to optimize schedule
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Drug Interaction Alert</p>
                    <p className="text-xs text-purple-600">2 patients have potential medication conflicts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Patient Satisfaction</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Appointments Completed</span>
                      <span className="font-semibold">42/45</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "93%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Response Time</span>
                      <span className="font-semibold">&lt; 2 hours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "88%" }}></div>
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
