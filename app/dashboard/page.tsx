"use client"

import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import {
  BarChart,
  Bike,
  Car,
  Droplet,
  Leaf,
  LightbulbIcon,
  Plane,
  Recycle,
  Trash2,
  Bus,
  PlusCircle,
  FileSpreadsheet,
  Filter,
  Download,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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

// Mock data for accommodations
const mockAccommodations = [
  { id: 1, name: "Green Residence", type: "Dormitory", address: "123 Campus Drive" },
  { id: 2, name: "Sunset Apartments", type: "Apartment Complex", address: "456 University Blvd" },
  { id: 3, name: "Lakeside Housing", type: "Townhouses", address: "789 Lake Road" },
]

// Mock data for rooms
const mockRooms = [
  { id: 1, accommodationId: 1, roomNumber: "A101", floor: 1, occupants: 2, type: "Double" },
  { id: 2, accommodationId: 1, roomNumber: "A102", floor: 1, occupants: 1, type: "Single" },
  { id: 3, accommodationId: 1, roomNumber: "B201", floor: 2, occupants: 2, type: "Double" },
  { id: 4, accommodationId: 2, roomNumber: "101", floor: 1, occupants: 3, type: "Family" },
  { id: 5, accommodationId: 2, roomNumber: "102", floor: 1, occupants: 2, type: "Double" },
  { id: 6, accommodationId: 3, roomNumber: "T1", floor: 1, occupants: 4, type: "Family" },
  { id: 7, accommodationId: 3, roomNumber: "T2", floor: 1, occupants: 4, type: "Family" },
]

// Mock data for users/tenants
const mockTenants = [
  { id: 1, name: "John Doe", email: "john@example.com", roomId: 1 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", roomId: 1 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", roomId: 2 },
  { id: 4, name: "Alice Williams", email: "alice@example.com", roomId: 3 },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", roomId: 3 },
  { id: 6, name: "Diana Prince", email: "diana@example.com", roomId: 4 },
  { id: 7, name: "Ethan Hunt", email: "ethan@example.com", roomId: 5 },
]

// Mock data for water usage
const mockWaterUsage = [
  {
    id: 1,
    accommodationId: 1,
    accommodationName: "Green Residence",
    roomId: 1,
    roomNumber: "A101",
    date: "2023-05-01",
    amount: 120,
    unit: "liters",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 2,
    accommodationId: 1,
    accommodationName: "Green Residence",
    roomId: 2,
    roomNumber: "A102",
    date: "2023-05-01",
    amount: 95,
    unit: "liters",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 3,
    accommodationId: 2,
    accommodationName: "Sunset Apartments",
    roomId: 4,
    roomNumber: "101",
    date: "2023-05-01",
    amount: 150,
    unit: "liters",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 4,
    accommodationId: 1,
    accommodationName: "Green Residence",
    roomId: 1,
    roomNumber: "A101",
    date: "2023-05-15",
    amount: 110,
    unit: "liters",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 5,
    accommodationId: 3,
    accommodationName: "Lakeside Housing",
    roomId: 6,
    roomNumber: "T1",
    date: "2023-05-15",
    amount: 180,
    unit: "liters",
    billingMonth: "May 2023",
    status: "Pending",
  },
]

// Mock data for electricity usage
const mockElectricityUsage = [
  {
    id: 1,
    accommodationId: 1,
    accommodationName: "Green Residence",
    roomId: 1,
    roomNumber: "A101",
    date: "2023-05-01",
    amount: 8.5,
    unit: "kWh",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 2,
    accommodationId: 1,
    accommodationName: "Green Residence",
    roomId: 2,
    roomNumber: "A102",
    date: "2023-05-01",
    amount: 7.2,
    unit: "kWh",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 3,
    accommodationId: 2,
    accommodationName: "Sunset Apartments",
    roomId: 4,
    roomNumber: "101",
    date: "2023-05-01",
    amount: 9.1,
    unit: "kWh",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 4,
    accommodationId: 1,
    accommodationName: "Green Residence",
    roomId: 1,
    roomNumber: "A101",
    date: "2023-05-15",
    amount: 7.8,
    unit: "kWh",
    billingMonth: "May 2023",
    status: "Billed",
  },
  {
    id: 5,
    accommodationId: 3,
    accommodationName: "Lakeside Housing",
    roomId: 6,
    roomNumber: "T1",
    date: "2023-05-15",
    amount: 12.3,
    unit: "kWh",
    billingMonth: "May 2023",
    status: "Pending",
  },
]

const EMISSION_FACTORS = {
  car: 0.21,
  flight: 0.15,
  bus: 0.1,
  cycling: 0,
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

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

  // Admin state
  const [waterUsage, setWaterUsage] = useState(mockWaterUsage)
  const [electricityUsage, setElectricityUsage] = useState(mockElectricityUsage)
  const [accommodations, setAccommodations] = useState(mockAccommodations)
  const [rooms, setRooms] = useState(mockRooms)
  const [tenants, setTenants] = useState(mockTenants)
  const [waterUploadFile, setWaterUploadFile] = useState(null)
  const [electricityUploadFile, setElectricityUploadFile] = useState(null)
  const [waterUploadLoading, setWaterUploadLoading] = useState(false)
  const [electricityUploadLoading, setElectricityUploadLoading] = useState(false)
  const [selectedAccommodation, setSelectedAccommodation] = useState("")
  const [filteredRooms, setFilteredRooms] = useState([])

  // New entry state
  const [newWaterEntry, setNewWaterEntry] = useState({
    accommodationId: "",
    roomId: "",
    date: "",
    amount: "",
    billingMonth: "",
  })

  const [newElectricityEntry, setNewElectricityEntry] = useState({
    accommodationId: "",
    roomId: "",
    date: "",
    amount: "",
    billingMonth: "",
  })

  // Create refs for the suggestion containers
  const fromSuggestionsRef = useRef(null)
  const toSuggestionsRef = useRef(null)
  const fromInputRef = useRef(null)
  const toInputRef = useRef(null)

  // Check if user is admin
  // const isAdmin = user?.role === "admin"
  const isAdmin = "admin"

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

  // Handle water CSV upload
  const handleWaterCsvUpload = async (e) => {
    e.preventDefault()
    if (!waterUploadFile) return

    setWaterUploadLoading(true)
    try {
      // In a real app, you would send the file to your server
      // For this example, we'll simulate a successful upload
      setTimeout(() => {
        alert("Water usage data uploaded successfully!")
        setWaterUploadFile(null)
        setWaterUploadLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error uploading water data:", error)
      setWaterUploadLoading(false)
    }
  }

  // Handle electricity CSV upload
  const handleElectricityCsvUpload = async (e) => {
    e.preventDefault()
    if (!electricityUploadFile) return

    setElectricityUploadLoading(true)
    try {
      // In a real app, you would send the file to your server
      // For this example, we'll simulate a successful upload
      setTimeout(() => {
        alert("Electricity usage data uploaded successfully!")
        setElectricityUploadFile(null)
        setElectricityUploadLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error uploading electricity data:", error)
      setElectricityUploadLoading(false)
    }
  }

  // Handle accommodation selection for filtering rooms
  const handleAccommodationChange = (accommodationId) => {
    setSelectedAccommodation(accommodationId)
    if (accommodationId) {
      const filtered = rooms.filter((room) => room.accommodationId.toString() === accommodationId)
      setFilteredRooms(filtered)
    } else {
      setFilteredRooms([])
    }
  }

  // Handle adding new water entry
  const handleAddWaterEntry = (e) => {
    e.preventDefault()

    if (
      !newWaterEntry.accommodationId ||
      !newWaterEntry.roomId ||
      !newWaterEntry.date ||
      !newWaterEntry.amount ||
      !newWaterEntry.billingMonth
    ) {
      alert("Please fill in all fields")
      return
    }

    const selectedAccommodation = accommodations.find((a) => a.id.toString() === newWaterEntry.accommodationId)
    const selectedRoom = rooms.find((r) => r.id.toString() === newWaterEntry.roomId)

    const newEntry = {
      id: waterUsage.length + 1,
      accommodationId: Number.parseInt(newWaterEntry.accommodationId),
      accommodationName: selectedAccommodation.name,
      roomId: Number.parseInt(newWaterEntry.roomId),
      roomNumber: selectedRoom.roomNumber,
      date: newWaterEntry.date,
      amount: Number.parseFloat(newWaterEntry.amount),
      unit: "liters",
      billingMonth: newWaterEntry.billingMonth,
      status: "Pending",
    }

    setWaterUsage([...waterUsage, newEntry])
    setNewWaterEntry({ accommodationId: "", roomId: "", date: "", amount: "", billingMonth: "" })
    alert("Water usage entry added successfully!")
  }

  // Handle adding new electricity entry
  const handleAddElectricityEntry = (e) => {
    e.preventDefault()

    if (
      !newElectricityEntry.accommodationId ||
      !newElectricityEntry.roomId ||
      !newElectricityEntry.date ||
      !newElectricityEntry.amount ||
      !newElectricityEntry.billingMonth
    ) {
      alert("Please fill in all fields")
      return
    }

    const selectedAccommodation = accommodations.find((a) => a.id.toString() === newElectricityEntry.accommodationId)
    const selectedRoom = rooms.find((r) => r.id.toString() === newElectricityEntry.roomId)

    const newEntry = {
      id: electricityUsage.length + 1,
      accommodationId: Number.parseInt(newElectricityEntry.accommodationId),
      accommodationName: selectedAccommodation.name,
      roomId: Number.parseInt(newElectricityEntry.roomId),
      roomNumber: selectedRoom.roomNumber,
      date: newElectricityEntry.date,
      amount: Number.parseFloat(newElectricityEntry.amount),
      unit: "kWh",
      billingMonth: newElectricityEntry.billingMonth,
      status: "Pending",
    }

    setElectricityUsage([...electricityUsage, newEntry])
    setNewElectricityEntry({ accommodationId: "", roomId: "", date: "", amount: "", billingMonth: "" })
    alert("Electricity usage entry added successfully!")
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
            {isAdmin && <TabsTrigger value="water-management">Water Management</TabsTrigger>}
            {isAdmin && <TabsTrigger value="electricity-management">Electricity Management</TabsTrigger>}
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

          {/* Water Management Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="water-management" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Accommodation Water Usage Management</h2>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Water Usage Entry</DialogTitle>
                        <DialogDescription>Enter the water usage details for a specific room.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddWaterEntry} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="water-accommodation">Accommodation</Label>
                          <Select
                            value={newWaterEntry.accommodationId}
                            onValueChange={(value) => {
                              setNewWaterEntry({ ...newWaterEntry, accommodationId: value, roomId: "" })
                              handleAccommodationChange(value)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an accommodation" />
                            </SelectTrigger>
                            <SelectContent>
                              {accommodations.map((accommodation) => (
                                <SelectItem key={accommodation.id} value={accommodation.id.toString()}>
                                  {accommodation.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="water-room">Room Number</Label>
                          <Select
                            value={newWaterEntry.roomId}
                            onValueChange={(value) => setNewWaterEntry({ ...newWaterEntry, roomId: value })}
                            disabled={!newWaterEntry.accommodationId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id.toString()}>
                                  {room.roomNumber} ({room.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="water-date">Reading Date</Label>
                          <Input
                            id="water-date"
                            type="date"
                            value={newWaterEntry.date}
                            onChange={(e) => setNewWaterEntry({ ...newWaterEntry, date: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="water-amount">Amount (liters)</Label>
                          <Input
                            id="water-amount"
                            type="number"
                            placeholder="e.g. 120"
                            value={newWaterEntry.amount}
                            onChange={(e) => setNewWaterEntry({ ...newWaterEntry, amount: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="water-billing-month">Billing Month</Label>
                          <Select
                            value={newWaterEntry.billingMonth}
                            onValueChange={(value) => setNewWaterEntry({ ...newWaterEntry, billingMonth: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select billing month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="May 2023">May 2023</SelectItem>
                              <SelectItem value="June 2023">June 2023</SelectItem>
                              <SelectItem value="July 2023">July 2023</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <DialogFooter>
                          <Button type="submit">Add Entry</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Upload CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Water Usage Data</DialogTitle>
                        <DialogDescription>
                          Upload a CSV file with water usage data. The file should have columns for accommodation_id,
                          room_id, date, amount, and billing_month.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleWaterCsvUpload} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="water-csv">CSV File</Label>
                          <Input
                            id="water-csv"
                            type="file"
                            accept=".csv"
                            onChange={(e) => setWaterUploadFile(e.target.files[0])}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CSV Format Example</Label>
                          <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                            accommodation_id,room_id,room_number,date,amount,billing_month
                            <br />
                            1,1,A101,2023-05-01,120,May 2023
                            <br />
                            1,2,A102,2023-05-01,95,May 2023
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={waterUploadLoading || !waterUploadFile}>
                            {waterUploadLoading ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              "Upload"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

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
                  <CardTitle>Water Usage Data by Room</CardTitle>
                  <CardDescription>View and manage water usage for all accommodations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of all water usage entries by room.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Accommodation</TableHead>
                        <TableHead>Room Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount (liters)</TableHead>
                        <TableHead>Billing Month</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waterUsage.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.id}</TableCell>
                          <TableCell>{entry.accommodationName}</TableCell>
                          <TableCell className="font-medium">{entry.roomNumber}</TableCell>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>
                            {entry.amount} {entry.unit}
                          </TableCell>
                          <TableCell>{entry.billingMonth}</TableCell>
                          <TableCell>
                            <Badge variant={entry.status === "Billed" ? "outline" : "default"}>{entry.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Water Usage by Accommodation</CardTitle>
                  <CardDescription>Compare water consumption across different accommodations</CardDescription>
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
            </TabsContent>
          )}

          {/* Electricity Management Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="electricity-management" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Accommodation Electricity Usage Management</h2>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Electricity Usage Entry</DialogTitle>
                        <DialogDescription>Enter the electricity usage details for a specific room.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddElectricityEntry} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="electricity-accommodation">Accommodation</Label>
                          <Select
                            value={newElectricityEntry.accommodationId}
                            onValueChange={(value) => {
                              setNewElectricityEntry({ ...newElectricityEntry, accommodationId: value, roomId: "" })
                              handleAccommodationChange(value)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an accommodation" />
                            </SelectTrigger>
                            <SelectContent>
                              {accommodations.map((accommodation) => (
                                <SelectItem key={accommodation.id} value={accommodation.id.toString()}>
                                  {accommodation.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="electricity-room">Room Number</Label>
                          <Select
                            value={newElectricityEntry.roomId}
                            onValueChange={(value) => setNewElectricityEntry({ ...newElectricityEntry, roomId: value })}
                            disabled={!newElectricityEntry.accommodationId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id.toString()}>
                                  {room.roomNumber} ({room.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="electricity-date">Reading Date</Label>
                          <Input
                            id="electricity-date"
                            type="date"
                            value={newElectricityEntry.date}
                            onChange={(e) => setNewElectricityEntry({ ...newElectricityEntry, date: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="electricity-amount">Amount (kWh)</Label>
                          <Input
                            id="electricity-amount"
                            type="number"
                            placeholder="e.g. 8.5"
                            value={newElectricityEntry.amount}
                            onChange={(e) => setNewElectricityEntry({ ...newElectricityEntry, amount: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="electricity-billing-month">Billing Month</Label>
                          <Select
                            value={newElectricityEntry.billingMonth}
                            onValueChange={(value) =>
                              setNewElectricityEntry({ ...newElectricityEntry, billingMonth: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select billing month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="May 2023">May 2023</SelectItem>
                              <SelectItem value="June 2023">June 2023</SelectItem>
                              <SelectItem value="July 2023">July 2023</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <DialogFooter>
                          <Button type="submit">Add Entry</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Upload CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Electricity Usage Data</DialogTitle>
                        <DialogDescription>
                          Upload a CSV file with electricity usage data. The file should have columns for
                          accommodation_id, room_id, date, amount, and billing_month.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleElectricityCsvUpload} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="electricity-csv">CSV File</Label>
                          <Input
                            id="electricity-csv"
                            type="file"
                            accept=".csv"
                            onChange={(e) => setElectricityUploadFile(e.target.files[0])}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CSV Format Example</Label>
                          <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                            accommodation_id,room_id,room_number,date,amount,billing_month
                            <br />
                            1,1,A101,2023-05-01,8.5,May 2023
                            <br />
                            1,2,A102,2023-05-01,7.2,May 2023
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={electricityUploadLoading || !electricityUploadFile}>
                            {electricityUploadLoading ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              "Upload"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

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
                  <CardTitle>Electricity Usage Data by Room</CardTitle>
                  <CardDescription>View and manage electricity usage for all accommodations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of all electricity usage entries by room.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Accommodation</TableHead>
                        <TableHead>Room Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount (kWh)</TableHead>
                        <TableHead>Billing Month</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {electricityUsage.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.id}</TableCell>
                          <TableCell>{entry.accommodationName}</TableCell>
                          <TableCell className="font-medium">{entry.roomNumber}</TableCell>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>
                            {entry.amount} {entry.unit}
                          </TableCell>
                          <TableCell>{entry.billingMonth}</TableCell>
                          <TableCell>
                            <Badge variant={entry.status === "Billed" ? "outline" : "default"}>{entry.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Electricity Usage by Accommodation</CardTitle>
                  <CardDescription>Compare electricity consumption across different accommodations</CardDescription>
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
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
