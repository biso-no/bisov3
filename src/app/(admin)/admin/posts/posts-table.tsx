"use client"
import {Post, Campus, Department } from "@/lib/types/post"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'
import { format } from 'date-fns'
import { useState,useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { ChevronLeft, ChevronRight, Search, Grid, List } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

      
      const getUniqueDepartments = (posts: Post[]): Department[] => {
        const uniqueMap = new Map<string, Department>();
      
        posts.forEach((post) => {
          const department = post.department;
      
          // Check if the department has a valid 'id' and add to the map if it's not already present
          if (department.Name && !uniqueMap.has(department.Name)) {
            uniqueMap.set(department.Name, department);
          }
        });
      
        return Array.from(uniqueMap.values());
      };
      

export function PostTable({posts}:{posts:Post[]}){
    const [uniqueCampuses, setUniqueCampuses] = useState<Campus[]>([]);
    const [uniqueDepartments, setUniqueDepartments] = useState<Department[]>([]);
    const [page, setPage] = useState(1)
    const [viewType, setViewType] = useState<'list' | 'grid'>('list')

    //search filters
    const [search, setSearch] = useState('')
    const [department, setDepartment] = useState('')
    const [campus, setCampus] = useState('')


  // Extract unique campuses and departments when the component loads
  useEffect(() => {
    const uniqueDepts = getUniqueDepartments(posts);
    setUniqueDepartments(uniqueDepts);
  }, [posts]);


    const filteredPosts = useMemo(() => {
        return posts.filter(post => 
          post.title.toLowerCase().includes(search.toLowerCase()) 
          //&&
          //(department === '' || post.department === department) &&
          //(campus === '' || post.campus === campus)
        )
      }, [search /*, department, campus*/])
    
    //pagination
    const paginatedPosts = useMemo(() => {
        const startIndex = (page - 1) * 3
        return filteredPosts.slice(startIndex, startIndex + 3)
      }, [filteredPosts, page])
    const totalPages = Math.ceil(filteredPosts.length / 3)

    //for the form for filter and view electin
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1) // Reset to first page when searching
      }

    //list view gried view
    const toggleViewType = () => {
        setViewType(viewType === 'list' ? 'grid' : 'list')
      }
    

    return( <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">View Posts</h1>
      <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">View Posts</h1>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-5">
      <Input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {uniqueDepartments.map((dep: Department) => (
            <SelectItem value={dep.Name}>{dep.Name}</SelectItem>
          ))}

          </SelectContent>
        </Select>

        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>

        <Button type="button" onClick={toggleViewType} variant="outline">
          {viewType === 'list' ? <Grid className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
          {viewType === 'list' ? 'Grid View' : 'List View'}
        </Button>
      </form>


      {viewType === 'list' ? 
      // list view
      (
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Campus</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPosts.map((post: Post) => (
          <TableRow key={post.id}>
            <TableCell>{post.isSticky ? '📌 ' : ''}{post.title}</TableCell>
            <TableCell>{post.department?.Name}</TableCell>
            <TableCell>{post.campus?.name}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                post.status === 'published' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {post.status}
              </span>
            </TableCell>
            <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                View/Edit
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      ) : 
      //grid view
      (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedPosts.map((post: Post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.isSticky ? '📌 ' : ''}{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image src={post.image} width = {300} height = {400}  alt = "post image"/>
                <p><strong>Department:</strong> {post.department.Name}</p>
                <p><strong>Campus:</strong> {post.campus.name}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </p>
                <p><strong>Created At:</strong> {format(new Date(post.created_at), 'MMM d, yyyy')}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                  View/Edit
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}




      {/*Pagination*/}
      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => setPage(old => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          onClick={() => setPage(old => (old < totalPages ? old + 1 : old))}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
    </div>
)
}