"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Bot,
  User,
  Paperclip,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Search,
  Brain,
  Heart,
  Activity,
  Calendar,
  FileText,
  ImageIcon,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai" | "doctor"
  timestamp: Date
  type: "text" | "image" | "file"
  metadata?: any
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI health assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
    },
    {
      id: "2",
      content: "I've been experiencing some chest pain and shortness of breath. Should I be concerned?",
      sender: "user",
      timestamp: new Date(Date.now() - 240000),
      type: "text",
    },
    {
      id: "3",
      content:
        "I understand your concern about chest pain and shortness of breath. These symptoms can be serious and warrant immediate medical attention. Based on your symptoms, I recommend:\n\n1. **Seek immediate medical care** if you're experiencing severe chest pain\n2. **Call emergency services** if symptoms worsen\n3. **Monitor your symptoms** and note any triggers\n\nWould you like me to help you schedule an urgent appointment with a cardiologist?",
      sender: "ai",
      timestamp: new Date(Date.now() - 180000),
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(newMessage),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "I understand your concern. Based on what you've described, I'd recommend consulting with a healthcare professional for a proper evaluation.",
      "That's a great question! Let me provide you with some information that might help, but please remember this doesn't replace professional medical advice.",
      "I can help you understand your symptoms better. Would you like me to suggest some questions to ask your doctor during your next visit?",
      "Based on current medical guidelines, here's what you should know about your condition. However, please consult with your healthcare provider for personalized advice.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const quickActions = [
    { icon: Calendar, label: "Schedule Appointment", action: () => {} },
    { icon: Brain, label: "AI Symptom Check", action: () => {} },
    { icon: FileText, label: "View Records", action: () => {} },
    { icon: Heart, label: "Health Metrics", action: () => {} },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">AI Health Assistant</h1>
                <p className="text-sm text-muted-foreground">Online • Powered by GPT-4</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender !== "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>{message.sender === "ai" ? <Bot className="w-4 h-4" /> : "DR"}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white ml-auto"
                          : message.sender === "ai"
                            ? "bg-muted"
                            : "bg-green-100 dark:bg-green-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="border-t p-4">
              <div className="flex gap-2 mb-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="flex items-center gap-2"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your health question..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="pr-12"
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 border-l bg-card/50 p-4 space-y-6">
            {/* AI Assistant Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Assistant Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>Medical Q&A</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Symptom Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Appointment Scheduling</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span>Health Records</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { topic: "Chest Pain Consultation", time: "2 hours ago" },
                  { topic: "Medication Questions", time: "1 day ago" },
                  { topic: "Lab Results Review", time: "3 days ago" },
                ].map((conv, index) => (
                  <div key={index} className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">{conv.topic}</p>
                    <p className="text-xs text-muted-foreground">{conv.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Daily Health Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm">
                    💧 Remember to stay hydrated! Aim for 8 glasses of water daily to maintain optimal health.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
