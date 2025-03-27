import Link from "next/link"
import { CheckCircle, Package, Printer, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ConfirmationPage() {
  const orderNumber = "ORD-" + Math.floor(10000 + Math.random() * 90000)
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">Order Confirmed!</h1>
            <p className="mt-2 text-muted-foreground">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Order #{orderNumber} • Placed on {orderDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <span>3-5 business days</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  John Doe
                  <br />
                  123 Main St
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-sm text-muted-foreground">Credit Card ending in 4242</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-2">
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Button asChild className="gap-2">
                <Link href="/">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Have questions about your order?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

