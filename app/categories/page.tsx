import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { categories } from "@/lib/data"
import { ChevronRight } from "lucide-react"

export default function CategoriesPage() {
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
            <span>Categories</span>
          </div>

          <h1 className="text-2xl font-bold md:text-3xl mb-6">Shop by Category</h1>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={category.link} passHref>
                <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <h2 className="text-center text-lg font-medium">{category.name}</h2>
                    <p className="mt-2 text-sm text-center text-muted-foreground">
                      Explore our {category.name.toLowerCase()} collection
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

