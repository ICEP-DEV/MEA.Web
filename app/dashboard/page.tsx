"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Bike, Car, Droplet, Leaf, LightbulbIcon, Plane, Bus, Users, Download, Filter, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import DashboardLayout from "@/components/dashboard-layout"
import Papa from "papaparse";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function DashboardPage() {
  const [rawData, setRawData] = useState({
    sustainability: [],
    daily_usage: [],
    users: [],
  })

  const [sustainabilityData, setSustainabilityData] = useState([])
  const [dailyUsageData, setDailyUsageData] = useState({
    electric_usage: [],
    water_usage: [],
  })

  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAllUsageData = async () => {
      setDataLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/usageAll/all`)
        const { sustainability, daily_usage, users } = response.data
        setRawData({ sustainability, daily_usage, users })
        processData(sustainability, daily_usage)
      } catch (error) {
        console.error("Error fetching usage data:", error)
        setError("Failed to fetch data. Please try again later.")
        // Use mock data if API fails
        // const mockSustainability = [
        //   {
        //     id: 1,
        //     travel_from: "New York",
        //     travel_to: "Boston",
        //     mode: "car",
        //     distance: 350,
        //     carbon_value: 0.8,
        //     impact: "negative",
        //     created_at: new Date().toISOString(),
        //     user_id: "1",
        //   },
        // ]
        // const mockDailyUsage = [
        //   {
        //     id: 1,
        //     water_usage: 120,
        //     electric_usage: 8.5,
        //     created_at: new Date().toISOString(),
        //     user_id: "1",
        //   },
        //   {
        //     id: 2,
        //     water_usage: 95,
        //     electric_usage: 7.2,
        //     created_at: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
        //     user_id: "1",
        //   },
        // ]
        // const mockUsers = [
        //   { id: 1, name: "John Doe", email: "john@example.com", created_at: new Date().toISOString() },
        // ]
        // processData(mockSustainability, mockDailyUsage)
      } finally {
        setDataLoading(false)
      }
    }

    fetchAllUsageData()
  }, [])

  const processData = (sustainability, daily_usage) => {
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const dataYear = sustainability?.length > 0
      ? new Date(sustainability[0].created_at).getFullYear()
      : new Date().getFullYear()

    // Process sustainability data
    const monthlySustainability = allMonths.map((month, index) => {
      const monthData = {
        name: month,
        value: 0,
        fullDate: new Date(dataYear, index, 1).toLocaleDateString(),
        travelDetails: "No data for this month",
        hasData: false,
      }

      const monthItems = sustainability?.filter(item => {
        try {
          const date = new Date(item.created_at)
          return date.getMonth() === index && date.getFullYear() === dataYear
        } catch (e) {
          return false
        }
      }) || []

      if (monthItems.length > 0) {
        const totalCarbon = monthItems.reduce((sum, item) => sum + (item.carbon_value || 0), 0)
        monthData.value = totalCarbon
        monthData.hasData = true
        monthData.travelDetails = `${monthItems[0].travel_from || ""} to ${monthItems[0].travel_to || ""}`
      }

      return monthData
    })

    setSustainabilityData(monthlySustainability)

    // Process daily usage data with improved validation
    const processUsageData = (usageData, key) => {
      return allMonths.map((month, index) => {
        const monthItems = Array.isArray(usageData)
          ? usageData.filter(item => {
            try {
              const date = new Date(item.created_at)
              return date.getMonth() === index && date.getFullYear() === dataYear
            } catch (e) {
              return false
            }
          })
          : []

        const total = monthItems.reduce((sum, item) => {
          const value = parseFloat(item[key])
          return isNaN(value) ? sum : sum + value
        }, 0)

        const avg = monthItems.length > 0 ? total / monthItems.length : 0

        return {
          name: month,
          value: avg,
          total, // <-- new field for total usage per month
          fullDate: new Date(dataYear, index, 1).toLocaleDateString(),
          hasData: monthItems.length > 0,
          count: monthItems.length,
        }
      })
    }


    setDailyUsageData({
      electric_usage: processUsageData(daily_usage, "electric_usage"),
      water_usage: processUsageData(daily_usage, "water_usage"),
    })
  }

  const formatNumber = (value, decimals = 2) => {
    if (isNaN(value)) return "N/A"
    return Number(value).toFixed(decimals)
  }

  const calculateStats = (data) => {
    const validData = data.filter(item => !isNaN(item.value) && item.hasData)
    if (validData.length === 0) return { current: 0, reduction: 0 }

    const current = validData[validData.length - 1].value
    const first = validData[0].value
    const reduction = first !== 0 ? ((first - current) / first) * 100 : 0

    return {
      current: current || 0,
      reduction: reduction || 0,
    }
  }

  const carbonStats = calculateStats(sustainabilityData)
  const energyStats = calculateStats(dailyUsageData.electric_usage)
  const waterStats = calculateStats(dailyUsageData.water_usage)

  const getTransportModeData = () => {
    const modes = {}
    rawData.sustainability?.forEach(item => {
      const mode = item.mode || "unknown"
      modes[mode] = (modes[mode] || 0) + 1
    })
    return Object.entries(modes).map(([name, value]) => ({ name, value }))
  }

  const transportModeData = getTransportModeData()
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  const getTransportIcon = (transportMode) => {
    switch (transportMode?.toLowerCase()) {
      case "car": return <Car className="h-5 w-5" />
      case "flight": return <Plane className="h-5 w-5" />
      case "bus": return <Bus className="h-5 w-5" />
      case "cycling": return <Bike className="h-5 w-5" />
      default: return <Car className="h-5 w-5" />
    }
  }

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case "positive": return "text-green-600"
      case "neutral": return "text-amber-500"
      case "negative": return "text-red-500"
      default: return "text-gray-600"
    }
  }
  function WaterUsageImport({ onDataImported }) {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const requiredFields = [
            "user_id", "date", "water_usage", "electric_usage", "created_at"
          ];
          const missingFields = requiredFields.filter(
            (field) => !results.meta.fields.includes(field)
          );
          if (missingFields.length > 0) {
            alert(`Missing fields in CSV: ${missingFields.join(", ")}`);
            return;
          }
          onDataImported(results.data);
        },
        error: (err) => {
          alert("Error parsing CSV: " + err.message);
        },
      });
    };

    return (
      <div className="mb-4">
        <label className="block font-medium mb-2 rounded px-4 py-2 bg-green-600 text-white shadow">
          Import your water & electricity usage for all users as a CSV/EXCEL file below:
        </label>
        <label className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-200">
          <Upload className="h-5 w-5" />
          <span>Choose File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>


    );
  }

  const handleWaterUsageImport = async (data) => {
    try {
      await axios.post(`${BASE_URL}/usage/import`, { records: data });
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error +
          (err.response.data.missingUserIds
            ? `: ${err.response.data.missingUserIds.join(', ')}`
            : '')
        );
      } else {
        alert("Failed to import data. Please try again.");
      }
    }
  };



  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sustainability Dashboard</h1>
            <p className="text-muted-foreground">Track environmental impact across all users and locations.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
              <TabsTrigger value="water">Water Usage</TabsTrigger>
              <TabsTrigger value="electricity">Electricity</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>

            </TabsList>
            <WaterUsageImport onDataImported={handleWaterUsageImport} />

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                    <Leaf className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(carbonStats.current)} t CO₂</div>
                    <p className="text-xs text-muted-foreground">Aggregated across all users</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
                    <LightbulbIcon className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(energyStats.current, 1)} kWh</div>
                    <p className="text-xs text-muted-foreground">Average monthly consumption</p>
                    {/* Add total below */}
                    <div className="text-sm text-muted-foreground mt-1">
                      Total this month: {formatNumber(dailyUsageData.electric_usage[new Date().getMonth()]?.total, 1)} kWh
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                    <Droplet className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(waterStats.current)} L</div>
                    <div className="mt-2">
                      <Progress
                        value={waterStats.current > 0 ? Math.min(waterStats.current / 2, 100) : 0}
                        className="h-2"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Average monthly consumption</p>
                    {/* Add total below */}
                    <div className="text-sm text-muted-foreground mt-1">
                      Total this month: {formatNumber(dailyUsageData.water_usage[new Date().getMonth()]?.total)} L
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{rawData.users?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Active sustainability users</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Usage</CardTitle>
                    <CardDescription>Monthly energy consumption (all users)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {dataLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
                      </div>
                    ) : dailyUsageData.electric_usage.some(item => item.hasData) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={dailyUsageData.electric_usage}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value} kWh`, 'Electric Usage']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Bar dataKey="value" fill="#22c55e" name="kWh" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p>No energy usage data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Water Usage</CardTitle>
                    <CardDescription>Monthly water consumption (all users)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {dataLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                      </div>
                    ) : dailyUsageData.water_usage.some(item => item.hasData) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={dailyUsageData.water_usage}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value} L`, 'Water Usage']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Bar dataKey="value" fill="#3b82f6" name="Liters" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p>No water usage data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transport Mode Distribution</CardTitle>
                  <CardDescription>Breakdown of transport modes used</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {dataLoading ? (
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
                  ) : transportModeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transportModeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {transportModeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>No transport mode data available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sustainability" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Sustainability Data</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Carbon Footprint</CardTitle>
                  <CardDescription>Carbon emissions over time (all users)</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {dataLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : sustainabilityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sustainabilityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} name="t CO₂" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No carbon footprint data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sustainability Records</CardTitle>
                  <CardDescription>Detailed breakdown of carbon emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Distance (km)</TableHead>
                          <TableHead>Carbon (t CO₂)</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead>User ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rawData.sustainability && rawData.sustainability.length > 0 ? (
                          rawData.sustainability.map((item, index) => (
                            <TableRow key={item.id || index}>
                              <TableCell>{item.id || index + 1}</TableCell>
                              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>{item.travel_from || "N/A"}</TableCell>
                              <TableCell>{item.travel_to || "N/A"}</TableCell>
                              <TableCell className="flex items-center gap-2">
                                {getTransportIcon(item.mode)}
                                <span className="capitalize">{item.mode || "N/A"}</span>
                              </TableCell>
                              <TableCell>{item.distance?.toFixed(2) || "N/A"}</TableCell>
                              <TableCell>{item.carbon_value?.toFixed(2) || "0.00"}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={item.impact === "positive" ? "outline" : "default"}
                                  className={getImpactColor(item.impact)}
                                >
                                  {item.impact || "unknown"}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.user_id}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center">
                              No sustainability data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="water" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Water Usage Data</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Water Usage Trend</CardTitle>
                  <CardDescription>Monthly water consumption (all users)</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {dataLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : dailyUsageData.water_usage.some(item => item.hasData) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyUsageData.water_usage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} L`, 'Water Usage']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Water Usage"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No water usage data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Water usage records table remains unchanged */}
            </TabsContent>

            <TabsContent value="electricity" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Electricity Usage Data</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Electricity Usage Trend</CardTitle>
                  <CardDescription>Monthly electricity consumption (all users)</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {dataLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : dailyUsageData.electric_usage.some(item => item.hasData) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyUsageData.electric_usage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} kWh`, 'Electric Usage']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#22c55e"
                          strokeWidth={2}
                          name="Electric Usage"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>No electricity usage data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Electricity usage records table remains unchanged */}
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">User Data</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Records</CardTitle>
                  <CardDescription>All registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Registration Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rawData.users && rawData.users.length > 0 ? (
                          rawData.users.map((user, index) => (
                            <TableRow key={user.id || index}>
                              <TableCell>{user.id || index + 1}</TableCell>
                              <TableCell>{user.name || "N/A"}</TableCell>
                              <TableCell>{user.email || "N/A"}</TableCell>
                              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No user data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity Summary</CardTitle>
                  <CardDescription>Overview of user contributions to sustainability data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Sustainability Records</TableHead>
                          <TableHead>Usage Records</TableHead>
                          <TableHead>Total Carbon (t CO₂)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rawData.users && rawData.users.length > 0 ? (
                          rawData.users.map((user, index) => {
                            // Calculate stats for each user
                            const userSustainability =
                              rawData.sustainability?.filter((item) => item.user_id == user.id) || []
                            const userUsage = rawData.daily_usage?.filter((item) => item.user_id == user.id) || []
                            const totalCarbon = userSustainability.reduce(
                              (sum, item) => sum + (item.carbon_value || 0),
                              0,
                            )

                            return (
                              <TableRow key={user.id || index}>
                                <TableCell>{user.id || index + 1}</TableCell>
                                <TableCell>{userSustainability.length}</TableCell>
                                <TableCell>{userUsage.length}</TableCell>
                                <TableCell>{totalCarbon.toFixed(2)}</TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No user activity data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}