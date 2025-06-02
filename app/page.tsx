"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getLanguageList, getTranslations } from "@/lib/languages"
import {
  Heart,
  Brain,
  MessageCircle,
  Video,
  Shield,
  Eye,
  Stethoscope,
  Activity,
  Ambulance,
  Globe,
  Zap,
  Database,
  CheckCircle,
  AlertTriangle,
  Phone,
  Star,
  Users,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Wifi,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  // Removed 'mounted' state as it caused hydration mismatch
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const languages = getLanguageList()
  const t = getTranslations(selectedLanguage)

  useEffect(() => {
    // Client-side only logic for scroll and mouse events
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ["hero", "features", "ai-diagnosis", "emergency", "about"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }))
        })
      },
      { threshold: 0.1 },
    )

    // Observe all sections
    const sections = document.querySelectorAll("[data-animate]")
    sections.forEach((section) => observer.observe(section))

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
    }
  }, []) // Empty dependency array means this runs once on client mount

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleEmergencyClick = () => {
    toast({
      title: "🚨 Emergency Mode Activated",
      description: "Connecting to nearest healthcare providers...",
      variant: "destructive",
    })

    setTimeout(() => {
      router.push("/emergency")
    }, 1500)
  }

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode)
    toast({
      title: "Language Changed",
      description: `Switched to ${languages.find((l) => l.code === langCode)?.name}`,
    })
  }

  const aiDiagnosisFeatures = [
    { icon: Eye, name: t.eyeAnemiaDetection, description: t.eyeAnemiaDesc, color: "from-red-500 to-pink-500" },
    { icon: Heart, name: t.heartDisease, description: t.heartDiseaseDesc, color: "from-blue-500 to-cyan-500" },
    { icon: Activity, name: t.kidneyStone, description: t.kidneyStoneDesc, color: "from-green-500 to-emerald-500" },
    {
      icon: AlertTriangle,
      name: t.cancerScreening,
      description: t.cancerScreeningDesc,
      color: "from-orange-500 to-red-500",
    },
    { icon: Stethoscope, name: t.asthma, description: t.asthmaDesc, color: "from-purple-500 to-indigo-500" },
    { icon: Activity, name: t.diabetes, description: t.diabetesDesc, color: "from-yellow-500 to-orange-500" },
  ]

  // Removed the 'if (!mounted) return null' check
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
        {/* Floating particles removed */}
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HealthAI
              </span>
              <Badge className="ml-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Global Platform
              </Badge>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: "hero", label: t.home },
              { id: "features", label: t.features },
              { id: "ai-diagnosis", label: t.aiDiagnosis },
              { id: "emergency", label: t.emergency },
              { id: "about", label: t.about },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium ${
                  activeSection === item.id ? "text-blue-600" : ""
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-36 border-gray-200 hover:border-blue-300 transition-colors">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{languages.find((l) => l.code === selectedLanguage)?.flag}</span>
                    <span className="hidden sm:inline">{languages.find((l) => l.code === selectedLanguage)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Link href="/auth">
              <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
                {t.signIn}
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
                {t.getStarted}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 pb-10"
        data-animate
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-8 bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 hover:from-blue-200 hover:to-green-200 px-6 py-3 text-sm border-0 shadow-lg">
              <Zap className="w-4 h-4 mr-2" />🚀 AI-Powered Global Healthcare Platform
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              {/* Darker gradient for better visibility */}
              <span className="bg-gradient-to-r from-blue-800 via-purple-800 to-green-800 bg-clip-text text-transparent">
                {t.heroTitle.split(" ").slice(0, 1).join(" ")}
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                {t.heroTitle.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            {/* Adjusted text color for better contrast */}
            <p className="text-xl md:text-2xl text-gray-800 mb-12 max-w-5xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/patient-dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-10 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                >
                  <Heart className="w-6 h-6 mr-3" />
                  {t.patientPortal}
                </Button>
              </Link>
              <Link href="/doctor-dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                >
                  <Stethoscope className="w-6 h-6 mr-3" />
                  {t.doctorPortal}
                </Button>
              </Link>
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-10 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                onClick={handleEmergencyClick}
              >
                <Ambulance className="w-6 h-6 mr-3" />
                {t.emergency}
              </Button>
            </div>

            {/* Emergency Hotline */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 max-w-3xl mx-auto mb-16 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-center gap-6">
                <div className="relative">
                  <Phone className="w-8 h-8 text-red-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 text-xl">{t.emergencyHotline}</h3>
                  <p className="text-red-600 text-lg">{t.emergencyContact}</p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 ml-4" onClick={handleEmergencyClick}>
                  <Play className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "100K+", label: t.globalPatients, icon: Users, color: "text-blue-600" },
                { number: "5K+", label: t.doctorsWorldwide, icon: Stethoscope, color: "text-green-600" },
                { number: "98%", label: t.aiAccuracy, icon: Brain, color: "text-purple-600" },
                { number: "50+", label: t.languagesSupported, icon: Globe, color: "text-orange-600" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border border-gray-100"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements (Adjusted positions and added blur for subtlety) */}
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200/50 rounded-full blur-xl"
        />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-green-200/50 rounded-full blur-xl"
        />
        <div
          className="absolute bottom-40 left-20 w-12 h-12 bg-purple-200/50 rounded-full blur-xl"
        />
      </section>

      {/* AI Diagnosis Features */}
      <section id="ai-diagnosis" className="py-24 bg-gradient-to-br from-white to-blue-50 relative" data-animate>
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${isVisible["ai-diagnosis"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 border-0">
              <Brain className="w-4 h-4 mr-2" />
              Advanced AI Technology
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
              {t.aiDiagnosisTitle}
            </h2>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">{t.aiDiagnosisSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {aiDiagnosisFeatures.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 border border-gray-100 overflow-hidden ${
                  isVisible["ai-diagnosis"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center group-hover:text-gray-800 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-gray-700 text-center leading-relaxed group-hover:text-gray-800 transition-colors">
                  {feature.description}
                </p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/ai-diagnosis">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              >
                <Brain className="w-6 h-6 mr-3" />
                {t.tryAiDiagnosis}
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 bg-gradient-to-br from-blue-50 to-green-50 relative" data-animate>
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 px-4 py-2 border-0">
              <Shield className="w-4 h-4 mr-2" />
              Comprehensive Platform
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
              {t.featuresTitle}
            </h2>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">{t.featuresSubtitle}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Doctor Portal Features */}
            <div
              className={`transition-all duration-1000 ${isVisible.features ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <h3 className="text-4xl font-bold mb-8 text-blue-600 flex items-center">
                  <Stethoscope className="w-10 h-10 mr-4" />
                  {t.doctorPortalTitle}
                </h3>
                <div className="space-y-8">
                  {[
                    {
                      icon: Video,
                      title: t.securedVideoMeetings,
                      desc: t.securedVideoDesc,
                      color: "bg-blue-100 text-blue-600",
                    },
                    {
                      icon: TrendingUp,
                      title: t.realTimeAnalytics,
                      desc: t.realTimeAnalyticsDesc,
                      color: "bg-green-100 text-green-600",
                    },
                    {
                      icon: Database,
                      title: t.ipfsMedicalRecords,
                      desc: t.ipfsMedicalRecordsDesc,
                      color: "bg-purple-100 text-purple-600",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-6 group hover:bg-gray-50 p-4 rounded-2xl transition-all duration-300"
                    >
                      <div
                        className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient Portal Features */}
            <div
              className={`transition-all duration-1000 ${isVisible.features ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <h3 className="text-4xl font-bold mb-8 text-green-600 flex items-center">
                  <Heart className="w-10 h-10 mr-4" />
                  {t.patientPortalTitle}
                </h3>
                <div className="space-y-8">
                  {[
                    {
                      icon: Ambulance,
                      title: t.emergencyCorner,
                      desc: t.emergencyCornerDesc,
                      color: "bg-red-100 text-red-600",
                    },
                    {
                      icon: MessageCircle,
                      title: t.aiChatbotOcr,
                      desc: t.aiChatbotOcrDesc,
                      color: "bg-blue-100 text-blue-600",
                    },
                    {
                      icon: Activity,
                      title: t.healthMonitoring,
                      desc: t.healthMonitoringDesc,
                      color: "bg-orange-100 text-orange-600",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-6 group hover:bg-gray-50 p-4 rounded-2xl transition-all duration-300"
                    >
                      <div
                        className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-2 group-hover:text-green-600 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section id="emergency" className="py-24 bg-gradient-to-br from-red-50 to-orange-50 relative" data-animate>
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${isVisible.emergency ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-4 py-2 border-0">
              <Ambulance className="w-4 h-4 mr-2" />
              Emergency Response
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent">
              {t.emergencyTitle}
            </h2>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">{t.emergencySubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: t.instantConsultation,
                desc: t.instantConsultationDesc,
                color: "from-red-500 to-pink-500",
              },
              {
                icon: Video,
                title: t.emergencyVideos,
                desc: t.emergencyVideosDesc,
                color: "from-orange-500 to-red-500",
              },
              { icon: MapPin, title: t.smartAmbulance, desc: t.smartAmbulanceDesc, color: "from-blue-500 to-cyan-500" },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group bg-white rounded-3xl p-8 shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 border border-gray-100 ${
                  isVisible.emergency ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              onClick={handleEmergencyClick}
            >
              <Ambulance className="w-6 h-6 mr-3" />
              {t.emergencyAccess}
              <Clock className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="about" className="py-24 bg-white relative" data-animate>
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${isVisible.about ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 px-4 py-2 border-0">
              <Wifi className="w-4 h-4 mr-2" />
              Advanced Technology
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
              {t.technologyTitle}
            </h2>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">{t.technologySubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: t.cryptoAuth, desc: t.cryptoAuthDesc, color: "from-blue-500 to-cyan-500" },
              { icon: Database, title: t.ipfsStorage, desc: t.ipfsStorageDesc, color: "from-green-500 to-emerald-500" },
              { icon: Brain, title: t.aiMlModels, desc: t.aiMlModelsDesc, color: "from-purple-500 to-pink-500" },
              { icon: Globe, title: t.multiLanguage, desc: t.multiLanguageDesc, color: "from-orange-500 to-red-500" },
            ].map((tech, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 border border-gray-100 ${
                  isVisible.about ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-center group-hover:text-gray-800 transition-colors">
                  {tech.title}
                </h3>
                <p className="text-gray-700 text-center text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-24">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Trusted by Healthcare Professionals Worldwide
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Cardiologist, USA",
                  rating: 5,
                  text: "The AI diagnosis feature helped me detect early signs of diabetes. The emergency system saved my life during a cardiac episode.",
                },
                {
                  name: "Dr. Michael Chen",
                  role: "General Physician, Singapore",
                  rating: 5,
                  text: "The analytics dashboard and IPFS records system has revolutionized how I manage patient care. The emergency consultation feature is invaluable.",
                },
                {
                  name: "Dr. Priya Sharma",
                  role: "Pediatrician, India",
                  rating: 5,
                  text: "Multi-language support and easy explanations make this platform accessible to all my patients. The AI chatbot is incredibly helpful.",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">{t.ctaTitle}</h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">{t.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                >
                  <CheckCircle className="w-6 h-6 mr-3" />
                  {t.startFreeTrial}
                </Button>
              </Link>
              <Link href="/emergency">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                >
                  <Ambulance className="w-6 h-6 mr-3" />
                  {t.emergencyAccess}
                </Button>
              </Link>
            </div>
          </div>
          {/* Floating elements removed */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">HealthAI</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">{t.footerTagline}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className="bg-green-600 hover:bg-green-700 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  HIPAA Compliant
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-700 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  ISO 27001
                </Badge>
                <Badge className="bg-purple-600 hover:bg-purple-700 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  SOC 2
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-xl">{t.platform}</h3>
              <ul className="space-y-4 text-gray-400">
                {[
                  { label: t.patientPortal, href: "/patient-dashboard" },
                  { label: t.doctorPortal, href: "/doctor-dashboard" },
                  { label: t.aiDiagnosis, href: "/ai-diagnosis" },
                  { label: t.emergencyServices, href: "/emergency" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-xl">Features</h3>
              <ul className="space-y-4 text-gray-400">
                {[
                  { label: t.analyticsDesc, href: "/analytics" },
                  { label: t.medicalRecords, href: "/medical-records" },
                  { label: t.telemedicine, href: "/telemedicine" },
                  { label: t.ambulanceBooking, href: "/ambulance" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-xl">{t.support}</h3>
              <ul className="space-y-4 text-gray-400">
                {[
                  { label: t.helpCenter, href: "/help" },
                  { label: t.contactUs, href: "/contact" },
                  { label: t.privacyPolicy, href: "/privacy" },
                  { label: t.termsOfService, href: "/terms" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-lg">&copy; 2024 HealthAI. {t.rightsReserved}</p>
              <div className="flex items-center gap-8 text-gray-400 text-sm">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t.availableLanguages}
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t.endToEndEncrypted}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t.emergencySupport}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
