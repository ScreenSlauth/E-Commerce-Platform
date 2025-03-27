import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, Heart, MapPin, CreditCard, Settings, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getCurrentUser } from "@/lib/auth"
import { users } from "@/lib/data"
import { trendingProducts, recommendedProducts } from "@/lib/data"

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get full user data including orders, addresses, etc.
  const userData = users.find((u) => u.id === user.id)

  if (!userData) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={user.avatar || "/placeholder.svg?height=64&width=64"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">Welcome back, {user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/account/settings">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment Methods</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>View and manage your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.orders.length > 0 ? (
                    <div className="space-y-4">
                      {userData.orders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {order.status}
                              </span>
                              <span className="font-medium">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-md border">
                                  <Image
                                    src={item.image || "/placeholder.svg?height=64&width=64"}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Track Order
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        When you place an order, it will appear here.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="wishlist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>Items you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.wishlist.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {userData.wishlist.map((productId) => {
                        const product = [...trendingProducts, ...recommendedProducts].find((p) => p.id === productId)
                        if (!product) return null
                        return (
                          <div key={product.id} className="rounded-lg border p-4">
                            <div className="relative h-40 w-full overflow-hidden rounded-md">
                              <Image
                                src={product.image || "/placeholder.svg?height=160&width=160"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="mt-2 font-medium">{product.name}</h3>
                            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                            <div className="mt-2 flex gap-2">
                              <Button className="flex-1">Add to Cart</Button>
                              <Button variant="outline" size="icon">
                                <Heart className="h-4 w-4 fill-current" />
                                <span className="sr-only">Remove from wishlist</span>
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Save items you like for later by clicking the heart icon.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/">Explore Products</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="addresses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Addresses</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.addresses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {userData.addresses.map((address) => (
                        <div key={address.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{address.type}</span>
                              {address.isDefault && (
                                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No addresses saved</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Add an address to make checkout faster.</p>
                      <Button className="mt-4">Add Address</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No payment methods</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Add a payment method to make checkout faster.</p>
                    <Button className="mt-4">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

