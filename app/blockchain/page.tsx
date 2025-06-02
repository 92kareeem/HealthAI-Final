"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Blocks,
  Shield,
  Key,
  Database,
  Activity,
  CheckCircle,
  Clock,
  Hash,
  Users,
  FileText,
  Lock,
  Zap,
  TrendingUp,
  Copy,
  ExternalLink,
} from "lucide-react"

export default function BlockchainPage() {
  const [walletConnected, setWalletConnected] = useState(true)
  const [blockchainStats, setBlockchainStats] = useState({
    totalTransactions: 1247,
    recordsStored: 892,
    gasUsed: "0.0234 ETH",
    lastBlock: "0x7f9a2b...",
    networkStatus: "Active",
  })

  const recentTransactions = [
    {
      id: "1",
      type: "Medical Record Upload",
      hash: "0x7f9a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
      timestamp: "2 minutes ago",
      status: "confirmed",
      gasUsed: "0.0012 ETH",
    },
    {
      id: "2",
      type: "Prescription Verification",
      hash: "0x8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      timestamp: "15 minutes ago",
      status: "confirmed",
      gasUsed: "0.0008 ETH",
    },
    {
      id: "3",
      type: "Patient Consent Update",
      hash: "0x9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
      timestamp: "1 hour ago",
      status: "pending",
      gasUsed: "0.0015 ETH",
    },
  ]

  const smartContracts = [
    {
      name: "Medical Records Contract",
      address: "0x742d35Cc6634C0532925a3b8D4C0C8b3E6C1E",
      status: "Active",
      version: "v2.1.0",
      lastUpdated: "2 days ago",
    },
    {
      name: "Patient Consent Contract",
      address: "0x8f5c2A9b3D4e6F7a8B9c0D1e2F3a4B5c6D7e8F9a",
      status: "Active",
      version: "v1.8.2",
      lastUpdated: "1 week ago",
    },
    {
      name: "Prescription Tracking Contract",
      address: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
      status: "Active",
      version: "v1.5.1",
      lastUpdated: "3 days ago",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Blocks className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Blockchain Infrastructure</h1>
                <p className="text-muted-foreground">Secure, decentralized medical data management</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="w-3 h-3 mr-1" />
                Network Active
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                Ethereum Mainnet
              </Badge>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Etherscan
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Hash className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{blockchainStats.totalTransactions}</div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{blockchainStats.recordsStored}</div>
                  <div className="text-sm text-muted-foreground">Records Stored</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{blockchainStats.gasUsed}</div>
                  <div className="text-sm text-muted-foreground">Gas Used Today</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>Latest blockchain transactions for medical data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{tx.type}</h4>
                        <Badge
                          variant={tx.status === "confirmed" ? "default" : "secondary"}
                          className={tx.status === "confirmed" ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {tx.status === "confirmed" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {tx.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-xs">{tx.hash.slice(0, 20)}...</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{tx.timestamp}</span>
                          <span className="font-medium">{tx.gasUsed}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>

              {/* Smart Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Smart Contracts
                  </CardTitle>
                  <CardDescription>Deployed smart contracts for healthcare operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {smartContracts.map((contract, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{contract.name}</h4>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{contract.status}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-xs">{contract.address}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Version: {contract.version}</span>
                          <span className="text-muted-foreground">{contract.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full">
                    Deploy New Contract
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Lock className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <CardTitle>End-to-End Encryption</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    All medical data is encrypted before being stored on the blockchain
                  </p>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-green-600 mt-2">AES-256 Encryption Active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <CardTitle>Immutable Records</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Medical records cannot be altered once stored on the blockchain
                  </p>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-green-600 mt-2">Tamper-Proof Storage</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Users className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Patient-controlled access permissions for all medical data
                  </p>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-green-600 mt-2">Role-Based Permissions</p>
                </CardContent>
              </Card>
            </div>

            {/* Network Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Network Health Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">15ms</div>
                    <div className="text-sm text-muted-foreground">Average Latency</div>
                    <Progress value={95} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500 mb-1">1,247</div>
                    <div className="text-sm text-muted-foreground">Transactions/Hour</div>
                    <Progress value={78} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-1">99.9%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                    <Progress value={99} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-1">12</div>
                    <div className="text-sm text-muted-foreground">Active Nodes</div>
                    <Progress value={100} className="h-2 mt-2" />
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
