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
import { createPost } from "@/app/actions/admin";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  status: z.string().min(1, {
    message: "status required",
  }),
  title: z.string().min(1, {
    message: "title required",
  }),
  content: z.string().min(1, {
    message: "content required",
  }),
  department: z.string().min(1, {
    message: "department required",
  }),
  campus: z.string().min(1, {
    message: "campus required",
  }),
  created_at: z.date({
    message: "select created date",
  }),
  updated_at: z.date({
    message: "select updated date",
  }),
});

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

export function CreatePost({ params }: { params: { posts: Post[] } }) {
  //console.log(params.post, params.posts)
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    department: "",
    campus: "",
    status: "",
    created_at: "",
    updated_at: "",
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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    createPost({
      title: values.title,
      content: values.content,
      created_at: new Date(values.created_at),
      updated_at: new Date(values.updated_at),
      department: values.department,
      campus: values.campus,
      status: values.status,
    });
    router.push("/admin/posts");
    // Here you would typically send the updated data to your API
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {}
  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <div className="container mx-auto">
                <div className="flex justify-between  space-x-4">
                  
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="published">
                                published
                              </SelectItem>
                              <SelectItem value="unpublished">
                                unpublished
                              </SelectItem>
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uniqueDepartments.map((dep: Department) => (
                              <SelectItem value={dep.$id}>
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uniqueCampuses.map((camp: Campus) => (
                              <SelectItem value={camp.$id}>
                                {camp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between  space-x-4 py-5">
                  <div className="container mx-auto">
                    <FormField
                      control={form.control}
                      name="created_at"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Created At</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="container mx-auto">
                    <FormField
                      control={form.control}
                      name="updated_at"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Updated At</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Title</FormLabel>
                      <Input value={field.value} onChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Content</FormLabel>
                      <JoditEditor
                        ref={editor} //This is important
                        value={field.value} //This is important
                        onChange={field.onChange} //handle the changes
                        className="w-full h-[70%] bg-white"
                      />
                      <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
