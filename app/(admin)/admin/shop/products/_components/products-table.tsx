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

import { updateProductStatus, deleteProduct } from '@/app/actions/products'
import { Models } from "node-appwrite"
import { ProductStatus } from "./edit-product"

export function ProductsTable({ products }: { products: Models.Document[] }) {
  const handleUpdateStatus = async (productId: string, newStatus: ProductStatus) => {
    await updateProductStatus(productId, newStatus)
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
                <TableHead className="hidden md:table-cell">
                  Price
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Sales
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
              {products.map((product) => (
                <TableRow key={product.$id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.image || "/placeholder.svg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.price.toFixed(2)} kr
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.totalSales}
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
                        <DropdownMenuItem onClick={() => handleUpdateStatus(product.$id, ProductStatus.inStock)}>
                          Set Published
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(product.$id, ProductStatus.draft)}>
                          Set Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(product.$id, ProductStatus.archived)}>
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
              ))}
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