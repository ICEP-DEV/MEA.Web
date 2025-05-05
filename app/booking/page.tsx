import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, MapPin, Star, Users, CalendarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Dummy data for user bookings
const bookings = [
  {
    id: 1,
    accommodation: "Grootbos Private Nature Reserve",
    location: "Gansbaai, Western Cape",
    checkIn: "2025-05-01",
    checkOut: "2025-05-04",
    guests: 2,
    price: "R4,500",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.9
  },
  {
    id: 2,
    accommodation: "Tswalu Kalahari Reserve",
    location: "Northern Cape",
    checkIn: "2025-06-10",
    checkOut: "2025-06-12",
    guests: 1,
    price: "R12,800",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.8
  },
  {
    id: 3,
    accommodation: "Bulungula Lodge",
    location: "Wild Coast, Eastern Cape",
    checkIn: "2025-07-05",
    checkOut: "2025-07-10",
    guests: 3,
    price: "R850",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.7
  }
]

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      {/* Header with logo placeholder */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            {/* Logo image placeholder, replace src with your logo */}
            <div className="relative h-10 w-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border border-green-200 shadow-sm group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-green-800 group-hover:text-green-700 transition-colors">STAY GREEN</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <section className="w-full py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-10">My Bookings</h1>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="flex flex-col shadow-lg rounded-xl overflow-hidden bg-white transition-transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-48 md:h-56 w-full">
                    <Image
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.accommodation}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute top-3 right-3 bg-green-600/90 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center shadow">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      {booking.rating}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg md:text-xl">{booking.accommodation}</CardTitle>
                    <CardDescription className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-green-500" />
                      {booking.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-sm text-gray-700 mb-1 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-green-500" />
                      {booking.checkIn} to {booking.checkOut}
                    </div>
                    <div className="text-sm text-gray-700 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-green-500" />
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </div>
                    <p className="font-bold text-green-700 text-lg">
                      {booking.price}
                      <span className="text-sm font-normal text-gray-500 ml-1">per night</span>
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-2 rounded-lg shadow-sm transition-colors">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-green-50 py-8 mt-auto">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8 px-4">
          <p className="text-center text-sm text-gray-600">© 2025 STAY GREEN. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline text-green-700" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm font-medium hover:underline text-green-700" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
