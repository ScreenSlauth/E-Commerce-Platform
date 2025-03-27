"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getProductsByCategory } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { PriceFilter } from "@/components/price-filter"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const categoryProducts = await getProductsByCategory(slug)
      setProducts(categoryProducts)
      setFilteredProducts(categoryProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [slug])

  const handlePriceFilter = (min: number, max: number) => {
    const filtered = products.filter((product) => product.price >= min && product.price <= max)
    setFilteredProducts(filtered)
  }

  // Find min and max prices
  const minPrice = products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 2000

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: slug.charAt(0).toUpperCase() + slug.slice(1), href: "#" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8 capitalize">{slug} Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <PriceFilter minPrice={minPrice} maxPrice={maxPrice} onPriceChange={handlePriceFilter} />
        </div>

        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

