import { redirect } from "next/navigation"
import Link from "next/link"
import { Bell, ChevronRight, ShoppingBag, Tag, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getCurrentUser } from "@/lib/auth"

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "Your order has been shipped",
    description: "Order #ORD-1001 has been shipped and will arrive in 3-5 business days.",
    date: "2 hours ago",
    icon: Truck,
    read: false,
    link: "/account/orders",
  },
  {
    id: 2,
    title: "Flash sale: Up to 50% off",
    description: "Don't miss our flash sale on electronics. Limited time offer!",
    date: "Yesterday",
    icon: Tag,
    read: false,
    link: "/category/electronics",
  },
  {
    id: 3,
    title: "New arrivals in Fashion",
    description: "Check out the latest fashion trends for this season.",
    date: "3 days ago",
    icon: ShoppingBag,
    read: true,
    link: "/category/fashion",
  },
]

export default async function NotificationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
            <span>Notifications</span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  {unreadCount} new
                </span>
              )}
            </div>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>

          <div className="mt-8 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        <CardDescription className="text-xs">{notification.date}</CardDescription>
                      </div>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={notification.link}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-medium">No notifications</h2>
                <p className="mt-2 text-muted-foreground">You don't have any notifications at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

