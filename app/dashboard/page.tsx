"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Brain,
  Users,
  Activity,
  Calendar,
  MessageCircle,
  Video,
  FileText,
  Shield,
  Wallet,
  Bell,
  Search,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [walletBalance, setWalletBalance] = useState("0.0")

  useEffect(() => {
    setMounted(true)
    // Simulate wallet balance fetch
    setWalletBalance("2.45")
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                HealthAI Platform
              </h1>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Advanced AI-powered healthcare platform for doctors and patients, combining cutting-edge technology with
                medical expertise.
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 w-64 bg-background/50" />
              </div>

              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs">3</Badge>
              </Button>

              <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border">
                <Wallet className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{walletBalance} ETH</span>
              </div>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Welcome to HealthAI Platform</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced AI-powered healthcare platform for doctors and patients, combining cutting-edge technology with
                medical expertise.
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Doctor</CardTitle>
                    <CardDescription className="text-base">
                      Access your patient records, use AI diagnosis tools, and manage appointments.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span>AI-powered diagnosis tools</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Electronic Health Records</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-blue-500" />
                      <span>Telemedicine platform</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Blockchain security</span>
                    </div>
                  </div>
                  <Link href="/doctor-dashboard">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      Continue as Doctor
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500/50 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Patient</CardTitle>
                    <CardDescription className="text-base">
                      View your medical records, schedule appointments, and communicate with your doctors.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span>Health monitoring dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span>Smart appointment booking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <span>AI health assistant</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Secure medical records</span>
                    </div>
                  </div>
                  <Link href="/patient-dashboard">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Continue as Patient
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Key Features Grid */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">Key Features</h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">AI Diagnosis</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced machine learning models for disease detection and analysis
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Blockchain Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Decentralized authentication and encrypted medical records
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Video className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Telemedicine</h4>
                    <p className="text-sm text-muted-foreground">
                      High-quality video consultations with real-time collaboration
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <MessageCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">AI Assistant</h4>
                    <p className="text-sm text-muted-foreground">Intelligent chatbot for health queries and support</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Patients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">2K+</div>
                  <div className="text-sm text-muted-foreground">Healthcare Providers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">AI Accuracy</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
