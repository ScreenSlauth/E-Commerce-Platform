"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    originalPrice?: number
    image: string
    category?: string
    rating?: number
    reviewCount?: number
    isNew?: boolean
    isSale?: boolean
    discountPercentage?: number
    link?: string
    endTime?: Date
    stock?: number
  }
  variant?: "default" | "compact" | "deal"
  onAddToCart?: (id: string | number, name: string, price: number, image: string) => void
  onAddToWishlist?: (id: string | number) => void
}

export function ProductCard({ product, variant = "default", onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  // Calculate time left for deals
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(
    product.endTime ? calculateTimeLeft(product.endTime) : null,
  )

  // Calculate time left
  function calculateTimeLeft(endTime: Date) {
    const difference = new Date(endTime).getTime() - new Date().getTime()

    if (difference > 0) {
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    return { hours: 0, minutes: 0, seconds: 0 }
  }

  // Update timer every second for deals
  useState(() => {
    if (!product.endTime) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.endTime!))
    }, 1000)

    return () => clearInterval(timer)
  })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onAddToCart) {
      onAddToCart(product.id, product.name, product.price, product.image)
    } else {
      // Default implementation
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    } else {
      // Default implementation
      setIsWishlisted(!isWishlisted)
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
      })
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discountPercentage || 0

  // Generate a random stock percentage between 30% and 90% based on product id
  const stockPercentage =
    typeof product.id === "number" ? 30 + ((product.id * 13) % 60) : Math.floor(Math.random() * 60) + 30

  return (
    <Card className="overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <Link href={product.link || `/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>

        {product.isNew && <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">New</Badge>}

        {(product.isSale || discount > 0) && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>
        )}
      </div>

      <CardContent className="flex-grow pt-4">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2">
            <Link href={product.link || `/product/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          {product.category && <p className="text-sm text-muted-foreground capitalize">{product.category}</p>}

          <div className="flex items-center gap-2">
            <div className="font-semibold">${product.price.toFixed(2)}</div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</div>
            )}
          </div>

          {product.rating !== undefined && product.reviewCount !== undefined && (
            <div className="flex items-center text-sm">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
              </div>
              <span className="ml-1 text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}

          {variant === "deal" && timeLeft && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium text-red-500">
                  {timeLeft.hours.toString().padStart(2, "0")}:{timeLeft.minutes.toString().padStart(2, "0")}:
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{stockPercentage}% Sold</span>
                  <span>Available: {100 - stockPercentage}</span>
                </div>
                <Progress value={stockPercentage} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {variant !== "compact" && (
        <CardFooter className="pt-0">
          <Button onClick={handleAddToCart} className="w-full" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

