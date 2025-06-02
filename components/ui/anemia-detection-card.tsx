import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Fingerprint, Brain, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AnemiaDetectionCardProps {
  selectedFile: File | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAnalyze: () => Promise<void>
  loading: boolean
}

export function AnemiaDetectionCard({
  selectedFile,
  onFileChange,
  onAnalyze,
  loading,
}: AnemiaDetectionCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Anemia Detection
              <Badge variant="secondary" className="text-xs">
                AI-Powered
              </Badge>
            </CardTitle>
            <CardDescription>Advanced eye and nail analysis for anemia screening</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-sm">Eye Analysis</p>
              <p className="text-xs text-muted-foreground">Conjunctiva examination</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
            <Fingerprint className="w-5 h-5 text-pink-600" />
            <div>
              <p className="font-medium text-sm">Nail Analysis</p>
              <p className="text-xs text-muted-foreground">Nail bed examination</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Accuracy Rate</span>
            <span className="font-medium">94.5%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Analysis Time</span>
            <span className="font-medium">~30 seconds</span>
          </div>
        </div>

        <Link href="/ai-diagnosis/anemia-detection">
          <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
            Start Anemia Screening
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
