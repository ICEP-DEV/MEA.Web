"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Battery, Droplet, Leaf, LightbulbIcon } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function UsagePage() {
  const [sustainabilityData, setSustainabilityData] = useState([])
  const [dailyUsageData, setDailyUsageData] = useState({
    electric_usage: [],
    water_usage: [],
  })
  const [rawData, setRawData] = useState({
    sustainability: [],
    daily_usage: [],
  })
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const userId = 1 // Replace with actual dynamic user ID
    const fetchUsageData = async () => {
      try {
        console.log(`Fetching usage data for user ${userId} from ${BASE_URL}/usage/${userId}`)
        const response = await axios.get(`${BASE_URL}/usage/${userId}`)

        // Log the complete response for debugging
        console.log("Full API response:", response)

        // Destructure the response data
        const { sustainability, daily_usage } = response.data
        setRawData({ sustainability, daily_usage })

        // Create an array with all months
        const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        // Process sustainability data
        if (sustainability && Array.isArray(sustainability)) {
          // Get the year from the first data point, or current year if no data
          const dataYear =
            sustainability.length > 0 ? new Date(sustainability[0].created_at).getFullYear() : new Date().getFullYear()

          // Create a map to store values by month
          const monthlyData = new Map()

          // Initialize all months with zero values
          allMonths.forEach((month, index) => {
            monthlyData.set(month, {
              name: month,
              value: 0,
              fullDate: new Date(dataYear, index, 1).toLocaleDateString(),
              travelDetails: "No data for this month",
              hasData: false,
            })
          })

          // Fill in actual data
          sustainability.forEach((item) => {
            const date = new Date(item.created_at)
            const month = date.toLocaleString("default", { month: "short" })

            // If we already have data for this month, update it
            if (monthlyData.has(month)) {
              monthlyData.set(month, {
                name: month,
                value: item.carbon_value || 0, // Ensure we have a number, not null/undefined
                fullDate: new Date(item.created_at).toLocaleDateString(),
                travelDetails: `${item.travel_from || ""} to ${item.travel_to || ""} (${item.mode || ""})`,
                hasData: true,
              })
            }
          })

          // Convert map to array and sort by month index
          const processedSustainability = Array.from(monthlyData.values())
          setSustainabilityData(processedSustainability)
        } else {
          console.warn("No sustainability data found or invalid format")
          setSustainabilityData([])
        }

        // Process daily usage data
        if (daily_usage && Array.isArray(daily_usage)) {
          // Get the year from the first data point, or current year if no data
          const dataYear =
            daily_usage.length > 0 ? new Date(daily_usage[0].created_at).getFullYear() : new Date().getFullYear()

          // Create maps for electric and water usage
          const electricByMonth = new Map()
          const waterByMonth = new Map()

          // Initialize all months with zero values
          allMonths.forEach((month, index) => {
            electricByMonth.set(month, {
              name: month,
              value: 0,
              fullDate: new Date(dataYear, index, 1).toLocaleDateString(),
              hasData: false,
            })

            waterByMonth.set(month, {
              name: month,
              value: 0,
              fullDate: new Date(dataYear, index, 1).toLocaleDateString(),
              hasData: false,
            })
          })

          // Fill in actual data
          daily_usage.forEach((item) => {
            const date = new Date(item.created_at)
            const month = date.toLocaleString("default", { month: "short" })

            // Update electric usage for this month
            if (electricByMonth.has(month)) {
              electricByMonth.set(month, {
                name: month,
                value: item.electric_usage || 0, // Ensure we have a number, not null/undefined
                fullDate: new Date(item.created_at).toLocaleDateString(),
                hasData: true,
              })
            }

            // Update water usage for this month
            if (waterByMonth.has(month)) {
              waterByMonth.set(month, {
                name: month,
                value: item.water_usage || 0, // Ensure we have a number, not null/undefined
                fullDate: new Date(item.created_at).toLocaleDateString(),
                hasData: true,
              })
            }
          })

          // Convert maps to arrays
          const electricUsage = Array.from(electricByMonth.values())
          const waterUsage = Array.from(waterByMonth.values())

          setDailyUsageData({
            electric_usage: electricUsage,
            water_usage: waterUsage,
          })
        } else {
          console.warn("No daily usage data found or invalid format")
          setDailyUsageData({
            electric_usage: [],
            water_usage: [],
          })
        }
      } catch (error) {
        console.error("Error fetching usage data:", error)
        if (error.response) {
          console.error("Response error:", error.response.data)
          console.error("Status code:", error.response.status)
        }
      }
    }

    fetchUsageData()
  }, [])

  // Find the month with data for stats calculations
  const getMonthWithData = (data) => {
    const monthWithData = data.find((item) => item.hasData)
    return monthWithData || { value: 0 }
  }

  // Calculate summary statistics
  const carbonStats = {
    current: sustainabilityData.length > 0 ? getMonthWithData(sustainabilityData).value || 0 : 0,
    reduction: 0, // Simplified since we don't have enough data for comparison
  }

  const energyStats = {
    current: dailyUsageData.electric_usage.length > 0 ? getMonthWithData(dailyUsageData.electric_usage).value || 0 : 0,
    reduction: 0, // Simplified since we don't have enough data for comparison
  }

  const waterStats = {
    current: dailyUsageData.water_usage.length > 0 ? getMonthWithData(dailyUsageData.water_usage).value || 0 : 0,
    reduction: 0, // Simplified since we don't have enough data for comparison
  }

  function ExpandableSection({ title, children }) {
    const [expanded, setExpanded] = useState(false)

    return (
      <div className="mb-4">
        <button
          className="text-blue-600 hover:underline text-sm mb-2"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide" : "Show"} {title}
        </button>
        {expanded && <div className="border rounded-md p-2 bg-gray-50">{children}</div>}
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sustainability Impact</h1>
          <p className="text-muted-foreground">Track your environmental footprint and see your progress over time.</p>
        </div>

        <Tabs defaultValue="carbon">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
          </TabsList>

          <TabsContent value="carbon" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle>Carbon Footprint</CardTitle>
                  <CardDescription>Your carbon emissions over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {sustainabilityData.length > 0 ? (
                    <LineChart
                      data={sustainabilityData}
                      index="name"
                      categories={["value"]}
                      colors={["green"]}
                      valueFormatter={(value) => `${value} t CO₂`}
                      yAxisWidth={60}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No carbon footprint data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle>Carbon Footprint Details</CardTitle>
                  <CardDescription>Detailed breakdown of your carbon emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpandableSection title="Carbon Footprint Details">
                    <div className="overflow-hidden rounded-md border bg-white">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead>Carbon (t CO₂)</TableHead>
                            <TableHead>Travel Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rawData.sustainability && rawData.sustainability.length > 0 ? (
                            rawData.sustainability.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {new Date(item.created_at).toLocaleString("default", { month: "short" })}
                                </TableCell>
                                <TableCell>{(item.carbon_value || 0).toFixed(2)}</TableCell>
                                <TableCell>{`${item.travel_from || ""} to ${item.travel_to || ""} (${item.mode || ""})`}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No carbon data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ExpandableSection>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium">Current Footprint</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{carbonStats.current.toFixed(2)} t CO₂</div>
                  <p className="text-xs text-muted-foreground">
                    {carbonStats.reduction > 0 ? `↓${carbonStats.reduction.toFixed(1)}%` : "No change"} from first
                    record
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{(carbonStats.current * 0.3).toFixed(2)} t CO₂</div>
                  <p className="text-xs text-muted-foreground">Through eco-friendly choices</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle>Carbon Reduction Tips</CardTitle>
                <CardDescription>Personalized suggestions to lower your carbon footprint</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle>Energy Usage</CardTitle>
                  <CardDescription>Your energy consumption over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {dailyUsageData.electric_usage.length > 0 ? (
                    <BarChart
                      data={dailyUsageData.electric_usage}
                      index="name"
                      categories={["value"]}
                      colors={["yellow"]}
                      valueFormatter={(value) => `${value} kWh`}
                      yAxisWidth={60}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No energy usage data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle>Energy Usage Details</CardTitle>
                  <CardDescription>Detailed breakdown of your energy consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpandableSection title="Energy Usage Details">
                    <div className="overflow-hidden rounded-md border bg-white">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead>Usage (kWh)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rawData.daily_usage && rawData.daily_usage.length > 0 ? (
                            rawData.daily_usage.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {new Date(item.created_at).toLocaleString("default", { month: "short" })}
                                </TableCell>
                                <TableCell>{item.electric_usage || 0}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center">
                                No energy data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ExpandableSection>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                  <LightbulbIcon className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{energyStats.current} kWh</div>
                  <p className="text-xs text-muted-foreground">
                    {energyStats.reduction > 0 ? `↓${energyStats.reduction.toFixed(1)}%` : "No change"} from first
                    record
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium">Energy Savings</CardTitle>
                  <Battery className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{(energyStats.current * 0.22).toFixed(1)} kWh</div>
                  <p className="text-xs text-muted-foreground">Through energy-efficient choices</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle>Water Usage</CardTitle>
                  <CardDescription>Your water consumption over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {dailyUsageData.water_usage.length > 0 ? (
                    <BarChart
                      data={dailyUsageData.water_usage}
                      index="name"
                      categories={["value"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value} L`}
                      yAxisWidth={60}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No water usage data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle>Water Usage Details</CardTitle>
                  <CardDescription>Detailed breakdown of your water consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-md border bg-white">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Month</TableHead>
                          <TableHead>Usage (L)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rawData.daily_usage && rawData.daily_usage.length > 0 ? (
                          rawData.daily_usage.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {new Date(item.created_at).toLocaleString("default", { month: "short" })}
                              </TableCell>
                              <TableCell>{item.water_usage || 0}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No water data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                  <Droplet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{waterStats.current} L</div>
                  <p className="text-xs text-muted-foreground">
                    {waterStats.reduction > 0 ? `↓${waterStats.reduction.toFixed(1)}%` : "No change"} from first record
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium">Water Savings</CardTitle>
                  <Droplet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{(waterStats.current * 0.25).toFixed(1)} L</div>
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
