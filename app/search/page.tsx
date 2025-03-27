"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Filter, Grid3X3, List, SearchIcon, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { allProducts } from "@/lib/data"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  // Filter products based on search query and filters
  useEffect(() => {
    // Get initial filtered products based on search query
    let filtered = allProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))

    // Filter by price
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand))
    }

    // Filter by ratings
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) => selectedRatings.includes(Math.floor(product.rating)))
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(filtered)

    // Load wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlist(storedWishlist)
  }, [query, priceRange, selectedBrands, selectedRatings, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (wishlist.includes(id)) {
      const newWishlist = wishlist.filter((itemId) => itemId !== id)
      setWishlist(newWishlist)
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
      })
    } else {
      const newWishlist = [...wishlist, id]
      setWishlist(newWishlist)
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist",
      })
    }

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

  // Get unique brands from filtered products
  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)))

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
            <span>Search Results</span>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                {query ? `Search results for "${query}"` : "All Products"}
              </h1>
              <p className="text-muted-foreground">{filteredProducts.length} products found</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-medium">Price Range</h3>
                      <div className="mt-4 px-2">
                        <Slider
                          defaultValue={[0, 2000]}
                          max={2000}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Brands</h3>
                      <div className="mt-2 space-y-2">
                        {brands.map((brand) => (
                          <div key={brand} className="flex items-center gap-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedBrands([...selectedBrands, brand])
                                } else {
                                  setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                                }
                              }}
                            />
                            <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Rating</h3>
                      <div className="mt-2 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={selectedRatings.includes(rating)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedRatings([...selectedRatings, rating])
                                } else {
                                  setSelectedRatings(selectedRatings.filter((r) => r !== rating))
                                }
                              }}
                            />
                            <Label htmlFor={`rating-${rating}`} className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1">& Up</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPriceRange([0, 2000])
                          setSelectedBrands([])
                          setSelectedRatings([])
                        }}
                      >
                        Reset
                      </Button>
                      <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-1 rounded-md border px-3 py-2">
                <span className="text-sm">Sort by:</span>
                <select
                  className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              <div className="flex">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setView("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-8">
              {view === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
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
                          <Heart
                            className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
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
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden" onClick={() => handleProductClick(product)}>
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative flex items-center justify-center p-4 sm:w-1/3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full"
                            onClick={(e) => toggleWishlist(product.id, e)}
                          >
                            <Heart
                              className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="h-[200px] w-[200px] object-contain"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <h3 className="text-lg font-medium">{product.name}</h3>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
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
                            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                          </div>
                          <p className="mt-2 text-muted-foreground">
                            {product.description || "High-quality product with excellent features and performance."}
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button
                              onClick={(e) => addToCart(product.id, product.name, product.price, product.image, e)}
                            >
                              Add to Cart
                            </Button>
                            <Button variant="outline" onClick={() => handleProductClick(product)}>
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <SearchIcon className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">No results found</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                We couldn't find any products matching your search. Try using different keywords or browse our
                categories.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

