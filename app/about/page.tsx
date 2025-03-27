import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
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
            <span>About Us</span>
          </div>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">About ShopHub</h1>

            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&h=400"
                alt="ShopHub Team"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Our Story</h2>
              <p>
                Founded in 2020, ShopHub started with a simple mission: to create an online shopping experience that
                combines convenience, quality, and affordability. What began as a small startup has grown into a
                comprehensive e-commerce platform serving customers worldwide.
              </p>

              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p>
                At ShopHub, we're committed to providing our customers with a seamless shopping experience, offering
                high-quality products at competitive prices, and delivering exceptional customer service. We believe
                that online shopping should be easy, enjoyable, and accessible to everyone.
              </p>

              <h2 className="text-2xl font-semibold">What Sets Us Apart</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Curated selection of products from trusted brands and manufacturers</li>
                <li>Rigorous quality control to ensure customer satisfaction</li>
                <li>Fast and reliable shipping options</li>
                <li>Dedicated customer support team available 24/7</li>
                <li>Secure payment processing and data protection</li>
                <li>Commitment to sustainable and ethical business practices</li>
              </ul>

              <h2 className="text-2xl font-semibold">Our Team</h2>
              <p>
                Our diverse team of professionals is passionate about e-commerce and dedicated to creating the best
                possible shopping experience for our customers. From our product curators to our customer service
                representatives, everyone at ShopHub is committed to excellence.
              </p>

              <h2 className="text-2xl font-semibold">Join Us</h2>
              <p>
                We're always looking for talented individuals to join our team. If you're passionate about e-commerce
                and want to be part of a dynamic, growing company, check out our{" "}
                <Link href="/careers" className="text-primary hover:underline">
                  careers page
                </Link>{" "}
                for current opportunities.
              </p>

              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                Have questions or feedback? We'd love to hear from you! Visit our{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>{" "}
                to get in touch with our team.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

