import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex space-x-4">
      <Link
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-primary transition-colors"
      >
        <Facebook className="h-5 w-5" />
        <span className="sr-only">Facebook</span>
      </Link>
      <Link
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-primary transition-colors"
      >
        <Twitter className="h-5 w-5" />
        <span className="sr-only">Twitter</span>
      </Link>
      <Link
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-primary transition-colors"
      >
        <Instagram className="h-5 w-5" />
        <span className="sr-only">Instagram</span>
      </Link>
      <Link
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-primary transition-colors"
      >
        <Youtube className="h-5 w-5" />
        <span className="sr-only">YouTube</span>
      </Link>
      <Link
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-primary transition-colors"
      >
        <Linkedin className="h-5 w-5" />
        <span className="sr-only">LinkedIn</span>
      </Link>
    </div>
  )
}

