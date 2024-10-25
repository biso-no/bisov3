"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { campusMap } from "@/lib/utils"
import { getPost, updatePost } from "@/app/actions/admin"
import { Post,Campus, Department } from "@/lib/types/post"

const getUniqueDepartments = (posts: Post[]): Department[] => {
    const uniqueMap = new Map<string, Department>();
  
    posts.forEach((post) => {
      const department = post.department;
  
      // Check if the department has a valid 'id' and add to the map if it's not already present
      console.log(post)
      if (department &&department.Name && !uniqueMap.has(department.Name)) {
        uniqueMap.set(department.Name, department);
      }

    });
  
    return Array.from(uniqueMap.values());
  };

  const getUniqueCampuses = (posts: Post[]): Campus[] => {
    const uniqueMap = new Map<string, Campus>();
  
    posts.forEach((post) => {
      const campus = post.campus;
  
      // Check if the department has a valid 'id' and add to the map if it's not already present
      if (campus.name && !uniqueMap.has(campus.name)) {
        uniqueMap.set(campus.name, campus);
      }
    });
  
    return Array.from(uniqueMap.values());
  };
  


export function PostDetails({ params }: { params:{post: Post, posts : Post[]} }) {
    //console.log(params.post, params.posts)
    const router = useRouter();

    const [title, setTitle] =useState(params.post.title)
    const [content, setContent] =useState(params.post.content)
    const [formData, setFormData] = useState({
        title:params.post.title,
        content:params.post.content,
        department:params.post.department,
        campus:params.post.campus,
        status:params.post.status,
    })
    const [department, setDepartment] =useState("")

    const [uniqueCampuses, setUniqueCampuses] = useState<Campus[]>([]);
    const [uniqueDepartments, setUniqueDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const uniqueDepartments = getUniqueDepartments(params.posts);
        const uniqueCampuses = getUniqueCampuses(params.posts);
        setUniqueCampuses(uniqueCampuses);
        setUniqueDepartments(uniqueDepartments);
      }, [params.posts]);

      const handleChange = (eOrField) => {
        if (typeof eOrField === 'string') {
            // This is for the Select components
            return (value) => {
                setFormData({
                    ...formData,
                    [eOrField]: value
                });
            };
        } else {
            // This is for the Input fields
            const { name, value } = eOrField.target;
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updatePost(params.post.$id, {
            title:formData.title,
            content:formData.content,
            department:formData.department,
            campus:formData.campus,
            status: formData.status
        })
        router.refresh()
        // Here you would typically send the updated data to your API
    
      }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}

                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}

                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}

                />
              </div>
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department.$id} onValueChange={handleChange("department")} name="department">
          <SelectTrigger className="w-[180px]" >
            <SelectValue placeholder={formData.department.$id} />
          </SelectTrigger>
          <SelectContent>
          {uniqueDepartments.map((dep: Department) => (
            <SelectItem value={dep.$id}>{dep.$id}</SelectItem>
          ))}

          </SelectContent>
        </Select>
        <Label htmlFor="campus">Campus</Label>
        <Select value={formData.campus.$id} onValueChange={handleChange("campus")} name="campus">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={formData.campus.$id} />
          </SelectTrigger>
          <SelectContent>
          {uniqueCampuses.map((camp: Campus) => (
            <SelectItem value={camp.$id}>{camp.$id}</SelectItem>
          ))}

          </SelectContent>
        </Select>

              
            </div>
            <Button type="submit">Edit Post</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">

        
        </CardFooter>
      </Card>
    </div>

  )
  
}