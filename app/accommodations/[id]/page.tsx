"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon, Check, Leaf, MapPin, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for South African accommodations
const accommodationsData = {
  "1": {
    id: "1",
    name: "Grootbos Private Nature Reserve",
    location: "Gansbaai, Western Cape",
    price: 3500,
    rating: 4.9,
    reviews: 245,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Nestled between mountain and sea in the Overberg region, Grootbos Private Nature Reserve is a luxury eco-paradise showcasing the incredible flora and marine life of the Southern Tip of Africa. The 2,500 hectare reserve is home to more than 800 plant species, including endangered fynbos, ancient milkwood forests, and a variety of wildlife. The lodge operates on sustainable principles with solar power, organic gardens, and extensive conservation initiatives.",
    certifications: ["Fair Trade Tourism", "Green Leaf"],
    amenities: [
      "Solar Powered",
      "Organic Farm-to-Table",
      "Fynbos Conservation",
      "Rainwater Harvesting",
      "Community Upliftment",
      "Guided Nature Walks",
      "Whale Watching (Seasonal)",
      "Botanical Tours",
    ],
    sustainability: [
      "100% renewable energy",
      "Growing the Future project",
      "Fynbos conservation",
      "Marine conservation",
      "Local employment initiatives",
      "Green Futures horticultural training",
    ],
    carbonFootprint: "Low",
    host: {
      name: "Michael Lutzeyer",
      joined: "1994",
      bio: "Dedicated conservationist committed to protecting South Africa's unique fynbos ecosystem.",
      response_rate: 98,
    },
    reviews: [
      {
        id: "r1",
        user: "Sarah",
        date: "March 2023",
        rating: 5,
        comment:
          "An incredible eco-friendly experience! The lodge is beautiful and the sustainability initiatives are impressive. The fynbos tours were educational and inspiring.",
      },
      {
        id: "r2",
        user: "Michael",
        date: "February 2023",
        rating: 4,
        comment:
          "Great sustainable accommodation with wonderful staff. The organic food was delicious and the whale watching was unforgettable!",
      },
      {
        id: "r3",
        user: "Emma",
        date: "January 2023",
        rating: 5,
        comment:
          "Perfect place for eco-conscious travelers. I loved learning about their conservation work and the views of Walker Bay are breathtaking.",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Phinda Forest Lodge",
    location: "KwaZulu-Natal",
    price: 5500,
    rating: 4.8,
    reviews: 189,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Set deep in the heart of a rare dry sand forest, Phinda Forest Lodge combines rare luxury with environmental sustainability. The lodge's 16 air-conditioned suites are built on stilts and appear to float between the forest floor and the towering torchwood trees. The lodge is part of a successful conservation story, where former farmland has been restored to thriving wildlife habitat.",
    certifications: ["Fair Trade Tourism", "Long Run Destination"],
    amenities: [
      "Big Five Safari",
      "Sustainable Architecture",
      "Community Visits",
      "Cheetah Project",
      "Bush Walks",
      "Night Drives",
      "Bird Watching",
      "Turtle Nesting Tours (Seasonal)",
    ],
    sustainability: [
      "Wildlife conservation",
      "Community development",
      "Habitat restoration",
      "Anti-poaching initiatives",
      "Environmental education",
      "Water conservation",
    ],
    carbonFootprint: "Low",
    host: {
      name: "&Beyond",
      joined: "1991",
      bio: "Pioneering luxury ecotourism company with a core ethic of Care of the Land, Care of the Wildlife, Care of the People.",
      response_rate: 99,
    },
    reviews: [
      {
        id: "r1",
        user: "James",
        date: "April 2023",
        rating: 5,
        comment:
          "Incredible wildlife experience with knowledgeable guides. The glass-walled suites in the sand forest are magical!",
      },
      {
        id: "r2",
        user: "Thandi",
        date: "March 2023",
        rating: 5,
        comment: "We saw all the Big Five and learned so much about conservation. The community visit was a highlight.",
      },
      {
        id: "r3",
        user: "Robert",
        date: "February 2023",
        rating: 4,
        comment: "Beautiful lodge with excellent service. The sustainability efforts are impressive and genuine.",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Hotel Verde Cape Town",
    location: "Cape Town, Western Cape",
    price: 1800,
    rating: 4.6,
    reviews: 312,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Africa's greenest hotel, Hotel Verde Cape Town offers carbon-neutral accommodation near Cape Town International Airport. The hotel features cutting-edge green technology including regenerative drive elevators, a gray water recycling system, and renewable energy generation. The property showcases how urban accommodations can minimize environmental impact without compromising on comfort.",
    certifications: ["LEED Platinum", "Green Leaf"],
    amenities: [
      "Eco-friendly Gym",
      "Green Rooftop Garden",
      "Sustainable Restaurant",
      "Airport Shuttle",
      "Eco-pool",
      "Carbon Offset Program",
      "Electric Vehicle Charging",
      "Eco-trails",
    ],
    sustainability: [
      "100% carbon neutral",
      "Renewable energy generation",
      "Water recycling system",
      "Waste-to-resource program",
      "Sustainable procurement",
      "Green building design",
    ],
    carbonFootprint: "Zero",
    host: {
      name: "Verde Hotels",
      joined: "2013",
      bio: "Sustainable hospitality group focused on minimizing environmental impact while maximizing guest comfort.",
      response_rate: 97,
    },
    reviews: [
      {
        id: "r1",
        user: "David",
        date: "May 2023",
        rating: 5,
        comment: "Perfect airport hotel with impressive green credentials. The eco-features tour was fascinating!",
      },
      {
        id: "r2",
        user: "Nomsa",
        date: "April 2023",
        rating: 4,
        comment:
          "Comfortable rooms and great service. Love that they give rewards for eco-friendly choices during your stay.",
      },
      {
        id: "r3",
        user: "Lisa",
        date: "March 2023",
        rating: 5,
        comment: "Convenient location and guilt-free stay. The restaurant serves delicious locally-sourced food.",
      },
    ],
  },
}

export default function AccommodationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Check if the accommodation exists in our data
  const accommodation = accommodationsData[id]

  // If accommodation doesn't exist, show an error message
  if (!accommodation) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accommodation not found</AlertTitle>
          <AlertDescription>The accommodation you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/accommodations")}>Return to Accommodations</Button>
      </DashboardLayout>
    )
  }

  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const [guests, setGuests] = useState(2)

  // Calculate total price based on selected dates
  const calculateTotalPrice = () => {
    if (date.from && date.to) {
      const days = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
      return accommodation.price * days
    }
    return 0
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{accommodation.name}</h1>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{accommodation.rating}</span>
              <span className="text-sm text-muted-foreground ml-1">({accommodation.reviews} reviews)</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {accommodation.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[400px]">
          {accommodation.images.map((image, index) => (
            <div key={index} className={`relative ${index === 0 ? "col-span-1 row-span-2" : "col-span-1 row-span-1"}`}>
              <Image
                src={image || "/placeholder.svg"}
                alt={`${accommodation.name} - Image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {accommodation.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="bg-green-50">
                  <Leaf className="h-3 w-3 mr-1 text-green-600" />
                  {cert}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">About this eco-friendly accommodation</h2>
              <p>{accommodation.description}</p>
            </div>

            <Tabs defaultValue="amenities">
              <TabsList>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities" className="space-y-4">
                <h3 className="text-lg font-semibold mt-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {accommodation.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sustainability" className="space-y-4">
                <h3 className="text-lg font-semibold mt-4">Sustainability Initiatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {accommodation.sustainability.map((initiative) => (
                    <div key={initiative} className="flex items-center">
                      <Leaf className="h-4 w-4 mr-2 text-green-600" />
                      <span>{initiative}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold flex items-center">
                    <Leaf className="h-4 w-4 mr-2 text-green-600" />
                    Carbon Footprint: {accommodation.carbonFootprint}
                  </h4>
                  <p className="text-sm mt-1">
                    This eco-lodge produces significantly less carbon emissions compared to conventional accommodations
                    in South Africa, helping preserve our unique biodiversity.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <h3 className="text-lg font-semibold mt-4">Guest Reviews</h3>
                <div className="space-y-4">
                  {accommodation.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{review.user}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Hosted by {accommodation.host.name}</h3>
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=50&width=50"
                    alt={accommodation.host.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm">Joined in {accommodation.host.joined}</p>
                  <p className="text-sm">{accommodation.host.response_rate}% response rate</p>
                </div>
              </div>
              <p className="text-sm">{accommodation.host.bio}</p>
            </div>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl">
                  R{accommodation.price} <span className="text-sm font-normal">/ night</span>
                </CardTitle>
                <CardDescription>Includes eco-friendly amenities and sustainability initiatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Check-in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date.from ? format(date.from, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Check-out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date.to ? format(date.to, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Guests</label>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-2" />
                          {guests} {guests === 1 ? "guest" : "guests"}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        disabled={guests >= 10}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {date.from && date.to && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>
                        R{accommodation.price} x{" "}
                        {Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} nights
                      </span>
                      <span>R{calculateTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eco-cleaning fee</span>
                      <span>R350</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>R250</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>R{calculateTotalPrice() + 600}</span>
                    </div>
                  </div>
                )}

                <Link href={`/book/${id}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {date.from && date.to ? "Reserve" : "Check Availability"}
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground">You won't be charged yet</p>

                <div className="text-xs text-center text-green-600 flex items-center justify-center">
                  <Leaf className="h-3 w-3 mr-1" />
                  Booking this eco-friendly accommodation earns you 120 green points
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
