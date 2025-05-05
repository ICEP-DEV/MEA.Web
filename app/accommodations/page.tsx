"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Leaf, MapPin, Search, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Update the mock data for accommodations with South African properties
const accommodations = [
  {
    id: "1",
    name: "Grootbos Private Nature Reserve",
    location: "Gansbaai, Western Cape",
    price: 3500,
    rating: 4.9,
    reviews: 245,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Luxury eco-lodge nestled in an ancient milkwood forest with panoramic views of Walker Bay and sustainable practices.",
    certifications: ["Fair Trade Tourism", "Green Leaf"],
    amenities: ["Solar Powered", "Organic Garden", "Conservation Programs"],
    carbonFootprint: "Low",
  },
  {
    id: "2",
    name: "Phinda Forest Lodge",
    location: "KwaZulu-Natal",
    price: 4200,
    rating: 4.8,
    reviews: 189,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Glass-encased suites set in rare sand forest with a commitment to wildlife conservation and community empowerment.",
    certifications: ["Fair Trade Tourism"],
    amenities: ["Wildlife Conservation", "Community Projects", "Sustainable Design"],
    carbonFootprint: "Low",
  },
  {
    id: "3",
    name: "Tswalu Kalahari Reserve",
    location: "Northern Cape",
    price: 5500,
    rating: 4.9,
    reviews: 172,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "South Africa's largest private wildlife reserve with a strong focus on conservation and sustainability.",
    certifications: ["Long Run Destination"],
    amenities: ["Solar Power", "Water Conservation", "Wildlife Research"],
    carbonFootprint: "Very Low",
  },
  {
    id: "4",
    name: "Hotel Verde Cape Town",
    location: "Cape Town, Western Cape",
    price: 1800,
    rating: 4.6,
    reviews: 278,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Africa's greenest hotel with zero-waste initiatives, renewable energy, and rainwater harvesting systems.",
    certifications: ["LEED Platinum", "Green Leaf"],
    amenities: ["Renewable Energy", "Eco-Pool", "Recycling Program"],
    carbonFootprint: "Very Low",
  },
  {
    id: "5",
    name: "Mdumbi Backpackers",
    location: "Wild Coast, Eastern Cape",
    price: 450,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=300",
    description: "Community-owned eco-lodge on the Wild Coast with solar power and community upliftment programs.",
    certifications: ["Fair Trade Tourism"],
    amenities: ["Solar Powered", "Community Projects", "Organic Garden"],
    carbonFootprint: "Low",
  },
  {
    id: "6",
    name: "Umlani Bushcamp",
    location: "Timbavati, Limpopo",
    price: 2800,
    rating: 4.8,
    reviews: 203,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Off-grid eco-lodge in the Timbavati Private Nature Reserve with a focus on authentic safari experiences.",
    certifications: ["Fair Trade Tourism", "Green Leaf"],
    amenities: ["Solar Powered", "Water Conservation", "Community Employment"],
    carbonFootprint: "Low",
  },
  {
    id: "7",
    name: "Bulungula Lodge",
    location: "Wild Coast, Eastern Cape",
    price: 550,
    rating: 4.5,
    reviews: 187,
    image: "/placeholder.svg?height=200&width=300",
    description: "Community-owned eco-lodge with 100% renewable energy and strong community involvement.",
    certifications: ["Fair Trade Tourism"],
    amenities: ["Renewable Energy", "Community Projects", "Waste Recycling"],
    carbonFootprint: "Very Low",
  },
  {
    id: "8",
    name: "Gondwana Game Reserve",
    location: "Garden Route, Western Cape",
    price: 3900,
    rating: 4.7,
    reviews: 215,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Luxury eco-reserve on the Garden Route with fynbos conservation and wildlife rehabilitation programs.",
    certifications: ["Green Leaf"],
    amenities: ["Fynbos Conservation", "Wildlife Programs", "Sustainable Design"],
    carbonFootprint: "Low",
  },
]

// Update the filters to match South African certifications

