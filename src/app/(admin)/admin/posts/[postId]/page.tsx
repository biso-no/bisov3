import { PostDetails } from "./postDetails";
import { getPost, getPosts } from "@/app/actions/admin";



export default async function AdminPostDetails({ params }: { params: { postId: string } }) {
  const post = await getPost(params.postId)
  const posts = await getPosts()


  return (
    <PostDetails params={{post:post,posts:posts}} />
  )
}