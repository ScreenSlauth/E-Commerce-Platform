"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { carouselItems } from "@/lib/data"

export function MainCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => {
    setCurrent((current) => (current === 0 ? carouselItems.length - 1 : current - 1))
  }, [])

  const next = useCallback(() => {
    setCurrent((current) => (current === carouselItems.length - 1 ? 0 : current + 1))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 5000)
    return () => clearInterval(interval)
  }, [next])

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {carouselItems.map((item) => (
          <div key={item.id} className="relative min-w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" priority />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center text-white md:items-start md:p-10 lg:p-16">
              <h2 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">{item.title}</h2>
              <p className="mb-4 max-w-md text-sm md:text-base">{item.description}</p>
              <Link href={item.link}>
                <Button size="lg" className={`${item.color} hover:${item.color}/90`}>
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={next}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {carouselItems.map((_, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className={`h-2 w-2 rounded-full p-0 ${index === current ? "bg-primary" : "bg-background/80"}`}
            onClick={() => setCurrent(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

