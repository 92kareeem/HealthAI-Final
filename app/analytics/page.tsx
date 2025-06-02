"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Heart,
  Brain,
  Stethoscope,
  AlertTriangle,
  Clock,
  FileText,
  Video,
  Phone,
  Download,
  RefreshCw,
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("consultations")
  const [isLoading, setIsLoading] = useState(false)

  // Sample data for charts
  const consultationData = [
    { name: "Mon", consultations: 45, emergencies: 8, followUps: 12 },
    { name: "Tue", consultations: 52, emergencies: 6, followUps: 15 },
    { name: "Wed", consultations: 48, emergencies: 12, followUps: 18 },
    { name: "Thu", consultations: 61, emergencies: 4, followUps: 22 },
    { name: "Fri", consultations: 55, emergencies: 9, followUps: 16 },
    { name: "Sat", consultations: 38, emergencies: 15, followUps: 8 },
    { name: "Sun", consultations: 42, emergencies: 11, followUps: 10 },
  ]

  const diseaseDistribution = [
    { name: "Cardiovascular", value: 35, color: "#ef4444" },
    { name: "Respiratory", value: 25, color: "#3b82f6" },
    { name: "Diabetes", value: 20, color: "#10b981" },
    { name: "Neurological", value: 12, color: "#8b5cf6" },
    { name: "Others", value: 8, color: "#f59e0b" },
  ]

  const patientHealthTrends = [
    { month: "Jan", avgHealth: 78, criticalCases: 12 },
    { month: "Feb", avgHealth: 82, criticalCases: 8 },
    { month: "Mar", avgHealth: 85, criticalCases: 6 },
    { month: "Apr", avgHealth: 83, criticalCases: 10 },
    { month: "May", avgHealth: 87, criticalCases: 4 },
    { month: "Jun", avgHealth: 89, criticalCases: 3 },
  ]

  const doctorPerformance = [
    {
      id: "1",
      name: "Dr. Sarah Wilson",
      specialty: "Cardiology",
      consultations: 127,
      avgRating: 4.9,
      responseTime: "2.3 min",
      patientSatisfaction: 96,
      emergencyHandled: 23,
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      consultations: 98,
      avgRating: 4.8,
      responseTime: "3.1 min",
      patientSatisfaction: 94,
      emergencyHandled: 18,
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "General Medicine",
      consultations: 156,
      avgRating: 4.7,
      responseTime: "2.8 min",
      patientSatisfaction: 92,
      emergencyHandled: 31,
    },
  ]

  const recentConsultations = [
    {
      id: "1",
      patient: "John Doe",
      patientId: "P-2024-001",
      doctor: "Dr. Sarah Wilson",
      type: "Follow-up",
      date: "2024-01-06",
      time: "14:30",
      duration: "25 min",
      status: "completed",
      prescription: "Updated medication dosage",
      nextAppointment: "2024-01-20",
    },
    {
      id: "2",
      patient: "Maria Garcia",
      patientId: "P-2024-002",
      doctor: "Dr. Michael Chen",
      type: "Emergency",
      date: "2024-01-06",
      time: "09:15",
      duration: "45 min",
      status: "completed",
      prescription: "Immediate treatment protocol",
      nextAppointment: "2024-01-08",
    },
    {
      id: "3",
      patient: "Robert Smith",
      patientId: "P-2024-003",
      doctor: "Dr. Emily Rodriguez",
      type: "Consultation",
      date: "2024-01-06",
      time: "11:00",
      duration: "30 min",
      status: "in-progress",
      prescription: "Pending",
      nextAppointment: "TBD",
    },
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Healthcare Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into consultations, patient health, and doctor performance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
                      <p className="text-3xl font-bold">1,247</p>
                      <p className="text-sm text-green-600">+12% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emergency Cases</p>
                      <p className="text-3xl font-bold">89</p>
                      <p className="text-sm text-red-600">+5% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                      <p className="text-3xl font-bold">2,156</p>
                      <p className="text-sm text-green-600">+8% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                      <p className="text-3xl font-bold">2.4m</p>
                      <p className="text-sm text-green-600">-15% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Consultation Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Consultation Trends</CardTitle>
                  <CardDescription>Daily consultation patterns and emergency cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={consultationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="consultations" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="emergencies" stackId="1" stroke="#ef4444" fill="#ef4444" />
                      <Area type="monotone" dataKey="followUps" stackId="1" stroke="#10b981" fill="#10b981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Disease Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Disease Distribution</CardTitle>
                  <CardDescription>Most common conditions treated this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={diseaseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diseaseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Patient Health Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Health Trends</CardTitle>
                <CardDescription>Average health scores and critical cases over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientHealthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgHealth"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Avg Health Score"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="criticalCases"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Critical Cases"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Doctor Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Doctor Performance Analytics</CardTitle>
                <CardDescription>Comprehensive performance metrics for healthcare providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {doctorPerformance.map((doctor) => (
                    <div key={doctor.id} className="p-6 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>
                              <Stethoscope className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                            <p className="text-muted-foreground">{doctor.specialty}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">⭐ {doctor.avgRating}</Badge>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{doctor.consultations}</p>
                          <p className="text-sm text-muted-foreground">Consultations</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{doctor.responseTime}</p>
                          <p className="text-sm text-muted-foreground">Avg Response</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{doctor.patientSatisfaction}%</p>
                          <p className="text-sm text-muted-foreground">Satisfaction</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{doctor.emergencyHandled}</p>
                          <p className="text-sm text-muted-foreground">Emergencies</p>
                        </div>
                        <div className="text-center">
                          <Progress value={doctor.patientSatisfaction} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-1">Performance</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Consultations with Handoff Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Consultations & Doctor Handoffs</CardTitle>
                <CardDescription>
                  Track consultations with patient IDs for seamless doctor transitions and follow-ups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold">{consultation.patient}</h4>
                            <p className="text-sm text-muted-foreground">ID: {consultation.patientId}</p>
                          </div>
                          <Badge
                            variant={consultation.type === "Emergency" ? "destructive" : "secondary"}
                            className={
                              consultation.type === "Emergency"
                                ? "bg-red-100 text-red-700"
                                : consultation.type === "Follow-up"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                            }
                          >
                            {consultation.type}
                          </Badge>
                        </div>
                        <Badge
                          variant={consultation.status === "completed" ? "default" : "secondary"}
                          className={consultation.status === "completed" ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {consultation.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Doctor</p>
                          <p className="font-medium">{consultation.doctor}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date & Time</p>
                          <p className="font-medium">
                            {consultation.date} at {consultation.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{consultation.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Appointment</p>
                          <p className="font-medium">{consultation.nextAppointment}</p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Prescription/Notes:</span> {consultation.prescription}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          View Records
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          Handoff to Doctor
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Health Monitoring Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Patient Health Monitoring Alerts
                </CardTitle>
                <CardDescription>
                  AI-powered health monitoring with automatic alerts for potential emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800">Critical Alert: John Doe (P-2024-001)</h4>
                        <p className="text-red-600 text-sm">
                          Irregular heart rate detected (BPM: 145). Patient may not be aware. Immediate consultation
                          recommended.
                        </p>
                        <p className="text-xs text-red-500 mt-1">Detected 5 minutes ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Phone className="w-3 h-3 mr-1" />
                          Call Patient
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="w-3 h-3 mr-1" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800">Warning: Maria Garcia (P-2024-002)</h4>
                        <p className="text-yellow-600 text-sm">
                          Blood pressure trending upward (150/95). Medication adjustment may be needed.
                        </p>
                        <p className="text-xs text-yellow-500 mt-1">Detected 1 hour ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule Check-up
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Review History
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800">Info: Robert Smith (P-2024-003)</h4>
                        <p className="text-blue-600 text-sm">
                          Medication adherence improved. Blood sugar levels stabilizing.
                        </p>
                        <p className="text-xs text-blue-500 mt-1">Updated 2 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          View Trends
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
