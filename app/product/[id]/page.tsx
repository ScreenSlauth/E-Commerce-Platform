"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Heart, Share2, ShoppingCart, Star, Truck, ArrowRight, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { allProducts, flashDeals } from "@/lib/data"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [isFlashDeal, setIsFlashDeal] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [itemsSoldPercentage, setItemsSoldPercentage] = useState(0)

  useEffect(() => {
    // Find product by ID
    const foundProduct = allProducts.find((p) => p.id.toString() === productId)

    if (foundProduct) {
      setProduct(foundProduct)

      // Check if it's a flash deal
      const flashDeal = flashDeals.find((deal) => deal.id.toString() === productId)
      setIsFlashDeal(!!flashDeal)

      // If it's a flash deal, set up timer
      if (flashDeal) {
        // Calculate items sold percentage (random between 30% and 90%)
        setItemsSoldPercentage(30 + ((flashDeal.id * 13) % 60))

        // Set up timer
        const timer = setInterval(() => {
          const now = new Date()
          const endTime = new Date(flashDeal.endTime)
          const difference = endTime.getTime() - now.getTime()

          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60))
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            setTimeLeft({ hours, minutes, seconds })
          } else {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
            clearInterval(timer)
          }
        }, 1000)

        return () => clearInterval(timer)
      }

      // Set default selected color if product has colors
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0].value)
      }

      // Set default selected image
      setSelectedImage(foundProduct.image)

      // Check if product is in wishlist
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setInWishlist(wishlist.includes(foundProduct.id))

      // Find similar products (same category)
      if (foundProduct.category) {
        const category = foundProduct.category.toLowerCase()
        const similar = allProducts
          .filter((p) => p.category?.toLowerCase() === category && p.id !== foundProduct.id)
          .slice(0, 6)
        setSimilarProducts(similar)
      }

      // Add to recently viewed
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")

      // Remove if already exists (to move to top)
      const filtered = recentlyViewed.filter((item: any) => item.id !== foundProduct.id)

      // Add to beginning of array
      const newRecentlyViewed = [foundProduct, ...filtered].slice(0, 6)

      localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed))
    }
  }, [productId])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    if (inWishlist) {
      const newWishlist = wishlist.filter((id: number) => id !== product.id)
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      setInWishlist(false)
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
      })
    } else {
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, product.id]))
      setInWishlist(true)
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist",
      })
    }

    // Force refresh header
    window.dispatchEvent(new Event("storage"))
  }

  const addToCart = (id: string, name: string, price: number, image: string) => {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === id)

    if (existingItemIndex >= 0) {
      // Increment quantity
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({
        id: id,
        name: name,
        price: price,
        image: image,
        quantity: quantity,
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

  const buyNow = () => {
    const price = isFlashDeal ? product.discountedPrice : product.price
    addToCart(product.id, product.name, price, product.image)
    window.location.href = "/checkout"
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading product...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Create product images array
  const productImages = product.images ? product.images : [product.image]

  // Create product features array
  const features = product.features
    ? product.features
    : ["High-quality product", "Durable materials", "Excellent performance"]

  // Create product specifications
  const specifications = product.specifications
    ? product.specifications
    : {
        Brand: product.brand || "Unknown",
        Category: product.category || "General",
        "Item Weight": "0.5 kg",
        Dimensions: "10 x 5 x 2 cm",
        "Model Number": `SKU-${product.id}`,
        Warranty: "1 year",
      }

  // Create product reviews
  const reviews = product.reviews
    ? product.reviews
    : [
        {
          id: 1,
          user: "Customer",
          rating: product.rating || 4.5,
          date: "2023-05-15",
          title: "Great product",
          comment: "Very satisfied with this purchase. Would recommend to others.",
        },
      ]

  // Get the correct price based on whether it's a flash deal
  const displayPrice = isFlashDeal ? product.discountedPrice : product.price
  const originalPrice = isFlashDeal ? product.originalPrice : product.originalPrice || null
  const discountPercentage = isFlashDeal
    ? product.discountPercentage
    : product.discount || (originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : null)

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
            <Link href={`/category/${product.category?.toLowerCase() || "all"}`} className="hover:text-primary">
              {product.category || "Products"}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{product.name}</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border">
                <Image
                  src={selectedImage || product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-lg border cursor-pointer ${selectedImage === image ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating || 4.5} ({product.reviewCount || 100} reviews)
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-3xl font-bold">${displayPrice.toFixed(2)}</span>
                  {originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                      <Badge className="bg-red-500 text-white">{discountPercentage}% OFF</Badge>
                    </>
                  )}
                </div>

                {isFlashDeal && (
                  <div className="mt-4 space-y-3 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-500">Flash Deal Ends In:</span>
                      <span className="font-bold text-red-500">
                        {timeLeft.hours.toString().padStart(2, "0")}:{timeLeft.minutes.toString().padStart(2, "0")}:
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{itemsSoldPercentage}% Sold</span>
                        <span>Available: {100 - itemsSoldPercentage}</span>
                      </div>
                      <Progress value={itemsSoldPercentage} className="h-2" />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium">Color</h2>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((color: any) => (
                      <div
                        key={color.name}
                        className={`relative h-10 w-10 cursor-pointer rounded-full border p-1 ${
                          selectedColor === color.value ? "ring-2 ring-primary" : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        onClick={() => setSelectedColor(color.value)}
                      >
                        <span className="sr-only">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-medium">Quantity</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 10)}
                  >
                    +
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">{product.stock || "In"} stock</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => addToCart(product.id, product.name, displayPrice, product.image)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="secondary" className="flex-1" onClick={buyNow}>
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`w-12 ${inWishlist ? "text-red-500" : ""}`}
                  onClick={toggleWishlist}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500" : ""}`} />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
                <Button size="lg" variant="outline" className="w-12">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-medium">Free shipping</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Estimated delivery: 3-5 business days</p>
              </div>

              <div>
                <h2 className="text-lg font-medium">Highlights</h2>
                <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-10">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 space-y-4">
              <p>{product.description || "High-quality product with excellent features and performance."}</p>
              <h3 className="text-lg font-medium">Features</h3>
              <ul className="list-inside list-disc space-y-2">
                {features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{product.rating || 4.5}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {product.reviewCount || 100} reviews</p>
                </div>
                <Button>Write a Review</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="mt-2 font-medium">{review.title}</h4>
                      <p className="mt-1 text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>

          {flashDeals.length > 0 && (
            <section className="mt-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Flash Deals</h2>
                  <p className="text-muted-foreground">Limited-time offers at incredible prices</p>
                </div>
                <Link
                  href="/deals"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  View all deals
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {flashDeals.slice(0, 4).map((deal) => (
                  <Card
                    key={deal.id}
                    className="overflow-hidden cursor-pointer"
                    onClick={() => (window.location.href = `/product/${deal.id}`)}
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
                          className="h-[150px] w-[150px] object-contain transition-transform hover:scale-105"
                        />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="line-clamp-2 text-sm font-medium">{deal.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold">${deal.discountedPrice.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${deal.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(deal.id.toString(), deal.name, deal.discountedPrice, deal.image)
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
              <Link
                href={`/category/${product.category?.toLowerCase() || "electronics"}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {similarProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => (window.location.href = `/product/${product.id}`)}
                >
                  <div className="relative pt-4">
                    {product.isNew && (
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                        New
                      </span>
                    )}
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
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

