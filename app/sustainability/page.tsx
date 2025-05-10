"use client"

import { use, useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, BarChart2, Car, LineChartIcon, MapPin, Calendar, Trophy, Clock, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"


const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Mock sustainability data for South African transport
const sustainabilityData = {
  user: "Lebo Mokoena",
  summary: {
    walkedKm: 42.5,
    drivenKm: 120.8,
    points: 305,
  },
  monthlyHistory: [
    { month: "Jan", walkedKm: 15, drivenKm: 60, points: 140 },
    { month: "Feb", walkedKm: 10, drivenKm: 30, points: 95 },
    { month: "Mar", walkedKm: 17.5, drivenKm: 30.8, points: 130 },
  ],


  
  bookings: [
    {
      id: 1,
      location: "Cape Town",
      mode: "walking",
      distance: 10.5,
      days: 3,
      points: 45,
      date: "2025-01-15",
    },
    {
      id: 2,
      location: "Johannesburg",
      mode: "driving",
      distance: 30,
      days: 2,
      points: 60,
      date: "2025-02-05",
    },
    {
      id: 3,
      location: "Durban",
      mode: "walking",
      distance: 8,
      days: 4,
      points: 48,
      date: "2025-02-20",
    },
    {
      id: 4,
      location: "Stellenbosch",
      mode: "driving",
      distance: 45,
      days: 3,
      points: 135,
      date: "2025-03-10",
    },
    {
      id: 5,
      location: "Port Elizabeth",
      mode: "walking",
      distance: 5,
      days: 2,
      points: 15,
      date: "2025-03-25",
    },
  ],
}

// Calculate points based on distance, days, and mode
const calculatePoints = (distance: number, days: number, mode: string): number => {
  const multiplier = mode === "walking" ? 1.5 : 1.0
  return Math.round(distance * days * multiplier)
}

// Format date string to readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function SustainabilityPage() {
  const [chartType, setChartType] = useState<"line" | "bar">("bar")
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  const fetchSustainabilityData = async (userId) => {
    try {
      // Fetch the data from the API endpoint
      const response = await axios.get(`${BASE_URL}/sustainability?userId=${userId}`);
      const sustainabilityData = response.data;
  
      // Check if the fetched data has monthlyHistory and map it
      if (sustainabilityData && sustainabilityData.monthlyHistory) {
        const monthlyData = sustainabilityData.monthlyHistory.map((item) => ({
          name: item.month,  // The month (string)
          walking: item.walkedKm,  // The walked distance
          driving: item.drivenKm,  // The driven distance
          points: item.points,  // The sustainability points
        }));
  
        return monthlyData;
      } else {
        console.error("No monthly history data found");
        return [];
      }
    } catch (error) {
      console.error("Error fetching sustainability data:", error);
      return null;
    }
  };
  
useEffect(() => { 
    const userId = 1; // Replace with the actual user ID
    fetchSustainabilityData(userId).then((data) => {
      if (data) {
        setMonthlyData(data);
      }
    });
  }, [userId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sustainability Dashboard</h1>
            <p className="text-muted-foreground">
              Track your eco-friendly travel choices and see how you're contributing to a greener South Africa.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
              className={chartType === "line" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className={chartType === "bar" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Bar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-green-600" />
                {sustainabilityData.user}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainabilityData.summary.points} points</div>
              <p className="text-xs text-muted-foreground">Your eco-friendly travel score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                Distance Walked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainabilityData.summary.walkedKm} km</div>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>1.5× points multiplier</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Car className="h-4 w-4 mr-2 text-amber-600" />
                Distance Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainabilityData.summary.drivenKm} km</div>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>1.0× points multiplier</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Transport History</CardTitle>
            <CardDescription>Your eco-friendly travel choices over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="distance">
              <TabsList className="mb-4">
                <TabsTrigger value="distance">Distance</TabsTrigger>
                <TabsTrigger value="points">Points</TabsTrigger>
              </TabsList>

              <TabsContent value="distance" className="space-y-4">
                <div className="h-[400px]">
                  {chartType === "line" ? (
                    <LineChart
                      data={monthlyData}
                      index="name"
                      categories={["walking", "driving"]}
                      colors={["green", "amber"]}
                      valueFormatter={(value) => `${value} km`}
                      yAxisWidth={60}
                    />
                  ) : (
                    <BarChart
                      data={monthlyData}
                      index="name"
                      categories={["walking", "driving"]}
                      colors={["green", "amber"]}
                      valueFormatter={(value) => `${value} km`}
                      yAxisWidth={60}
                    />
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Distance Insights</span>
                  </div>
                  <p className="mt-2 text-sm text-green-700">
                    You've walked a total of <strong>{sustainabilityData.summary.walkedKm} km</strong> and driven{" "}
                    <strong>{sustainabilityData.summary.drivenKm} km</strong>. Walking earns you 1.5× more points than
                    driving, so consider walking for shorter trips to maximize your eco-points!
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="points" className="space-y-4">
                <div className="h-[400px]">
                  {chartType === "line" ? (
                    <LineChart
                      data={monthlyData}
                      index="name"
                      categories={["points"]}
                      colors={["green"]}
                      valueFormatter={(value) => `${value} points`}
                      yAxisWidth={60}
                    />
                  ) : (
                    <BarChart
                      data={monthlyData}
                      index="name"
                      categories={["points"]}
                      colors={["green"]}
                      valueFormatter={(value) => `${value} points`}
                      yAxisWidth={60}
                    />
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Points Insights</span>
                  </div>
                  <p className="mt-2 text-sm text-green-700">
                    Your best month was{" "}
                    <strong>
                      {
                        sustainabilityData.monthlyHistory.reduce((prev, current) =>
                          prev.points > current.points ? prev : current,
                        ).month
                      }
                    </strong>{" "}
                    with{" "}
                    <strong>
                      {Math.max(...sustainabilityData.monthlyHistory.map((month) => month.points))} points
                    </strong>
                    . Keep up the good work by choosing eco-friendly transport options!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Breakdown</CardTitle>
            <CardDescription>Details of your eco-friendly travel choices per booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transport Mode</TableHead>
                    <TableHead className="text-center">Days</TableHead>
                    <TableHead className="text-center">Distance</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sustainabilityData.bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">{booking.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(booking.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            booking.mode === "walking"
                              ? "bg-green-50 text-green-700 flex items-center w-fit"
                              : "bg-amber-50 text-amber-700 flex items-center w-fit"
                          }
                        >
                          {booking.mode === "walking" ? (
                            <MapPin className="h-3 w-3 mr-1" />
                          ) : (
                            <Car className="h-3 w-3 mr-1" />
                          )}
                          {booking.mode === "walking" ? "Walking" : "Driving"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{booking.days}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{booking.distance} km</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Trophy className="h-3.5 w-3.5 mr-1 text-green-600" />
                          <span className="font-medium">{booking.points}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">How Points Are Calculated</span>
              </div>
              <p className="mt-2 text-sm text-green-700">Your eco-points are calculated using the following formula:</p>
              <div className="mt-2 p-3 bg-white rounded-md font-mono text-sm">
                Points = Distance (km) × Days × Mode Multiplier
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>Walking:</strong> 1.5× multiplier
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    <strong>Driving:</strong> 1.0× multiplier
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Impact</CardTitle>
            <CardDescription>The positive environmental impact of your eco-friendly choices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{sustainabilityData.summary.walkedKm} km</div>
                  <div className="text-sm text-muted-foreground">Walked Distance</div>
                  <div className="text-xs text-green-600">
                    Saved approximately {Math.round(sustainabilityData.summary.walkedKm * 0.2)} kg of CO₂
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Car className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold">{sustainabilityData.summary.drivenKm} km</div>
                  <div className="text-sm text-muted-foreground">Driven Distance</div>
                  <div className="text-xs text-amber-600">
                    Responsible driving saved {Math.round(sustainabilityData.summary.drivenKm * 0.05)} kg of CO₂
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{sustainabilityData.summary.points}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                  <div className="text-xs text-blue-600">
                    You're in the top 15% of eco-conscious travelers in South Africa!
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eco-Travel Tips for South Africa</CardTitle>
            <CardDescription>Maximize your sustainability impact on your next trip</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Explore Cape Town on foot</h4>
                  <p className="text-sm text-muted-foreground">
                    Cape Town's city center and V&A Waterfront are perfect for walking tours, earning you 1.5× points
                    while enjoying the scenery.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Car className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Carpool on longer journeys</h4>
                  <p className="text-sm text-muted-foreground">
                    When driving is necessary, share rides with other travelers to reduce your carbon footprint on
                    routes like the Garden Route.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Stay longer at each destination</h4>
                  <p className="text-sm text-muted-foreground">
                    Extending your stay increases your points multiplier and reduces the overall carbon footprint of
                    your trip across South Africa.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
