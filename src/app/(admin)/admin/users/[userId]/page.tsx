import { UserDetails } from "./user-update";
import { getUser, updateUser } from "@/app/actions/admin";

export default async function AdminUsersPage({ params }: { params: { userId: string } }) {
  const user = await getUser(params.userId)
  return (
    <UserDetails initialUser={user} updateUser={updateUser}/>
  )
}