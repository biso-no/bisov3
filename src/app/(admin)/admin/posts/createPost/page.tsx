import { CreatePost } from "./createPost";
import { getPost, getPosts } from "@/app/actions/admin";



export default async function AdminCreatePost() {

  const posts = await getPosts()


  return (
    <CreatePost params={{posts:posts}} />
  )
}