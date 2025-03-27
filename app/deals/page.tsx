"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, ShoppingCart, Filter } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "@/components/ui/use-toast"
import { flashDeals } from "@/lib/data"

export default function DealsPage() {
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: { hours: number; minutes: number; seconds: number } }>({})
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

          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60))
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            acc[deal.id] = { hours, minutes, seconds }
          } else {
            acc[deal.id] = { hours: 0, minutes: 0, seconds: 0 }
          }

          return acc
        },
        {} as { [key: number]: { hours: number; minutes: number; seconds: number } },
      )

      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleProductClick = (id: number) => {
    window.location.href = `/product/${id}`
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
  const getItemsSoldPercentage = (id: number) => {
    // Use the id to generate a consistent percentage
    return 30 + ((id * 13) % 60)
  }

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
          <h1 className="text-3xl font-bold mb-6">Flash Deals</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Flash Deals</h1>
            <p className="text-muted-foreground">Limited-time offers at incredible prices</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter Deals
          </Button>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      </main>
      <SiteFooter />
    </div>
  )
}

