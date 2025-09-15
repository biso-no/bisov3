"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  UserPlus,
  Filter,
  Download
} from "lucide-react"
import Link from "next/link"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// Dummy user data for demonstration
const dummyUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Alumni",
    graduationYear: "2018",
    status: "Active",
    joinDate: "2022-05-15"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Alumni",
    graduationYear: "2020",
    status: "Active",
    joinDate: "2022-06-03"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "mbrown@example.com",
    role: "Alumni Admin",
    graduationYear: "2015",
    status: "Active",
    joinDate: "2021-11-27"
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "e.wilson@example.com",
    role: "Alumni",
    graduationYear: "2022",
    status: "Inactive",
    joinDate: "2023-01-08"
  },
  {
    id: "5",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    role: "Alumni",
    graduationYear: "2019",
    status: "Pending",
    joinDate: "2023-04-21"
  }
]

export default function AdminUsers() {
  const [users, setUsers] = useState(dummyUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(dummyUsers)
  
  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users)
      return
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase()
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery) ||
      user.role.toLowerCase().includes(lowerCaseQuery) ||
      user.graduationYear.includes(searchQuery)
    )
    
    setFilteredUsers(filtered)
  }, [searchQuery, users])
  
  // Format date string to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
      case "Inactive":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Inactive</Badge>
      case "Pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Users</h2>
          <p className="text-gray-300 mt-1">Manage alumni network users and access</p>
        </div>
        <Button variant="gradient">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email, or year..."
            className="pl-10 bg-primary-80/40 border-secondary-100/20 text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="glass" size="sm" className="border border-secondary-100/20">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="glass" size="sm" className="border border-secondary-100/20">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card variant="glass-dark" className="border-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-secondary-100/5 opacity-20" />
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader>
              <TableRow className="border-secondary-100/10 hover:bg-white/5">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Graduation Year</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Join Date</TableHead>
                <TableHead className="text-gray-300 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} className="border-secondary-100/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">
                    <Link href={`/alumni/admin/users/${user.id}`} className="hover:underline">
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300">
                    {user.role === "Alumni Admin" ? (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Admin
                      </Badge>
                    ) : (
                      <span>{user.role}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">{user.graduationYear}</TableCell>
                  <TableCell>{renderStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-gray-300">{formatDate(user.joinDate)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-secondary-100/10" />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-secondary-100/10" />
                        {user.status === "Active" ? (
                          <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-500">Activate</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 