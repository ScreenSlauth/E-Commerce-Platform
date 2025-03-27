"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PriceFilterProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (min: number, max: number) => void
}

export function PriceFilter({ minPrice, maxPrice, onPriceChange }: PriceFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [minInput, setMinInput] = useState(minPrice.toString())
  const [maxInput, setMaxInput] = useState(maxPrice.toString())
  const [pricePresets, setPricePresets] = useState<[number, number][]>([])

  useEffect(() => {
    // Generate price presets based on the max price
    const range = maxPrice - minPrice
    const step = Math.ceil(range / 5)

    const presets: [number, number][] = [
      [minPrice, minPrice + step],
      [minPrice + step, minPrice + step * 2],
      [minPrice + step * 2, minPrice + step * 3],
      [minPrice + step * 3, minPrice + step * 4],
      [minPrice + step * 4, maxPrice],
    ]

    setPricePresets(presets)
  }, [minPrice, maxPrice])

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
    setMinInput(values[0].toString())
    setMaxInput(values[1].toString())
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value)
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value)
  }

  const handleInputBlur = () => {
    const min = Math.max(minPrice, Number.parseInt(minInput) || minPrice)
    const max = Math.min(maxPrice, Number.parseInt(maxInput) || maxPrice)

    // Ensure min is not greater than max
    const validMin = Math.min(min, max)
    const validMax = Math.max(min, max)

    setPriceRange([validMin, validMax])
    setMinInput(validMin.toString())
    setMaxInput(validMax.toString())
  }

  const handleApplyFilter = () => {
    onPriceChange(priceRange[0], priceRange[1])
  }

  const handlePresetClick = (min: number, max: number) => {
    setPriceRange([min, max])
    setMinInput(min.toString())
    setMaxInput(max.toString())
    onPriceChange(min, max)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Price Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-6">
          <Slider
            defaultValue={[minPrice, maxPrice]}
            min={minPrice}
            max={maxPrice}
            step={1}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            className="py-4"
          />

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="min-price">Min</Label>
              <div className="flex items-center">
                <span className="mr-1">$</span>
                <Input
                  id="min-price"
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={minInput}
                  onChange={handleMinInputChange}
                  onBlur={handleInputBlur}
                  className="w-full"
                />
              </div>
            </div>
            <div className="pt-6">-</div>
            <div className="flex-1">
              <Label htmlFor="max-price">Max</Label>
              <div className="flex items-center">
                <span className="mr-1">$</span>
                <Input
                  id="max-price"
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={maxInput}
                  onChange={handleMaxInputChange}
                  onBlur={handleInputBlur}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleApplyFilter} className="w-full">
            Apply Filter
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Quick Filters</Label>
          <div className="grid grid-cols-1 gap-2">
            {pricePresets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset[0], preset[1])}
                className="justify-start"
              >
                ${preset[0]} - ${preset[1]}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(minPrice, maxPrice)}
              className="justify-start"
            >
              All Prices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

