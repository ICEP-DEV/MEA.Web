"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowUpRight, Building, Hotel, Leaf, Users } from "lucide-react"

// Mock data for admin dashboard
const userGrowthData = [
  { name: "Jan", tourists: 120, providers: 15 },
  { name: "Feb", tourists: 150, providers: 18 },
  { name: "Mar", tourists: 190, providers: 22 },
  { name: "Apr", tourists: 210, providers: 25 },
  { name: "May", tourists: 250, providers: 30 },
  { name: "Jun", tourists: 280, providers: 35 },
]

const bookingsData = [
  { name: "Jan", bookings: 80 },
  { name: "Feb", bookings: 100 },
  { name: "Mar", bookings: 130 },
  { name: "Apr", bookings: 150 },
  { name: "May", bookings: 180 },
  { name: "Jun", bookings: 210 },
]

const accommodationTypesData = [
  { name: "Hotels", value: 35 },
  { name: "Eco-Lodges", value: 25 },
  { name: "Apartments", value: 20 },
  { name: "Hostels", value: 15 },
  { name: "Other", value: 5 },
]

const certificationData = [
  { name: "LEED", value: 40 },
  { name: "Green Key", value: 30 },
  { name: "Green Globe", value: 15 },
  { name: "EU Ecolabel", value: 10 },
  { name: "Other", value: 5 },
]

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform performance and sustainability metrics.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eco-Accommodations</CardTitle>
              <Hotel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">328</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-green-600">+8.3%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">845</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-green-600">+15.2%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5 t</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-green-600">+18.7%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BarChart
                  data={userGrowthData}
                  index="name"
                  categories={["tourists", "providers"]}
                  colors={["green", "blue"]}
                  valueFormatter={(value) => `${value} users`}
                  yAxisWidth={60}
                  legend={{ position: "top" }}
                  customTooltip={(props) => {
                    const { payload, active } = props
                    if (!active || !payload) return null
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Tourists</span>
                            <span className="font-bold text-green-500">{payload[0]?.value} users</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Providers</span>
                            <span className="font-bold text-blue-500">{payload[1]?.value} users</span>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accommodations" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Accommodation Types</CardTitle>
                  <CardDescription>Distribution of eco-friendly accommodation types</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <PieChart
                    data={accommodationTypesData}
                    index="name"
                    categories={["value"]}
                    colors={["green", "emerald", "teal", "cyan", "sky"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Distribution of sustainability certifications</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <PieChart
                    data={certificationData}
                    index="name"
                    categories={["value"]}
                    colors={["green", "emerald", "teal", "cyan", "sky"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Total bookings over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <LineChart
                  data={bookingsData}
                  index="name"
                  categories={["bookings"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value} bookings`}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Offset</CardTitle>
                  <CardDescription>Total carbon emissions offset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-green-600">12.5 t</div>
                    <div className="text-sm text-muted-foreground mt-2">CO₂ Emissions Offset</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Water Saved</CardTitle>
                  <CardDescription>Total water conservation impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-blue-600">28,500 L</div>
                    <div className="text-sm text-muted-foreground mt-2">Water Saved</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Plastic Reduction</CardTitle>
                  <CardDescription>Total plastic waste avoided</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-purple-600">850 kg</div>
                    <div className="text-sm text-muted-foreground mt-2">Plastic Waste Avoided</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
