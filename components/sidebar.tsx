"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Home,
  Users,
  Brain,
  Video,
  BarChart3,
  FileText,
  Settings,
  Blocks,
  Wallet,
  Database,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

const sidebarItems = [
  {
    title: "DOCTOR PORTAL",
    items: [
      { icon: Home, label: "Dashboard", href: "/dashboard", badge: null },
      { icon: Users, label: "Patients", href: "/patients", badge: "127" },
      { icon: Brain, label: "AI Diagnosis", href: "/ai-diagnosis", badge: "New" },
      { icon: Video, label: "Meetings", href: "/meetings", badge: "3" },
      { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
      { icon: FileText, label: "Medical Records", href: "/medical-records", badge: null },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { icon: Blocks, label: "Blockchain", href: "/blockchain", badge: null },
      { icon: Wallet, label: "Wallet", href: "/wallet", badge: null },
      { icon: Database, label: "IPFS Storage", href: "/ipfs", badge: null },
      { icon: Settings, label: "Settings", href: "/settings", badge: null },
      { icon: HelpCircle, label: "Help & Support", href: "/help", badge: null },
    ],
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HealthAI</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <nav className="space-y-1 px-2">
              {section.items.map((item, itemIndex) => (
                <Link key={itemIndex} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                      isCollapsed ? "px-2" : "px-3",
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isCollapsed ? "" : "mr-3")} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
            isCollapsed ? "px-2" : "px-3",
          )}
        >
          <LogOut className={cn("w-5 h-5", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  )
}
