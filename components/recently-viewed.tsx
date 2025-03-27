"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

export function RecentlyViewed() {
  const router = useRouter()
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    // Get recently viewed products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    setRecentProducts(storedProducts)

    // Listen for storage events to update when new products are viewed
    const handleStorageChange = () => {
      const updatedProducts = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
      setRecentProducts(updatedProducts)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleProductClick = (product: any) => {
    router.push(`/product/${product.id}`)
  }

  if (recentProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recently viewed products</p>
        <p className="text-sm text-muted-foreground mt-2">Products you view will appear here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
      {recentProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
          onClick={() => handleProductClick(product)}
        >
          <CardContent className="p-4">
            <div className="flex justify-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>
              <p className="mt-1 text-sm font-bold">${product.price?.toFixed(2) || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

