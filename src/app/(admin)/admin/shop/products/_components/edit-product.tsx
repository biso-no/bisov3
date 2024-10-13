'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"
import { useParams, useRouter } from 'next/navigation'
import {
  ChevronLeft,
  PlusCircle,
  Trash,
  Upload,
  X,
} from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createProduct, updateProduct, uploadImage, getCampuses, getDepartments } from '@/app/actions/products'
import Link from 'next/link'
import { Models } from 'node-appwrite'
import { sanitizePath } from '@/lib/utils/sanitizePath'
import ImageUploadCard from './image-upload-card'

export enum ProductStatus {
  draft = 'draft',
  inStock = 'in-stock',
  outOfStock = 'out-of-stock',
  archived = 'archived'
}

interface Product extends Models.Document {
  name: string
  slug: string
  url: string
  type: string
  status: string
  featured: boolean
  description: string
  price: number
  sale_price: number
  manage_stock: boolean
  stock_status: string
  sold_individually: boolean
  tags: string[]
  on_sale: boolean
  campus_id: string
  department_id: string
  images: string[]
}

export function EditProduct() {
  const router = useRouter()
  const { id } = useParams()
  const idStr = id as string
  const isNewProduct = id === 'new'

  const [product, setProduct] = useState({
    name: '',
    slug: '',
    url: '',
    type: '',
    status: '',
    featured: false,
    description: '',
    price: 0,
    sale_price: 0,
    manage_stock: false,
    stock_status: '',
    sold_individually: false,
    tags: [],
    on_sale: false,
    campus_id: '',
    department_id: '',
    images: [],
  })

  const [campuses, setCampuses] = useState([])
  const [departments, setDepartments] = useState([])
  const [variations, setVariations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const campusesData = await getCampuses()
      const departmentsData = await getDepartments()
      setCampuses(campusesData)
      setDepartments(departmentsData)

      if (!isNewProduct) {
        // Fetch product data from Appwrite here
        // For now, we'll use dummy data
        setProduct({
          name: 'Sample Product',
          slug: 'sample-product',
          url: 'https://example.com/sample-product',
          type: 'physical',
          status: 'published',
          featured: true,
          description: 'This is a sample product description.',
          price: 99.99,
          sale_price: 79.99,
          manage_stock: true,
          stock_status: 'in_stock',
          sold_individually: false,
          tags: ['sample', 'product'],
          on_sale: true,
          campus_id: 'campus1',
          department_id: 'dept1',
          images: ['/placeholder.svg'],
        })
        setVariations([
          { sku: 'SAMPLE-001', stock: 100, price: 99.99, size: 'S' },
          { sku: 'SAMPLE-002', stock: 50, price: 99.99, size: 'M' },
          { sku: 'SAMPLE-003', stock: 25, price: 99.99, size: 'L' },
        ])
      }
    }

    fetchData()
  }, [isNewProduct])

  useEffect(() => {
    async function fetchDepartments() {
      const departmentsData = await getDepartments(product.campus_id)
      setDepartments(departmentsData)
    }

    if (product.campus_id) {
      fetchDepartments()
    }
  }, [product.campus_id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = await uploadImage(file)
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
    }
  }

  const handleRemoveImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddVariation = () => {
    setVariations(prev => [...prev, { sku: '', stock: 0, price: 0, size: '' }])
  }

  const handleRemoveVariation = (index) => {
    setVariations(prev => prev.filter((_, i) => i !== index))
  }

  const handleVariationChange = (index, field, value) => {
    setVariations(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('variations', JSON.stringify(variations))
    
    if (isNewProduct) {
      await createProduct(formData)
    } else {
      await updateProduct(idStr, formData)
    }
    
    router.push('/products')
  }




  return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">{isNewProduct ? 'New Product' : product.name}</h1>

              <Badge variant="outline" className="ml-auto sm:ml-0">
                {product.status}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" onClick={() => router.push('/products')}>
                  Discard
                </Button>
                <Button size="sm" onClick={handleSubmit}>Save Product</Button>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Details</CardTitle>
                      <CardDescription>
                        Enter the basic information about the product
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            className="w-full"
                            value={product.name}
                            onChange={handleInputChange}
                            required
                          />
                          <p className="text-sm text-muted-foreground">
                            Path will be <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${sanitizePath(product.name)}`}>{`products/${sanitizePath(product.name)}`}</Link>
                          </p>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            className="min-h-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Variations</CardTitle>
                      <CardDescription>
                        Manage product variations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">SKU</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="w-[100px]">Size</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variations.map((variation, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  type="text"
                                  value={variation.sku}
                                  onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={variation.stock}
                                  onChange={(e) => handleVariationChange(index, 'stock', parseInt(e.target.value))}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={variation.price}
                                  onChange={(e) => handleVariationChange(index, 'price', parseFloat(e.target.value))}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="text"
                                  value={variation.size}
                                  onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRemoveVariation(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="justify-center border-t p-4">
                      <Button size="sm" variant="ghost" className="gap-1" onClick={handleAddVariation}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Variation
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <Select name="status" value={product.status} onValueChange={(value) => handleInputChange({ target: { name: 'status', value } })}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="campus_id">Campus</Label>
                          <Select name="campus_id" value={product.campus_id} onValueChange={(value) => handleInputChange({ target: { name: 'campus_id', value } })}>
                            <SelectTrigger id="campus_id">
                              <SelectValue placeholder="Select campus" />
                            </SelectTrigger>
                            <SelectContent>
                              {campuses.map((campus) => (
                                <SelectItem key={campus.$id} value={campus.$id}>{campus.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {product.campus_id && (
                        <div className="grid gap-3">
                          <Label htmlFor="department_id">Department</Label>
                          <Select name="department_id" value={product.department_id} onValueChange={(value) => handleInputChange({ target: { name: 'department_id', value } })}>
                            <SelectTrigger id="department_id">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((department) => (
                                <SelectItem key={department.$id} value={department.$id}>{department.Name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            name="featured"
                            checked={product.featured}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'featured', type: 'checkbox', checked } })}
                          />
                          <Label htmlFor="featured">Featured</Label> <p className="text-sm text-muted-foreground">Featured products are displayed on the homepage.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="manage_stock"
                            name="manage_stock"
                            checked={product.manage_stock}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'manage_stock', type: 'checkbox', checked } })}
                          />
                          <Label htmlFor="manage_stock">Manage Stock</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sold_individually"
                            name="sold_individually"
                            checked={product.sold_individually}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'sold_individually', type: 'checkbox', checked } })}
                          />
                          <Label htmlFor="sold_individually">Sold Individually</Label> <p className="text-sm text-muted-foreground">Allow customers to purchace only one of this product.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="on_sale"
                            name="on_sale"
                            checked={product.on_sale}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'on_sale', type: 'checkbox', checked } })}
                          />
                          <Label htmlFor="on_sale">On Sale</Label>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sale_price">Sale Price</Label>
                          <Input
                            id="sale_price"
                            name="sale_price"
                            type="number"
                            step="0.01"
                            value={product.sale_price}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            name="tags"
                            type="text"
                            value={product.tags.join(', ')}
                            onChange={(e) => handleInputChange({ target: { name: 'tags', value: e.target.value.split(',').map(tag => tag.trim()) } })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <ImageUploadCard images={product.images} />
                </div>
              </div>
            </form>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm" onClick={() => router.push('/products')}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSubmit}>Save Product</Button>
            </div>
        </main>
  )
}

