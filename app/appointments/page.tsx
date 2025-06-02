"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, Video, MapPin, Stethoscope, Plus, CheckCircle, AlertCircle, Phone } from "lucide-react"

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [timeSlot, setTimeSlot] = useState("")

  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Wilson",
      specialty: "Cardiology",
      rating: 4.9,
      experience: "15 years",
      avatar: "/placeholder.svg?height=40&width=40",
      nextAvailable: "Today 2:00 PM",
      consultationFee: "$150",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      rating: 4.8,
      experience: "12 years",
      avatar: "/placeholder.svg?height=40&width=40",
      nextAvailable: "Tomorrow 10:00 AM",
      consultationFee: "$180",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      rating: 4.9,
      experience: "10 years",
      avatar: "/placeholder.svg?height=40&width=40",
      nextAvailable: "Dec 15 3:00 PM",
      consultationFee: "$120",
    },
  ]

  const upcomingAppointments = [
    {
      id: "1",
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiology",
      date: "Today",
      time: "2:00 PM",
      type: "Follow-up",
      status: "confirmed",
      location: "Video Call",
    },
    {
      id: "2",
      doctor: "Dr. Michael Chen",
      specialty: "Neurology",
      date: "Dec 15",
      time: "10:00 AM",
      type: "Consultation",
      status: "pending",
      location: "Room 205",
    },
  ]

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Appointment Management</h1>
                <p className="text-muted-foreground">Schedule and manage your medical appointments</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-muted-foreground">Upcoming</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Video Calls</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Book New Appointment */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Book New Appointment</CardTitle>
                    <CardDescription>Schedule an appointment with our healthcare professionals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Doctor Selection */}
                    <div className="space-y-4">
                      <Label>Select Doctor</Label>
                      <div className="grid gap-4">
                        {doctors.map((doctor) => (
                          <Card
                            key={doctor.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedDoctor === doctor.id ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950" : ""
                            }`}
                            onClick={() => setSelectedDoctor(doctor.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    <Stethoscope className="w-6 h-6" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{doctor.name}</h3>
                                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs">⭐ {doctor.rating}</span>
                                    <span className="text-xs">{doctor.experience}</span>
                                    <span className="text-xs font-medium text-green-600">{doctor.consultationFee}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">Next Available</p>
                                  <p className="text-sm text-muted-foreground">{doctor.nextAvailable}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appointment-type">Appointment Type</Label>
                        <Select value={appointmentType} onValueChange={setAppointmentType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="check-up">Regular Check-up</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="visit-type">Visit Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-person">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                In-Person Visit
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                Video Consultation
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Call
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div>
                      <Label>Select Time Slot</Label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={timeSlot === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeSlot(slot)}
                            className={timeSlot === slot ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Reason for Visit */}
                    <div>
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        placeholder="Please describe your symptoms or reason for the appointment..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={!selectedDoctor || !appointmentType || !timeSlot}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar and Upcoming Appointments */}
              <div className="space-y-6">
                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{appointment.doctor}</h4>
                          <Badge
                            variant={appointment.status === "confirmed" ? "default" : "secondary"}
                            className={appointment.status === "confirmed" ? "bg-green-500" : ""}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          {appointment.location === "Video Call" ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {appointment.location}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
