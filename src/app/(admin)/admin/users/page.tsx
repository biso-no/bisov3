"use client"
import { UserTable } from "./user-table";
import { getUsers } from "@/app/actions/admin";

export default async function AdminUsersPage() {
  const users = await getUsers()
  return (
    <UserTable initialUsers={users} />
  )
}