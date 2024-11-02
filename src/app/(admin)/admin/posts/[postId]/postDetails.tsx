"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { campusMap } from "@/lib/utils";
import { getPost, updatePost } from "@/app/actions/admin";
import { Post, Campus, Department } from "@/lib/types/post";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, { useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const getUniqueDepartments = (posts: Post[]): Department[] => {
  const uniqueMap = new Map<string, Department>();

  posts.forEach((post) => {
    const department = post.department;

    // Check if the department has a valid 'id' and add to the map if it's not already present
    console.log(post);
    if (department && department.Name && !uniqueMap.has(department.Name)) {
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

export function PostDetails({
  params,
}: {
  params: { post: Post; posts: Post[] };
}) {
  //console.log(params.post, params.posts)
  const router = useRouter();

  const [title, setTitle] = useState(params.post.title);
  const [content, setContent] = useState(params.post.content);
  const [formData, setFormData] = useState({
    title: params.post.title,
    content: params.post.content,
    department: params.post.department,
    campus: params.post.campus.$id,
    status: params.post.status,
    created_at: params.post.created_at,
    updated_at: params.post.updated_at,
  });
  const [department, setDepartment] = useState("");

  const [uniqueCampuses, setUniqueCampuses] = useState<Campus[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<Department[]>([]);

  const editor = useRef(null); //declared a null value
  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
      },
    }),
    []
  );

  useEffect(() => {
    const uniqueDepartments = getUniqueDepartments(params.posts);
    const uniqueCampuses = getUniqueCampuses(params.posts);
    setUniqueCampuses(uniqueCampuses);
    setUniqueDepartments(uniqueDepartments);
  }, [params.posts]);

  const handleChange = (eOrField) => {
    if (typeof eOrField === "string") {
      // This is for the Select components
      return (value) => {
        setFormData({
          ...formData,
          [eOrField]: value,
        });
      };
    } else {
      // This is for the Input fields
      const { name, value } = eOrField.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost(params.post.$id, {
      title: formData.title,
      content: formData.content,
      created_at: formData.created_at,
      updated_at: formData.updated_at,
      department:
        typeof formData.department === "string"
          ? formData.department
          : formData.department.$id,
      campus:
        typeof formData.campus === "string"
          ? formData.campus
          : formData.campus.$id,
      status: formData.status,
    });
    router.refresh();
    // Here you would typically send the updated data to your API
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <div className="container mx-auto ">
              <div className="flex justify-between  space-x-4">
                <div className="container mx-auto ">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleChange("status")}
                    name="status"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={formData.department.Name} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">published</SelectItem>
                      <SelectItem value="unpublished">unpublished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="container mx-auto ">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department.$id}
                    onValueChange={handleChange("department")}
                    name="department"
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder={formData.department.Name} />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueDepartments.map((dep: Department) => (
                        <SelectItem value={dep.$id}>{dep.Name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="container mx-auto ">
                  <Label htmlFor="campus">Campus</Label>
                  <Select
                    value={formData.campus}
                    onValueChange={handleChange("campus")}
                    name="campus"
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder={formData.campus.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCampuses.map((camp: Campus) => (
                        <SelectItem value={camp.$id}>{camp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-between  space-x-4">
              <div className="container mx-auto">
                <div>
                  <Label htmlFor="created_at">Created At</Label>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !formData.created_at && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {formData.created_at ? (
                          format(formData.created_at, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.created_at}
                        onSelect={handleChange("created_at")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="container mx-auto">
                <div>
                  <Label htmlFor="updated_at">Updated At</Label>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !formData.created_at && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {formData.updated_at ? (
                          format(formData.updated_at, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.updated_at}
                        onSelect={handleChange("updated_at")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                <JoditEditor
                  ref={editor} //This is important
                  value={content} //This is important
                  onChange={handleChange} //handle the changes
                  className="w-full h-[70%] bg-white"
                />
                <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
              </div>

              {/*<div dangerouslySetInnerHTML={{ __html: content }}></div>*/}

              <div><Button type="submit">Edit Post</Button></div>
            </div>
            
          </CardContent>

          <CardFooter className="flex justify-between"></CardFooter>
        </Card>
      </div>
    </form>
  );
}
