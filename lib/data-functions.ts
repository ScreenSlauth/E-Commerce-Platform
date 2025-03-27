"use client"

import { toast } from "@/components/ui/use-toast"

// Cart functions
export function addToCart(productId: string, quantity = 1) {
  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex((item: any) => item.id === productId)

  if (existingItemIndex >= 0) {
    // Update quantity if product already in cart
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item to cart
    cart.push({ id: productId, quantity })
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Return updated cart
  return cart
}

export function removeFromCart(productId: string) {
  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")

  // Filter out the product to remove
  const updatedCart = cart.filter((item: any) => item.id !== productId)

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(updatedCart))

  // Return updated cart
  return updatedCart
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")

  // Find the product in the cart
  const existingItemIndex = cart.findIndex((item: any) => item.id === productId)

  if (existingItemIndex >= 0) {
    // Update quantity
    cart[existingItemIndex].quantity = quantity

    // Remove item if quantity is 0
    if (quantity <= 0) {
      cart.splice(existingItemIndex, 1)
    }
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Return updated cart
  return cart
}

export function getCart() {
  // Get cart from localStorage
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("cart") || "[]")
  }
  return []
}

// Wishlist functions
export function addToWishlist(productId: string) {
  // Get existing wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

  // Check if product already exists in wishlist
  const existingItemIndex = wishlist.findIndex((id: string) => id === productId)

  if (existingItemIndex >= 0) {
    // Remove from wishlist if already exists
    wishlist.splice(existingItemIndex, 1)
    toast({
      title: "Removed from wishlist",
      description: "The product has been removed from your wishlist.",
    })
  } else {
    // Add to wishlist
    wishlist.push(productId)
    toast({
      title: "Added to wishlist",
      description: "The product has been added to your wishlist.",
    })
  }

  // Save updated wishlist to localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist))

  // Return updated wishlist
  return wishlist
}

export function removeFromWishlist(productId: string) {
  // Get existing wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

  // Filter out the product to remove
  const updatedWishlist = wishlist.filter((id: string) => id !== productId)

  // Save updated wishlist to localStorage
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

  // Return updated wishlist
  return updatedWishlist
}

export function getWishlist() {
  // Get wishlist from localStorage
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("wishlist") || "[]")
  }
  return []
}

