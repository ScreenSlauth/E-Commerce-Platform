"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, Heart, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "@/components/ui/use-toast"
import { allProducts } from "@/lib/data"

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])

  useEffect(() => {
    // Get wishlist from localStorage
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]")

    // Get products for these IDs
    const products = wishlistIds.map((id: number) => allProducts.find((product) => product.id === id)).filter(Boolean)

    setWishlistProducts(products)
  }, [])

  const removeFromWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Get current wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    // Remove product
    const newWishlist = wishlist.filter((productId: number) => productId !== id)

    // Save back to localStorage
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))

    // Update state
    setWishlistProducts(wishlistProducts.filter((product) => product.id !== id))

    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist",
    })

    // Force refresh header
    window.dispatchEvent(new Event("storage"))
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
    router.push(`/product/${product.id}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Wishlist</span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">My Wishlist</h1>
            <span className="text-sm text-muted-foreground">{wishlistProducts.length} items</span>
          </div>

          {wishlistProducts.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wishlistProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={(e) => removeFromWishlist(product.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Remove from wishlist</span>
                    </Button>
                    <div className="relative pt-4">
                      <div className="flex justify-center">
                        <Image
                          src={product.image || "/placeholder.svg?height=200&width=200"}
                          alt={product.name || "Product"}
                          width={200}
                          height={200}
                          className="h-[200px] w-[200px] object-contain transition-transform hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
                    <div className="mt-2 flex items-center">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full gap-2"
                      onClick={(e) => addToCart(product.id, product.name, product.price, product.image, e)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <Heart className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">Your wishlist is empty</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Items added to your wishlist will be saved here. Start exploring and add your favorite products!
              </p>
              <Button className="mt-6" asChild>
                <Link href="/">Explore Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

