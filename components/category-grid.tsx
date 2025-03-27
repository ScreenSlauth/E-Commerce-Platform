import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/data"

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
      {categories.map((category) => (
        <Link key={category.id} href={category.link} passHref>
          <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={50}
                  height={50}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="text-center text-sm font-medium">{category.name}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

