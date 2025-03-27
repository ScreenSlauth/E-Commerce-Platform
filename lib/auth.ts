"use server"

import { cookies } from "next/headers"
import { users } from "./data"

export async function login(email: string, password: string) {
  // First check if there's a registered user in localStorage
  const registeredUser = localStorage.getItem("user")
  if (registeredUser) {
    const user = JSON.parse(registeredUser)
    if (user.email === email) {
      // In a real app, you would hash the password and compare with the stored hash
      // Set a cookie to indicate the user is logged in
      cookies().set("userId", user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return { success: true, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } }
    }
  }

  // If no match in localStorage, check the predefined users
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Set a cookie to indicate the user is logged in
    cookies().set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } }
  }

  return { success: false, error: "Invalid email or password" }
}

export async function logout() {
  cookies().delete("userId")
  return { success: true }
}

export async function getCurrentUser() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  // Check localStorage first
  const registeredUser = localStorage.getItem("user")
  if (registeredUser) {
    const user = JSON.parse(registeredUser)
    if (user.id.toString() === userId) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    }
  }

  // Then check predefined users
  const user = users.find((u) => u.id.toString() === userId)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }
}

