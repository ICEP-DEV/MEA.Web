"use client"

import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Droplet, Leaf, LightbulbIcon, Recycle, Trash2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for the charts
const energyData = [
  { day: "M", value: 8.2 },
  { day: "T", value: 7.8 },
  { day: "W", value: 9.4 },
  { day: "T", value: 8.9 },
  { day: "F", value: 7.5 },
  { day: "S", value: 6.2 },
  { day: "S", value: 5.8 },
]

const waterData = [
  { day: "M", value: 120 },
  { day: "T", value: 135 },
  { day: "W", value: 128 },
  { day: "T", value: 142 },
  { day: "F", value: 130 },
  { day: "S", value: 115 },
  { day: "S", value: 110 },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your sustainability impact.</p>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calculator">Carbon Calculator</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2 t CO₂</div>
                  <p className="text-xs text-muted-foreground">-12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
                  <LightbulbIcon className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">250 kWh</div>
                  <p className="text-xs text-muted-foreground">-8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                  <Droplet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">135 L</div>
                  <div className="mt-2">
                    <Progress value={90} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Goal: 150 L</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waste Savings</CardTitle>
                  <Recycle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20 kg</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Usage</CardTitle>
                  <CardDescription>Your daily energy consumption this week</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} name="kWh" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-center mt-2 text-muted-foreground">
                    This impacts your carbon footprint
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Water Usage</CardTitle>
                  <CardDescription>Your daily water consumption this week</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Liters" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tips to reduce your impact</CardTitle>
                <CardDescription>Personalized suggestions based on your usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Droplet className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Turn off the tap while brushing your teeth</h4>
                      <p className="text-sm text-muted-foreground">
                        This simple habit can save up to 8 gallons of water per day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <LightbulbIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Switch to LED bulbs in your accommodation</h4>
                      <p className="text-sm text-muted-foreground">
                        LED bulbs use up to 75% less energy than incandescent lighting.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Trash2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Reduce plastic waste</h4>
                      <p className="text-sm text-muted-foreground">
                        Bring reusable bags, bottles, and containers during your travels.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Calculator</CardTitle>
                <CardDescription>Calculate and offset your trip's carbon footprint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <input
                      type="text"
                      placeholder="City or Airport"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <input
                      type="text"
                      placeholder="City or Airport"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hotel</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select accommodation type</option>
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="eco-lodge">Eco-Lodge</option>
                  </select>
                </div>
                <div className="pt-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium">Your Carbon Footprint:</div>
                    <div className="text-3xl font-bold mt-1">0.6 t</div>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">OFFSET</button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>Find eco-friendly hotels and products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-3xl font-bold">230</div>
                  <div className="text-sm text-muted-foreground">Reward Points</div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Earn rewards for eco-friendly activities</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span>Book green accommodations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BarChart className="h-4 w-4 text-green-600" />
                      <span>Use carbon calculator</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Recycle className="h-4 w-4 text-green-600" />
                      <span>Reduce plastic waste</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
