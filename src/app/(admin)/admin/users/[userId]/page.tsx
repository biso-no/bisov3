"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser, updateUser } from '@/lib/admin/db'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Models } from 'appwrite'
import { User, convertDocumentToUser } from '@/lib/admin/db';

/*
type User = {
  id: string
  username: string
  email: string
  name: string
  isActive: boolean
  campus: string
  roles: string[]
}

type AppwriteUser = Models.Document & {
  username: string
  email: string
  name: string
  isActive: boolean
  campus: string
  roles: string[]
}

function convertToUser(appwriteUser: AppwriteUser): User {
  return {
    id: appwriteUser.$id,
    username: appwriteUser.username,
    email: appwriteUser.email,
    name: appwriteUser.name,
    isActive: appwriteUser.isActive,
    campus: appwriteUser.campus_id,
    roles: appwriteUser.roles
  }
}
*/
export default function UserDetails({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(params.userId)
        setUser(await convertDocumentToUser(userData))
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [params.userId])

  const handleEditUser = async () => {
    if (!user) return

    //if (isEditing) {
      try {
        await updateUser(user.id, user)
        router.push(`/admin/users/`)
        //setIsEditing(false)
      } catch (error) {
        console.error("Error updating user:", error)
      }
    //} else {
      //setIsEditing(true)
    //}
  }


  const handleRoleChange = (role: string) => {
    if (!user) return

    const newRoles = user.roles.includes(role)
      ? user.roles.filter((r) => r !== role)
      : [...user.roles, role]

    setUser({ ...user, roles: newRoles })
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">

      <Card>
        <CardHeader>
          <CardTitle>User Details & Management</CardTitle>
          <CardDescription>View and edit user information, manage roles, and perform account actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                onChange={(e) => setUser({ ...user, email: e.target.value })}
               
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                
              />
            </div>
            <div>
              <Label htmlFor="account-status">Account Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="account-status"
                  checked={user.isActive}
                  onCheckedChange={(checked) => setUser({ ...user, isActive: checked })}
                  
                />
                <Label htmlFor="account-status">{user.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>
            <div>
            <Label htmlFor="campus">Campus</Label>
            <Select  value={user.campus} onValueChange={(e) => setUser({ ...user, campus: e })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={user.campus}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label>Roles</Label>
            <div className="grid grid-cols-3 gap-2">
              {["User", "HR", "PR", "KK", "Finance", "Admin"].map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={role}
                    checked={user.roles.includes(role)}
                    onCheckedChange={() => handleRoleChange(role)}
                    
                  />
                  <label
                    htmlFor={role}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => console.log("Reset Password")}>Reset Password</Button>
            <Button onClick={handleEditUser}>Edit User</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}