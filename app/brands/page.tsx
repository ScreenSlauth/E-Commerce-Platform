import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { brands } from "@/lib/data"
import { ChevronRight } from "lucide-react"

export default function BrandsPage() {
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
            <span>Brands</span>
          </div>

          <h1 className="text-2xl font-bold md:text-3xl mb-6">Shop by Brand</h1>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((brand) => (
              <Link key={brand.id} href={brand.link} passHref>
                <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Image
                      src={brand.image || "/placeholder.svg"}
                      alt={brand.name}
                      width={100}
                      height={100}
                      className="h-24 w-24 object-contain mb-4"
                    />
                    <h2 className="text-center text-lg font-medium">{brand.name}</h2>
                    <p className="mt-2 text-sm text-center text-muted-foreground">
                      {brand.name === "Apple" && "Latest iPhones, MacBooks & more"}
                      {brand.name === "Samsung" && "Galaxy phones, TVs & appliances"}
                      {brand.name === "Sony" && "Premium electronics & gaming"}
                      {brand.name === "Nike" && "Athletic footwear & apparel"}
                      {brand.name === "Adidas" && "Sports gear & fashion"}
                      {brand.name === "LG" && "Smart TVs & home appliances"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

