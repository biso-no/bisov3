"use client"

import Image from "next/image"
import { Upload } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProductImagesProps {
  images: string[]
}

export default function ImageUploadCard({ images = ["/placeholder.svg"] }: ProductImagesProps) {
  const mainImage = images[0]
  const thumbnails = images.slice(1)

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload and manage your product images
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Image
            alt="Main product image"
            className="aspect-square w-full rounded-md object-cover"
            height="300"
            src={mainImage}
            width="300"
          />
          <div className="grid grid-cols-3 gap-2">
            {thumbnails.map((img, index) => (
              <button key={index}>
                <Image
                  alt={`Product image ${index + 2}`}
                  className="aspect-square w-full rounded-md object-cover"
                  height="84"
                  src={img}
                  width="84"
                />
              </button>
            ))}
            {Array(Math.max(0, 2 - thumbnails.length)).fill(null).map((_, index) => (
              <button key={`empty-${index}`} className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Upload</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}