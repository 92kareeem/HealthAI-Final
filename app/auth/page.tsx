"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Wallet,
  Shield,
  Brain,
  Heart,
  Loader2,
  CheckCircle,
  User,
  Stethoscope,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function AuthPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    hospital: "",
  })
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState("")
  const [existingUser, setExistingUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("login")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkMetaMaskInstallation()
    checkWalletConnection()
  }, [])

  // When existing user is found, populate registration data
  useEffect(() => {
    if (existingUser) {
      setUserRole(existingUser.role)
      setRegistrationData({
        name: existingUser.name || "",
        email: existingUser.email || "",
        specialization: existingUser.specialization || "",
        licenseNumber: existingUser.license_number || "",
        hospital: existingUser.hospital || "",
      })
    }
  }, [existingUser])

  const checkMetaMaskInstallation = () => {
    if (typeof window !== "undefined") {
      setIsMetaMaskInstalled(!!window.ethereum)
    }
  }

  const checkUserInDatabase = async (address: string) => {
    try {
      const response = await fetch(`/api/users?wallet_address=${address}`)

      if (!response.ok) {
        console.log("User not found in database")
        return null
      }

      const data = await response.json()

      if (data.success && data.user) {
        return data.user
      }

      return null
    } catch (error) {
      console.error("Error checking user in database:", error)
      return null
    }
  }

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsWalletConnected(true)

          // Check if user exists in database
          const user = await checkUserInDatabase(accounts[0])

          if (user) {
            setExistingUser(user)
            setActiveTab("login")
            toast({
              title: "Welcome back!",
              description: `Found account for ${user.name}`,
            })
          } else {
            setActiveTab("register")
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setIsMetaMaskInstalled(false)
      return
    }

    setIsConnecting(true)
    setAuthError("")

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        setIsWalletConnected(true)

        // Check if user exists in database
        const user = await checkUserInDatabase(accounts[0])

        if (user) {
          setExistingUser(user)
          setActiveTab("login")
          toast({
            title: "Wallet Connected",
            description: `Welcome back, ${user.name}! Click Sign In to continue.`,
          })
        } else {
          setActiveTab("register")
          toast({
            title: "Wallet Connected",
            description: "Please register to create your account.",
          })
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setAuthError("Failed to connect wallet. Please try again.")
      toast({
        title: "Connection Failed",
        description: "Could not connect to MetaMask",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleAuthentication = async () => {
    if (!existingUser) {
      toast({
        title: "No Account Found",
        description: "Please register first or check your wallet address.",
        variant: "destructive",
      })
      return
    }

    setIsAuthenticating(true)
    setAuthError("")

    try {
      // Create signature request message
      const message = `Sign this message to authenticate with HealthAI: ${Date.now()}`

      // Request signature from user
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      })

      console.log("Signature obtained:", signature)

      // Update last login
      try {
        const response = await fetch("/api/users/update-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet_address: walletAddress }),
        })

        if (response.ok) {
          console.log("Login updated successfully")
        }
      } catch (error) {
        console.log("Could not update login time:", error)
      }

      toast({
        title: "Authentication Successful",
        description: `Welcome back, ${existingUser.name}!`,
      })

      // Store user data in localStorage for session management
      localStorage.setItem("healthai_user", JSON.stringify(existingUser))

      // Redirect to appropriate dashboard
      setTimeout(() => {
        router.push(`/${existingUser.role}-dashboard`)
      }, 1500)
    } catch (error) {
      console.error("Authentication error:", error)
      setAuthError("Authentication failed. Please try again.")
      toast({
        title: "Authentication Failed",
        description: "Could not verify your wallet signature",
        variant: "destructive",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleRegistration = async () => {
    if (!userRole || !registrationData.name || !registrationData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    setAuthError("")

    try {
      // Create or update user in database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: walletAddress,
          name: registrationData.name,
          email: registrationData.email,
          role: userRole,
          specialization: registrationData.specialization || null,
          license_number: registrationData.licenseNumber || null,
          hospital: registrationData.hospital || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: existingUser ? "Profile Updated" : "Registration Successful",
          description: data.message || "Your account has been created successfully!",
        })

        // Store user data in localStorage for session management
        localStorage.setItem("healthai_user", JSON.stringify(data.user))
        setExistingUser(data.user)

        // Redirect to appropriate dashboard
        setTimeout(() => {
          router.push(`/${userRole}-dashboard`)
        }, 1500)
      } else {
        throw new Error(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setAuthError(error instanceof Error ? error.message : "Registration failed. Please try again.")
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Could not create your account",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <Card className="w-full max-w-md relative z-10 bg-slate-800/50 border-slate-700 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Welcome to HealthAI</CardTitle>
            <CardDescription className="text-slate-400">Secure blockchain-based healthcare platform</CardDescription>
          </div>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isWalletConnected ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">Connect Your Wallet</h3>
                <p className="text-sm text-slate-400">Use MetaMask for secure, decentralized authentication</p>
              </div>

              {!isMetaMaskInstalled && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-amber-200">MetaMask not detected</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Please install MetaMask to continue with wallet authentication
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={connectWallet}
                disabled={isConnecting || !isMetaMaskInstalled}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Don't have MetaMask?{" "}
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Install here
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-400">Wallet Connected</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                  {existingUser && <p className="text-xs text-green-300">Account found: {existingUser.name}</p>}
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-blue-600">
                    {existingUser ? "Update Profile" : "Register"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="text-center space-y-4">
                    {existingUser ? (
                      <div className="space-y-2">
                        <p className="text-slate-400">Welcome back, {existingUser.name}!</p>
                        <p className="text-sm text-slate-500">Role: {existingUser.role}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400">No account found for this wallet address</p>
                    )}

                    {authError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-sm text-red-400">{authError}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleAuthentication}
                      disabled={isAuthenticating || !existingUser}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {isAuthenticating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          {existingUser ? "Authenticate & Sign In" : "No Account Found"}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role" className="text-white">
                        I am a
                      </Label>
                      <Select value={userRole} onValueChange={setUserRole}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="patient">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Patient
                            </div>
                          </SelectItem>
                          <SelectItem value="doctor">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="w-4 h-4" />
                              Doctor
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Administrator
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={registrationData.name}
                        onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Enter your email"
                      />
                    </div>

                    {userRole === "doctor" && (
                      <>
                        <div>
                          <Label htmlFor="specialization" className="text-white">
                            Specialization
                          </Label>
                          <Input
                            id="specialization"
                            value={registrationData.specialization}
                            onChange={(e) =>
                              setRegistrationData({ ...registrationData, specialization: e.target.value })
                            }
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="e.g., Cardiology, Neurology"
                          />
                        </div>

                        <div>
                          <Label htmlFor="license" className="text-white">
                            Medical License Number
                          </Label>
                          <Input
                            id="license"
                            value={registrationData.licenseNumber}
                            onChange={(e) =>
                              setRegistrationData({ ...registrationData, licenseNumber: e.target.value })
                            }
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="Enter license number"
                          />
                        </div>

                        <div>
                          <Label htmlFor="hospital" className="text-white">
                            Hospital/Clinic
                          </Label>
                          <Input
                            id="hospital"
                            value={registrationData.hospital}
                            onChange={(e) => setRegistrationData({ ...registrationData, hospital: e.target.value })}
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="Enter hospital/clinic name"
                          />
                        </div>
                      </>
                    )}

                    {authError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-sm text-red-400">{authError}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleRegistration}
                      disabled={isConnecting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {existingUser ? "Updating Profile..." : "Creating Account..."}
                        </>
                      ) : existingUser ? (
                        "Update Profile"
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3" />
              <span>End-to-end encrypted • HIPAA compliant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
