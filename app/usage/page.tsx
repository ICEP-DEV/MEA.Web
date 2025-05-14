"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Battery, Droplet, Leaf, LightbulbIcon, Recycle, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';



// Mock data for charts
const sustainabilityData = [
  { name: "Jan", value: 1.8 },
  { name: "Feb", value: 1.6 },
  { name: "Mar", value: 1.5 },
  { name: "Apr", value: 1.4 },
  { name: "May", value: 1.3 },
  { name: "Jun", value: 1.2 },
]

const energyData = [
  { name: "Jan", value: 320 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 280 },
  { name: "Apr", value: 270 },
  { name: "May", value: 260 },
  { name: "Jun", value: 250 },
]

const waterData = [
  { name: "Jan", value: 180 },
  { name: "Feb", value: 170 },
  { name: "Mar", value: 160 },
  { name: "Apr", value: 150 },
  { name: "May", value: 140 },
  { name: "Jun", value: 135 },
]

// const wasteData = [
//   { name: "Plastic", value: 35 },
//   { name: "Paper", value: 25 },
//   { name: "Food", value: 20 },
//   { name: "Glass", value: 15 },
//   { name: "Other", value: 5 },
// ]

export default function UsagePage() {


  const [sustainabilityData, setSustainabilityData] = useState([]);
  const [dailyUsageData, setDailyUsageData] = useState([]);
  
  useEffect(() => {
    const userId = 1; // Replace with actual dynamic user ID
    const fetchUsageData = async () => {
      try {
        const response = await axios.get(BASE_URL+`/usage/${userId}`);
        const { sustainability, daily_usage } = response.data;
        console.log(response.data);
        
  
        if (sustainability) {
          setSustainabilityData(sustainability);
        } else {
          console.warn("No sustainability data found");
        }
  
        if (daily_usage) {
          setDailyUsageData(daily_usage);
        } else {
          console.warn("No daily usage data found");
        }
  
      } catch (error) {
        console.error("Error fetching usage data:", error);
      }
    };
  
    fetchUsageData();
  }, []);
  

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sustainability Impact</h1>
          <p className="text-muted-foreground">Track your environmental footprint and see your progress over time.</p>
        </div>

        <Tabs defaultValue="carbon">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            {/* <TabsTrigger value="waste">Waste</TabsTrigger> */}
          </TabsList>

          <TabsContent value="carbon" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint</CardTitle>
                <CardDescription>Your carbon emissions over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <LineChart
                  data={sustainabilityData}
                  index="name"
                  categories={["value"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value} t CO₂`}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Footprint</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2 t CO₂</div>
                  <p className="text-xs text-muted-foreground">-33% from 6 months ago</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.8 t CO₂</div>
                  <p className="text-xs text-muted-foreground">Through eco-friendly choices</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Reduction Tips</CardTitle>
                <CardDescription>Personalized suggestions to lower your carbon footprint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Choose eco-certified accommodations</h4>
                      <p className="text-sm text-muted-foreground">
                        Staying at LEED or Green Key certified properties can reduce your carbon footprint by up to 30%.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Use public transportation</h4>
                      <p className="text-sm text-muted-foreground">
                        Taking public transit instead of taxis can reduce your travel emissions by up to 65%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Usage</CardTitle>
                <CardDescription>Your energy consumption over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BarChart
                  data={dailyUsageData.electric_usage}
                  index="name"
                  categories={["value"]}
                  colors={["yellow"]}
                  valueFormatter={(value) => `${value} kWh`}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                  <LightbulbIcon className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">250 kWh</div>
                  <p className="text-xs text-muted-foreground">-22% from 6 months ago</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Energy Savings</CardTitle>
                  <Battery className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">70 kWh</div>
                  <p className="text-xs text-muted-foreground">Through energy-efficient choices</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Water Usage</CardTitle>
                <CardDescription>Your water consumption over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <LineChart
                  data={dailyUsageData.water_usage}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} L`}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                  <Droplet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">135 L</div>
                  <p className="text-xs text-muted-foreground">-25% from 6 months ago</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Savings</CardTitle>
                  <Droplet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45 L</div>
                  <p className="text-xs text-muted-foreground">Through water-efficient choices</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
