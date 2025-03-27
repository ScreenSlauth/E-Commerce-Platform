import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Shield, Truck, Clock, Gift, HelpCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { NewsletterForm } from "@/components/newsletter-form"
import { SocialLinks } from "@/components/social-links"
import { PaymentMethods } from "@/components/payment-methods"

export function SiteFooter() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-primary/10 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to our Newsletter</h3>
              <p className="text-muted-foreground">Get the latest updates, deals and exclusive offers</p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium">Free Shipping</h4>
            <p className="text-sm text-muted-foreground">On orders over $100</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">Get help when you need it</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium">Special Offers</h4>
            <p className="text-sm text-muted-foreground">Save with our deals</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium">Secure Payments</h4>
            <p className="text-sm text-muted-foreground">100% protected checkout</p>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">ShopHub</h4>
            <p className="text-muted-foreground mb-4">
              Your one-stop destination for all your shopping needs with the best prices and quality products.
            </p>
            <SocialLinks />

            <div className="mt-6">
              <h5 className="font-medium mb-2">Download Our App</h5>
              <div className="flex gap-2">
                <Link href="#">
                  <Image
                    src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                    alt="App Store"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Google Play"
                    width={135}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-muted-foreground hover:text-primary">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-muted-foreground hover:text-primary">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-primary">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-muted-foreground hover:text-primary">
                  Warranty & Repairs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 Shopping Avenue, Retail District, NY 10001, USA</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href="mailto:support@shophub.com" className="text-muted-foreground hover:text-primary">
                  support@shophub.com
                </a>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">Mon-Fri: 9AM - 8PM, Sat-Sun: 10AM - 6PM</span>
              </li>
              <li className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h4 className="font-bold text-lg mb-4 text-center">We Accept</h4>
          <PaymentMethods />
        </div>

        {/* Copyright */}
        <div className="text-center text-muted-foreground text-sm border-t border-gray-200 pt-8">
          <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          <p className="mt-2">Designed and developed with ❤️ for a better shopping experience.</p>
        </div>
      </div>
    </footer>
  )
}

