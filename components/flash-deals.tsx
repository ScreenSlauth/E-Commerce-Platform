"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Clock, ShoppingCart, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

// Update the import at the top to use our data file
import { flashDeals } from "@/lib/data"

export function FlashDeals() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<{
    [key: number]: { hours: number; minutes: number; seconds: number; progress: number }
  }>({})
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()

      const newTimeLeft = flashDeals.reduce(
        (acc, deal) => {
          const endTime = new Date(deal.endTime)
          const difference = endTime.getTime() - now.getTime()
          const totalDuration = endTime.getTime() - now.getTime() - Math.random() * 3600000 * 24 // Random start time within 24 hours
          const progress = Math.max(0, Math.min(100, 100 - (difference / totalDuration) * 100))

          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60))
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            acc[deal.id] = { hours, minutes, seconds, progress }
          } else {
            acc[deal.id] = { hours: 0, minutes: 0, seconds: 0, progress: 100 }
          }

          return acc
        },
        {} as { [key: number]: { hours: number; minutes: number; seconds: number; progress: number } },
      )

      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleProductClick = (id: number) => {
    router.push(`/product/${id}`)
  }

  const addToCart = (id: number, name: string, price: number, image: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItem = cart.find((item: any) => item.id === id)

    if (existingItem) {
      // Increment quantity
      existingItem.quantity += 1
    } else {
      // Add new item
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      })
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    })

    // Force refresh header to update cart count
    window.dispatchEvent(new Event("storage"))
  }

  // Calculate items sold percentage (random between 30% and 90%)
  const getItemsSoldPercentage = useCallback((id: number) => {
    // Use the id to generate a consistent percentage
    return 30 + ((id * 13) % 60)
  }, [])

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <Skeleton className="h-[150px] w-[150px] mx-auto rounded-md" />
              <Skeleton className="h-4 w-3/4 mt-4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
              <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-full mt-4" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flashDeals.map((deal) => {
          const itemsSoldPercentage = getItemsSoldPercentage(deal.id)

          return (
            <Card
              key={deal.id}
              className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-primary/20"
              onClick={() => handleProductClick(deal.id)}
            >
              <div className="relative pt-4">
                <Badge className="absolute right-2 top-2 z-10 bg-red-500 text-white">
                  {deal.discountPercentage}% OFF
                </Badge>
                <div className="flex justify-center">
                  <Image
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.name}
                    width={150}
                    height={150}
                    className="h-[150px] w-[150px] object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="line-clamp-2 text-sm font-medium">{deal.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold">${deal.discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">${deal.originalPrice.toFixed(2)}</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-500">
                      {timeLeft[deal.id]?.hours.toString().padStart(2, "0")}:
                      {timeLeft[deal.id]?.minutes.toString().padStart(2, "0")}:
                      {timeLeft[deal.id]?.seconds.toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{itemsSoldPercentage}% Sold</span>
                      <span>Available: {100 - itemsSoldPercentage}</span>
                    </div>
                    <Progress value={itemsSoldPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full gap-2"
                  onClick={(e) => addToCart(deal.id, deal.name, deal.discountedPrice, deal.image, e)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center">
        <Link href="/deals">
          <Button variant="outline" className="gap-2">
            View All Deals
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

