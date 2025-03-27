"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { trendingProducts } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function TrendingPage() {
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

      // Store in localStorage
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      localStorage.setItem("wishlist", JSON.stringify([...storedWishlist, id]))
    }
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

  const handleProductClick = (product: any) => {
    // Add to recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")

    // Remove if already exists (to move to top)
    const filtered = recentlyViewed.filter((item: any) => item.id !== product.id)

    // Add to beginning of array
    const newRecentlyViewed = [product, ...filtered].slice(0, 6)

    localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed))

    // Navigate to product page
    router.push(`/product/${product.id}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Trending Products</span>
          </div>

          <h1 className="text-2xl font-bold md:text-3xl mb-6">Trending Products</h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trendingProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative pt-4">
                  {product.isNew && (
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      New
                    </span>
                  )}
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
                  <Button
                    className="w-full"
                    onClick={(e) => addToCart(product.id, product.name, product.price, product.image, e)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

