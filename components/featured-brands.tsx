"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { brands } from "@/lib/data"

export function FeaturedBrands() {
  const router = useRouter()

  const handleBrandClick = (link: string) => {
    router.push(link)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
            onClick={() => handleBrandClick(brand.link)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Image
                src={brand.image || "/placeholder.svg"}
                alt={brand.name}
                width={80}
                height={80}
                className="h-16 w-16 object-contain"
              />
              <span className="mt-2 text-center text-sm font-medium">{brand.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {brands.slice(0, 3).map((brand) => (
          <Card
            key={`featured-${brand.id}`}
            className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
            onClick={() => handleBrandClick(brand.link)}
          >
            <div className="flex items-center p-4">
              <div className="flex-shrink-0 mr-4">
                <Image
                  src={brand.image || "/placeholder.svg"}
                  alt={brand.name}
                  width={60}
                  height={60}
                  className="h-14 w-14 object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">{brand.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {brand.name === "Apple" && "Latest iPhones, MacBooks & more"}
                  {brand.name === "Samsung" && "Galaxy phones, TVs & appliances"}
                  {brand.name === "Sony" && "Premium electronics & gaming"}
                  {brand.name === "Nike" && "Athletic footwear & apparel"}
                  {brand.name === "Adidas" && "Sports gear & fashion"}
                  {brand.name === "LG" && "Smart TVs & home appliances"}
                </p>
                <div className="mt-2 text-sm text-primary">Shop now</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

