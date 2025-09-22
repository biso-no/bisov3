'use client'

import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"

import { updateProduct, deleteProduct } from '@/app/actions/products'
import { ProductWithTranslations } from '@/lib/types/product'
import Link from 'next/link'

export function ProductsTable({ products }: { products: ProductWithTranslations[] }) {
  const handleUpdateStatus = async (productId: string, newStatus: 'draft' | 'published' | 'archived') => {
    await updateProduct(productId, { status: newStatus })
    // You might want to add some state management or refetching logic here
  }

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId)
    // You might want to add some state management or refetching logic here
  }

  return (
    <TabsContent value="all">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Translations</TableHead>
                <TableHead className="hidden md:table-cell">
                  Price
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Campus
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const hasEnglish = product.translation_refs?.some((t: any) => t.locale === 'en')
                const hasNorwegian = product.translation_refs?.some((t: any) => t.locale === 'no')
                const primaryTitle = product.translation_refs?.[0]?.title || product.slug
                const metadata = product.metadata ? JSON.parse(product.metadata) : {}
                
                return (
                  <TableRow key={product.$id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.image || metadata.image || "/placeholder.svg"}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/admin/shop/products/${product.$id}`} className="hover:underline">
                        {primaryTitle}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {hasEnglish && (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            🇬🇧 EN
                          </span>
                        )}
                        {hasNorwegian && (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            🇳🇴 NO
                          </span>
                        )}
                        {!hasEnglish && !hasNorwegian && (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            No translations
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {metadata.price ? `${metadata.price.toFixed(2)} NOK` : '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.campus?.name || product.campus_id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(product.$createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(product.$id, 'published')}>
                          Set Published
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(product.$id, 'draft')}>
                          Set Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(product.$id, 'archived')}>
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.$id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}