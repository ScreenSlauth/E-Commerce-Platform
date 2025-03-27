import { Suspense } from "react"
import Link from "next/link"
import { MainCarousel } from "@/components/main-carousel"
import { TrendingProducts } from "@/components/trending-products"
import { FlashDeals } from "@/components/flash-deals"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { CategoryGrid } from "@/components/category-grid"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FeaturedBrands } from "@/components/featured-brands"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full">
          <MainCarousel />
        </section>

        <section className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Flash Deals</h2>
              <p className="text-muted-foreground">Limited-time offers at incredible prices</p>
            </div>
            <Link href="/deals" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-muted"></div>}>
            <FlashDeals />
          </Suspense>
        </section>

        <section className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Shop by Category</h2>
            <Link
              href="/categories"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              All categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoryGrid />
        </section>

        <section className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trending Products</h2>
            <Link href="/trending" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-muted"></div>}>
            <TrendingProducts />
          </Suspense>
        </section>

        <section className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Brands</h2>
            <Link href="/brands" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              All brands
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedBrands />
        </section>

        <section className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Recommended for You</h2>
          </div>
          <Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-muted"></div>}>
            <PersonalizedRecommendations />
          </Suspense>
        </section>

        <section className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Recently Viewed</h2>
          </div>
          <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-muted"></div>}>
            <RecentlyViewed />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

