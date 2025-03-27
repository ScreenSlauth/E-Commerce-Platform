"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Update the import at the top to use our data file
import { trendingProducts } from "@/lib/data"

export function TrendingProducts() {
  const router = useRouter()
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((itemId) => itemId !== id))
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
      })
    } else {
      setWishlist([...wishlist, id])
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist",
      })
    }
  }

  const addToCart = (id: number, name: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // In a real app, this would update a cart state or call an API
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    })
  }

  const handleProductClick = (link: string) => {
    router.push(link)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {trendingProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden cursor-pointer"
          onClick={() => handleProductClick(product.link)}
        >
          <div className="relative pt-4">
            {product.isNew && <Badge className="absolute left-2 top-2 z-10">New</Badge>}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full"
              onClick={(e) => toggleWishlist(product.id, e)}
            >
              <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <div className="flex justify-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={150}
                height={150}
                className="h-[150px] w-[150px] object-contain transition-transform hover:scale-105"
              />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
            <div className="mt-2 flex items-center">
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={(e) => addToCart(product.id, product.name, e)}>
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

