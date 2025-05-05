"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Check, Gift, Leaf, ShoppingBag, Star } from "lucide-react"
import Image from "next/image"

// Mock data for rewards
const rewardsData = {
  points: 230,
  nextTier: 500,
  tier: "Green Explorer",
  history: [
    {
      id: "h1",
      date: "April 15, 2023",
      description: "Booked Green Forest Eco Lodge",
      points: 120,
      type: "earned",
    },
    {
      id: "h2",
      date: "March 28, 2023",
      description: "Used Carbon Calculator",
      points: 10,
      type: "earned",
    },
    {
      id: "h3",
      date: "March 10, 2023",
      description: "Redeemed Eco-Friendly Water Bottle",
      points: -50,
      type: "redeemed",
    },
    {
      id: "h4",
      date: "February 22, 2023",
      description: "Booked Oceanview Sustainable Resort",
      points: 150,
      type: "earned",
    },
  ],
  redeemableItems: [
    {
      id: "r1",
      name: "Eco-Friendly Water Bottle",
      description: "Reusable stainless steel water bottle",
      points: 50,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "r2",
      name: "Organic Cotton Tote Bag",
      description: "Sustainable shopping bag made from organic cotton",
      points: 75,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "r3",
      name: "Tree Planting Certificate",
      description: "Plant a tree to offset your carbon footprint",
      points: 100,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "r4",
      name: "Eco-Tour Experience",
      description: "Guided tour of local conservation efforts",
      points: 200,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "r5",
      name: "One Night Free Stay",
      description: "Free night at any eco-certified accommodation",
      points: 500,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
}

export default function RewardsPage() {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRedeem = () => {
    // In a real app, this would call an API to redeem the item
    setIsDialogOpen(false)
    // Show success message or update points
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Eco-Friendly Rewards</h1>
          <p className="text-muted-foreground">Earn and redeem points for sustainable choices during your travels.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
              <CardDescription>Current status and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{rewardsData.points}</div>
                <div className="text-sm text-muted-foreground">Available Points</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Tier: {rewardsData.tier}</span>
                  <span>
                    {rewardsData.points}/{rewardsData.nextTier}
                  </span>
                </div>
                <Progress value={(rewardsData.points / rewardsData.nextTier) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">
                  {rewardsData.nextTier - rewardsData.points} points to next tier
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Tier Benefits:</h3>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span>10% discount on eco-tours</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span>Early access to sustainable properties</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span>Carbon offset for one trip per year</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">How to Earn Points:</h3>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Leaf className="h-4 w-4 mr-2 text-green-600" />
                    <span>Book eco-certified accommodations</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Leaf className="h-4 w-4 mr-2 text-green-600" />
                    <span>Use the carbon calculator</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Leaf className="h-4 w-4 mr-2 text-green-600" />
                    <span>Participate in sustainability programs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Tabs defaultValue="redeem">
              <TabsList>
                <TabsTrigger value="redeem">Redeem Rewards</TabsTrigger>
                <TabsTrigger value="history">Points History</TabsTrigger>
              </TabsList>

              <TabsContent value="redeem" className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rewardsData.redeemableItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="p-4 flex justify-center">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="object-contain"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <CardDescription className="text-xs">{item.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center pt-0">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1 text-green-600" />
                          <span className="font-semibold">{item.points} points</span>
                        </div>
                        <Dialog open={isDialogOpen && selectedItem?.id === item.id}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => setSelectedItem(item)}
                            >
                              Redeem
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Redeem Reward</DialogTitle>
                              <DialogDescription>Are you sure you want to redeem this item?</DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-4 py-4">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="object-contain"
                              />
                              <div>
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <div className="flex items-center mt-2">
                                  <Award className="h-4 w-4 mr-1 text-green-600" />
                                  <span className="font-semibold">{item.points} points</span>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleRedeem}
                                disabled={rewardsData.points < item.points}
                              >
                                Confirm Redemption
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Points History</CardTitle>
                    <CardDescription>Your recent reward activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rewardsData.history.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`p-2 rounded-full ${item.type === "earned" ? "bg-green-100" : "bg-orange-100"}`}
                            >
                              {item.type === "earned" ? (
                                <Leaf className="h-4 w-4 text-green-600" />
                              ) : (
                                <Gift className="h-4 w-4 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{item.description}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.date}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${item.type === "earned" ? "text-green-600" : "text-orange-600"}`}
                          >
                            {item.type === "earned" ? "+" : ""}
                            {item.points} points
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Impact</CardTitle>
            <CardDescription>The positive impact of your eco-friendly choices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="bg-green-100 p-4 rounded-full inline-flex">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold">120 kg</div>
                <div className="text-sm text-muted-foreground">CO₂ Emissions Saved</div>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-blue-100 p-4 rounded-full inline-flex">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">35 kg</div>
                <div className="text-sm text-muted-foreground">Plastic Waste Avoided</div>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-yellow-100 p-4 rounded-full inline-flex">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Trees Planted</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Badge variant="outline" className="bg-green-50">
              <Leaf className="h-3 w-3 mr-1 text-green-600" />
              You're in the top 15% of eco-conscious travelers!
            </Badge>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
