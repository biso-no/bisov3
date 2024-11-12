"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { toast } from "@/lib/hooks/use-toast"

import dynamic from "next/dynamic"
import { createPost, updatePost } from "@/app/actions/admin"
import { Campus, Department } from "@/lib/types/post"

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["publish", "draft"]),
  department: z.string().min(1, "Department is required"),
  campus: z.string().min(1, "Campus is required"),
})

type FormValues = z.infer<typeof formSchema>

type Post = {
  $id?: string
  title: string
  content: string
  status: "publish" | "draft"
  department: Department
  campus: Campus
}

type PostEditorProps = {
  post?: Post
  departments: Department[]
  campuses: Campus[]
}

export default function PostEditor({ post, departments, campuses }: PostEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const getInitialValues = React.useMemo((): FormValues => {
    if (!post) {
      return {
        title: "",
        content: "",
        status: "draft" as const,
        department: "",
        campus: "",
      }
    }

    return {
      title: post.title || "",
      content: post.content || "",
      status: post.status as "publish" | "draft",
      department: post.department?.$id || "",
      campus: post.campus?.$id || "",
    }
  }, [post])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues,
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      if (post) {
        await updatePost(post.$id, values)
      } else {
        await createPost(values)
      }
      toast({
        title: "Success",
        description: post ? "Post updated successfully" : "Post created successfully",
      })
      router.push("/admin/posts")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An error occurred while saving the post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarProvider side="right">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <JoditEditor
                        value={field.value}
                        onChange={field.onChange}
                        config={{
                          height: 500,
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <Sidebar className="w-80 border-l">
          <SidebarHeader className="px-4 py-2">
            <h2 className="text-lg font-semibold">Post Settings</h2>
          </SidebarHeader>
          <SidebarContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status">
                              {field.value === 'publish' ? 'Published' : 'Draft'}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="publish">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department">
                              {departments.find(dep => dep.$id === field.value)?.Name || 'Select department'}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dep) => (
                            <SelectItem key={dep.$id} value={dep.$id}>
                              {dep.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campus">
                              {campuses.find(c => c.$id === field.value)?.name || 'Select campus'}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campuses.map((campus) => (
                            <SelectItem key={campus.$id} value={campus.$id}>
                              {campus.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {post ? "Update Post" : "Create Post"}
                </Button>
              </form>
            </Form>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}