export default function AccommodationsPage() {
  const [priceRange, setPriceRange] = useState([0, 300])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    fairTradeTourism: false,
    greenLeaf: false,
    longRunDestination: false,
    leedPlatinum: false,
    lowCarbon: false,
    solarPowered: false,
    communityProjects: false,
    waterConservation: false,
  })

  // Update the filter handling function
  const filteredAccommodations = accommodations.filter((accommodation) => {
    // Search filter
    if (
      searchTerm &&
      !accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !accommodation.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Price filter
    if (accommodation.price < priceRange[0] || accommodation.price > priceRange[1]) {
      return false
    }

    // Certification filters
    if (filters.leedPlatinum && !accommodation.certifications?.includes("LEED Platinum")) {
      return false
    }

    if (filters.greenLeaf && !accommodation.certifications?.includes("Green Leaf")) {
      return false
    }

    if (filters.fairTradeTourism && !accommodation.certifications?.includes("Fair Trade Tourism")) {
      return false
    }

    if (filters.longRunDestination && !accommodation.certifications?.includes("Long Run Destination")) {
      return false
    }

    // Feature filters
    if (filters.lowCarbon && accommodation.carbonFootprint !== "Low" && accommodation.carbonFootprint !== "Very Low") {
      return false
    }

    if (
      filters.solarPowered &&
      !accommodation.amenities?.includes("Solar Powered") &&
      !accommodation.amenities?.includes("Solar Power") &&
      !accommodation.amenities?.includes("Renewable Energy")
    ) {
      return false
    }

    if (
      filters.communityProjects &&
      !accommodation.amenities?.includes("Community Projects") &&
      !accommodation.amenities?.includes("Community Employment")
    ) {
      return false
    }

    if (filters.waterConservation && !accommodation.amenities?.includes("Water Conservation")) {
      return false
    }

    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Eco-Friendly Accommodations</h1>
          <p className="text-muted-foreground">Find and book sustainable places to stay around the world.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Location or property name"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price Range (per night)</Label>
                <Slider
                  defaultValue={[0, 6000]}
                  max={6000}
                  step={500}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex items-center justify-between">
                  <span>R{priceRange[0]}</span>
                  <span>R{priceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fairTradeTourism"
                      checked={filters.fairTradeTourism}
                      onCheckedChange={(checked) => setFilters({ ...filters, fairTradeTourism: checked === true })}
                    />
                    <Label htmlFor="fairTradeTourism" className="text-sm font-normal cursor-pointer">
                      Fair Trade Tourism
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="greenLeaf"
                      checked={filters.greenLeaf}
                      onCheckedChange={(checked) => setFilters({ ...filters, greenLeaf: checked === true })}
                    />
                    <Label htmlFor="greenLeaf" className="text-sm font-normal cursor-pointer">
                      Green Leaf
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="longRunDestination"
                      checked={filters.longRunDestination}
                      onCheckedChange={(checked) => setFilters({ ...filters, longRunDestination: checked === true })}
                    />
                    <Label htmlFor="longRunDestination" className="text-sm font-normal cursor-pointer">
                      Long Run Destination
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="leedPlatinum"
                      checked={filters.leedPlatinum}
                      onCheckedChange={(checked) => setFilters({ ...filters, leedPlatinum: checked === true })}
                    />
                    <Label htmlFor="leedPlatinum" className="text-sm font-normal cursor-pointer">
                      LEED Platinum
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowCarbon"
                      checked={filters.lowCarbon}
                      onCheckedChange={(checked) => setFilters({ ...filters, lowCarbon: checked === true })}
                    />
                    <Label htmlFor="lowCarbon" className="text-sm font-normal cursor-pointer">
                      Low Carbon Footprint
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="solarPowered"
                      checked={filters.solarPowered}
                      onCheckedChange={(checked) => setFilters({ ...filters, solarPowered: checked === true })}
                    />
                    <Label htmlFor="solarPowered" className="text-sm font-normal cursor-pointer">
                      Solar/Renewable Energy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="communityProjects"
                      checked={filters.communityProjects}
                      onCheckedChange={(checked) => setFilters({ ...filters, communityProjects: checked === true })}
                    />
                    <Label htmlFor="communityProjects" className="text-sm font-normal cursor-pointer">
                      Community Projects
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="waterConservation"
                      checked={filters.waterConservation}
                      onCheckedChange={(checked) => setFilters({ ...filters, waterConservation: checked === true })}
                    />
                    <Label htmlFor="waterConservation" className="text-sm font-normal cursor-pointer">
                      Water Conservation
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("")
                  setPriceRange([0, 300])
                  setFilters({
                    fairTradeTourism: false,
                    greenLeaf: false,
                    longRunDestination: false,
                    leedPlatinum: false,
                    lowCarbon: false,
                    solarPowered: false,
                    communityProjects: false,
                    waterConservation: false,
                  })
                }}
              >
                Reset Filters
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{filteredAccommodations.length} properties found</div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-sm">
                  Sort by:
                </Label>
                <select id="sort" className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {filteredAccommodations.map((accommodation) => (
                <Card key={accommodation.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={accommodation.image || "/placeholder.svg"}
                      alt={accommodation.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Eco-Friendly
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{accommodation.name}</CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{accommodation.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">({accommodation.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {accommodation.location}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{accommodation.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {accommodation.certifications?.map((cert) => (
                        <Badge key={cert} variant="outline" className="bg-green-50">
                          <Leaf className="h-3 w-3 mr-1 text-green-600" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold">R{accommodation.price}</span>
                      <span className="text-sm text-muted-foreground"> / night</span>
                    </div>
                    <Link href={`/accommodations/${accommodation.id}`}>
                      <Button className="bg-green-600 hover:bg-green-700">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredAccommodations.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No accommodations found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
