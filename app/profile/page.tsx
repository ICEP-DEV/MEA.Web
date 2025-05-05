"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Droplet, Leaf, Recycle, Save, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock user data
const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  role: "tourist",
  preferences: {
    electricTransport: true,
    lowWaterFootprint: false,
    recyclingFriendly: true,
  },
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Use mock data combined with auth user data
  const [formData, setFormData] = useState({
    name: user?.name || mockUserData.name,
    email: user?.email || mockUserData.email,
    phone: mockUserData.phone,
    role: user?.role || mockUserData.role,
    preferences: { ...mockUserData.preferences },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: checked,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })

    setIsLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and sustainability preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Sustainability Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg" alt={formData.name} />
                        <AvatarFallback className="text-2xl">{formData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" value={formData.email} readOnly disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">
                          Your email address is used for login and cannot be changed.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Account Type</Label>
                        <Input
                          id="role"
                          name="role"
                          value={
                            formData.role === "tourist"
                              ? "Tourist"
                              : formData.role === "provider"
                                ? "Provider"
                                : "Admin"
                          }
                          readOnly
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Sustainability Preferences</CardTitle>
                  <CardDescription>
                    Customize your sustainability preferences to find accommodations that match your values.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Electric Transport Only</h4>
                          <p className="text-sm text-muted-foreground">
                            Prefer accommodations that offer electric vehicle charging or are accessible by public
                            transit.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.preferences.electricTransport}
                        onCheckedChange={(checked) => handlePreferenceChange("electricTransport", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Droplet className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Low Water Footprint</h4>
                          <p className="text-sm text-muted-foreground">
                            Prefer accommodations with water-saving fixtures and rainwater harvesting systems.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.preferences.lowWaterFootprint}
                        onCheckedChange={(checked) => handlePreferenceChange("lowWaterFootprint", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-teal-100 p-2 rounded-full">
                          <Recycle className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Recycling-Friendly Accommodations</h4>
                          <p className="text-sm text-muted-foreground">
                            Prefer accommodations with comprehensive recycling programs and minimal waste.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.preferences.recyclingFriendly}
                        onCheckedChange={(checked) => handlePreferenceChange("recyclingFriendly", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Impact</CardTitle>
                <CardDescription>
                  Your preferences help us match you with accommodations that align with your sustainability goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Your Impact</h4>
                  </div>
                  <p className="mt-2 text-sm text-green-700">
                    By choosing eco-friendly accommodations, you've helped save approximately:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-xl font-bold text-green-600">15.4 kg</div>
                      <div className="text-xs text-green-700">Carbon Emissions</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-xl font-bold text-blue-600">380 L</div>
                      <div className="text-xs text-blue-700">Water Usage</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-xl font-bold text-yellow-600">62.7 kWh</div>
                      <div className="text-xs text-yellow-700">Energy Consumption</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
