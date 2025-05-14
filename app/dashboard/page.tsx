"use client"

import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { BarChart, Bike, Car, Droplet, Leaf, LightbulbIcon, Plane, Recycle, Trash2, Bus } from "lucide-react"
import { useEffect, useState, useRef } from "react"
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

const EMISSION_FACTORS = {
  car: 0.21,
  flight: 0.15,
  bus: 0.1,
  cycling: 0,
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [mode, setMode] = useState("")
  const [carbonFootprint, setCarbonFootprint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [selectedFrom, setSelectedFrom] = useState(null)
  const [selectedTo, setSelectedTo] = useState(null)
  const [searchingFrom, setSearchingFrom] = useState(false)
  const [searchingTo, setSearchingTo] = useState(false)

  // Create refs for the suggestion containers
  const fromSuggestionsRef = useRef(null)
  const toSuggestionsRef = useRef(null)
  const fromInputRef = useRef(null)
  const toInputRef = useRef(null)

  const user_id = "1" // Replace with actual user ID fetching logic

  const ORS_API_KEY = "5b3ce3597851110001cf6248d08e06ffbb3e41c992dda690ddcccd2c"

  // Handle location search and provide suggestions
  const handleLocationSearch = async (query, setSuggestions, setSearching) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    setSearching(true)
    try {
      console.log("Searching for location:", query)
      const res = await axios.get("https://api.openrouteservice.org/geocode/search", {
        params: {
          api_key: ORS_API_KEY,
          text: query,
          size: 5, // Limit to 5 suggestions
        },
      })

      console.log("API Response:", res.data)

      if (res.data && res.data.features && res.data.features.length > 0) {
        setSuggestions(res.data.features)
        console.log("Setting suggestions:", res.data.features)
      } else {
        console.log("No suggestions found")
        setSuggestions([])
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setError("Error fetching location suggestions")
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  // Create debounced search functions
  const debouncedFromSearch = debounce(
    (query) => handleLocationSearch(query, setFromSuggestions, setSearchingFrom),
    500,
  )
  const debouncedToSearch = debounce((query) => handleLocationSearch(query, setToSuggestions, setSearchingTo), 500)

  // Handle form submission to calculate carbon footprint
  const handleSubmit = async () => {
    if (!from || !to || !mode) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post(
        BASE_URL + "/sustainability/calculate",
        {
          user_id: "1",
          from: selectedFrom?.properties.formatted || from,
          to: selectedTo?.properties.formatted || to,
          mode: mode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      const { distance, carbon_value, impact, message } = response.data
      setCarbonFootprint({ distance, carbon_value, impact, message })
    } catch (err) {
      console.error("Calculation error:", err)
      setError("Error calculating distance or saving data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get icon based on transport mode
  const getTransportIcon = (transportMode) => {
    switch (transportMode) {
      case "car":
        return <Car className="h-5 w-5" />
      case "flight":
        return <Plane className="h-5 w-5" />
      case "bus":
        return <Bus className="h-5 w-5" />
      case "cycling":
        return <Bike className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  // Get color based on impact level
  const getImpactColor = (impact) => {
    switch (impact) {
      case "positive":
        return "text-green-600"
      case "neutral":
        return "text-amber-500"
      case "negative":
        return "text-red-500"
      default:
        return "text-gray-600"
    }
  }

  // Select a 'from' suggestion and update the input
  const handleFromSelect = (location, e) => {
    // Stop event propagation to prevent the global click handler from closing the dropdown
    if (e) {
      e.stopPropagation()
    }

    const locationName =
      location.properties.label || location.properties.formatted || location.properties.name || "Selected location"
    setFrom(locationName)
    setSelectedFrom(location)
    setFromSuggestions([]) // Clear suggestions
  }

  // Select a 'to' suggestion and update the input
  const handleToSelect = (location, e) => {
    // Stop event propagation to prevent the global click handler from closing the dropdown
    if (e) {
      e.stopPropagation()
    }

    const locationName =
      location.properties.label || location.properties.formatted || location.properties.name || "Selected location"
    setTo(locationName)
    setSelectedTo(location)
    setToSuggestions([]) // Clear suggestions
  }

  useEffect(() => {
    if (from) {
      debouncedFromSearch(from)
    }
  }, [from])

  useEffect(() => {
    if (to) {
      debouncedToSearch(to)
    }
  }, [to])

  // Add a click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both suggestion containers and inputs
      const isFromSuggestionClick = fromSuggestionsRef.current && fromSuggestionsRef.current.contains(event.target)
      const isToSuggestionClick = toSuggestionsRef.current && toSuggestionsRef.current.contains(event.target)
      const isFromInputClick = fromInputRef.current && fromInputRef.current.contains(event.target)
      const isToInputClick = toInputRef.current && toInputRef.current.contains(event.target)

      // Only close suggestions if the click is outside the relevant elements
      if (!isFromSuggestionClick && !isFromInputClick) {
        setFromSuggestions([])
      }

      if (!isToSuggestionClick && !isToInputClick) {
        setToSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium">From</label>
                    <input
                      ref={fromInputRef}
                      type="text"
                      placeholder="City or Airport"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Prevent propagation on input click
                    />
                    {searchingFrom && (
                      <div className="absolute right-3 top-9">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                    {fromSuggestions.length > 0 && (
                      <ul
                        ref={fromSuggestionsRef}
                        className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent propagation on container click
                      >
                        {fromSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.properties.id || suggestion.id || Math.random().toString()}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                            onClick={(e) => handleFromSelect(suggestion, e)}
                          >
                            {suggestion.properties.label ||
                              suggestion.properties.formatted ||
                              suggestion.properties.name ||
                              "Unknown location"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium">To</label>
                    <input
                      ref={toInputRef}
                      type="text"
                      placeholder="City or Airport"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Prevent propagation on input click
                    />
                    {searchingTo && (
                      <div className="absolute right-3 top-9">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                    {toSuggestions.length > 0 && (
                      <ul
                        ref={toSuggestionsRef}
                        className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent propagation on container click
                      >
                        {toSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.properties.id || suggestion.id || Math.random().toString()}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                            onClick={(e) => handleToSelect(suggestion, e)}
                          >
                            {suggestion.properties.label ||
                              suggestion.properties.formatted ||
                              suggestion.properties.name ||
                              "Unknown location"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Mode</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setMode("car")}
                      className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                        mode === "car" ? "bg-green-50 border-green-500" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Car className={`h-6 w-6 ${mode === "car" ? "text-green-600" : "text-gray-500"}`} />
                      <span className="mt-1 text-xs">Car</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("flight")}
                      className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                        mode === "flight" ? "bg-green-50 border-green-500" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Plane className={`h-6 w-6 ${mode === "flight" ? "text-green-600" : "text-gray-500"}`} />
                      <span className="mt-1 text-xs">Flight</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("bus")}
                      className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                        mode === "bus" ? "bg-green-50 border-green-500" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Bus className={`h-6 w-6 ${mode === "bus" ? "text-green-600" : "text-gray-500"}`} />
                      <span className="mt-1 text-xs">Bus</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("cycling")}
                      className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                        mode === "cycling" ? "bg-green-50 border-green-500" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Bike className={`h-6 w-6 ${mode === "cycling" ? "text-green-600" : "text-gray-500"}`} />
                      <span className="mt-1 text-xs">Cycling</span>
                    </button>
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                {carbonFootprint && (
                  <div className="pt-4">
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Distance:</div>
                        <div className="font-semibold">{carbonFootprint.distance.toFixed(2)} km</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Carbon Footprint:</div>
                        <div className="font-semibold">{carbonFootprint.carbon_value.toFixed(2)} t</div>
                      </div>

                      <div className="pt-2">
                        <div className="text-sm font-medium mb-1">Environmental Impact:</div>
                        <div
                          className={`text-sm p-2 rounded-md ${
                            carbonFootprint.impact === "positive"
                              ? "bg-green-50 text-green-700"
                              : carbonFootprint.impact === "neutral"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {carbonFootprint.message}
                        </div>
                      </div>

                      {mode === "cycling" && (
                        <div className="flex items-center space-x-2 text-green-600 text-sm mt-2">
                          <Leaf className="h-4 w-4" />
                          <span>Cycling is the most eco-friendly option!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    "Calculate Impact"
                  )}
                </button>
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
