"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUsers } from '@/lib/admin/db';
import { Models } from 'appwrite'
import { useRouter } from "next/navigation"
import { User, convertDocumentsToUsers } from '@/lib/admin/db';

export default function RegisteredUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const usersPerPage = 10
  const router = useRouter()

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers()
        const convertedUsers: User[] = await convertDocumentsToUsers(fetchedUsers)
        /*
        fetchedUsers.documents.map((doc: Models.Document) => ({
          id: doc.$id,
          name: doc.name,
          email: doc.email,
          roles: doc.roles || [],
          isActive: doc.isActive,
          campus: doc.campus_id
        }))
        */
        setUsers(convertedUsers)
        setFilteredUsers(convertedUsers)
        setTotalPages(Math.ceil(convertedUsers.length / usersPerPage))
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    loadUsers()
  }, [])
  
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterRole === "all" || user.roles.includes(filterRole))
    )
    setFilteredUsers(filtered)
    setTotalPages(Math.ceil(filtered.length / usersPerPage))
    setCurrentPage(1)
  }, [searchTerm, filterRole, users, usersPerPage])
  
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const handleRowClick = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="PR">PR</SelectItem>
            <SelectItem value="KK">KK</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Campus </TableHead>
            <TableHead>Active </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow 
            key={user.id} 
            onClick={() => handleRowClick(user.id)}
            className="cursor-pointer hover:bg-gray-100"
          >
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles.join(", ")}</TableCell>
              <TableCell>{user.campus}</TableCell>
              <TableCell>{user.isActive? "Active":"Inactive"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => paginate(currentPage - 1)}
              //disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => paginate(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => paginate(currentPage + 1)}
              //disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}