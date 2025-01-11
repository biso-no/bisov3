/*
"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { documentSchema } from "./zodSchemas";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Upload,
} from "lucide-react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./formContext";
import { Progress } from "@/components/ui/progress";


export function DocumentsDetailsStep() {



  const formContext = useFormContext();
  const step = formContext.step;
  const nextStep = formContext.nextStep;
  const updateFormData = formContext.updateFormData;
  const prevStep = formContext.prevStep;
  const formData = formContext.formData;

  const [attachments, setAttachments] = useState<{
    total: number;
    attachments: {
      amount: number;
      date: Date;
      description: string;
      image: File | null;
    }[];
  }>({
    total: formData.total,
    attachments: formData.expense_attachments,
  });

  useEffect(() => {
    updateFormData({
      expense_attachments: attachments.attachments,
      total:attachments.total,
    });
  }, [attachments]);


  const [addFormVisible, setAddFormVisible] = useState(false);

  const doc_form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      amount: 0,
      date: "",
      description: "",
      image: null,
    },
  });

  const onSubmit = (values: z.infer<typeof documentSchema>) => {
    const newAttachment = {
      amount: values.amount,
      date: new Date(values.date),
      description: values.description,
      image: values.image,
    };

    setAttachments((prev) => ({
      total: prev.total + values.amount,
      attachments: [...prev.attachments, newAttachment],
    }));

    setAddFormVisible(false);
    doc_form.reset();
  };



  const handleClick = () => {
    setAddFormVisible(!addFormVisible);
    doc_form.reset();
  };

  const deleteAttachment = (docIndex: number) => {
    setAttachments((prev) => ({
      total: prev.total - prev.attachments[docIndex].amount,
      attachments: prev.attachments.filter((_, index) => index !== docIndex),
    }));
  };
  const handleSubmit = () => {
    doc_form.reset();
    nextStep()
  };
  return (
    <div className="space-y-6">
      <CardContent>
        <Progress value={step * 25} className="w-full mb-6" />
        <Card>
          <CardHeader>
            <CardTitle>Documents Summary</CardTitle>
            <CardDescription>
              Total amount: {attachments.total.toFixed(2)} NOK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p>{attachments.attachments.length} document(s) attached</p>
              {!addFormVisible && (
                <Button onClick={handleClick} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {attachments.attachments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Attached Documents</h2>
            {attachments.attachments.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{doc.description}</span>
                    <span className="text-lg font-normal">
                      {doc.amount.toFixed(2)} NOK
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{format(new Date(doc.date), "MMMM d, yyyy")}</span>
                  </div>
                  {doc.image && (
                    <div className="flex items-center space-x-4 mt-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span>{doc.image.name}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => deleteAttachment(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {addFormVisible && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...doc_form}>
                <form
                  onSubmit={doc_form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={doc_form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (NOK)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={doc_form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="date"
                              placeholder="Enter date"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={doc_form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={doc_form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="file"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0] || null)
                              }
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClick}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {attachments.attachments.length === 0 && !addFormVisible && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-500 mb-4">No documents added yet</p>
              <Button onClick={handleClick} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Document
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {step < 4 && (
          <Button type="button" className="ml-auto" onClick={() => handleSubmit()}
>
            Next
          </Button>
        )}
      </CardFooter>
    </div>
  );
}
*/

"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { documentSchema } from "./zodSchemas";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Upload,
} from "lucide-react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./formContext";
import { Progress } from "@/components/ui/progress";

export function DocumentsDetailsStep({expenseId}) {
  const formContext = useFormContext();
  const step = formContext.step;
  const nextStep = formContext.nextStep;
  const updateFormData = formContext.updateFormData;
  const prevStep = formContext.prevStep;
  const formData = formContext.formData;

  const [attachments, setAttachments] = useState<{
    total: number;
    attachments: {
      amount: number;
      date: Date;
      description: string;
      image: File | null;
      url: string
      id: string
    }[];
  }>({
    total: formData.total,
    attachments: formData.expense_attachments,
  });

  useEffect(() => {
    updateFormData({
      expense_attachments: attachments.attachments,
      total: attachments.total,
    });
  }, [attachments]);

  const [addFormVisible, setAddFormVisible] = useState(false);

  const doc_form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      amount: 0,
      date: "",
      description: "",
      image: null,
      url:"",
      id:""
    },
  });

  const onSubmit = (values: z.infer<typeof documentSchema>) => {
    const newAttachment = {
      amount: values.amount,
      date: new Date(values.date),
      description: values.description,
      image: values.image,
      url:values.url,
      id:values.id
    };

    setAttachments((prev) => ({
      total: prev.total + values.amount,
      attachments: [...prev.attachments, newAttachment],
    }));

    setAddFormVisible(false);
    doc_form.reset();
  };

  const handleClick = () => {
    setAddFormVisible(!addFormVisible);
    doc_form.reset();
  };

  const deleteAttachment = (docIndex: number) => {
    setAttachments((prev) => ({
      total: prev.total - prev.attachments[docIndex].amount,
      attachments: prev.attachments.filter((_, index) => index !== docIndex),
    }));
  };

  const handleSubmit = () => {
    doc_form.reset();
    nextStep();
  };

  return (
    <div className="space-y-6">
      <CardContent>
        <Progress value={step * 25} className="w-full mb-6" />
        <Card>
          <CardHeader>
            <CardTitle>Documents Summary</CardTitle>
            <CardDescription>
              Total amount: {attachments.total.toFixed(2)} NOK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p>{attachments.attachments.length} document(s) attached</p>
              {!addFormVisible && (
                <Button onClick={handleClick} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {attachments.attachments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Attached Documents</h2>
            {attachments.attachments.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{doc.description}</span>
                    <span className="text-lg font-normal">
                      {doc.amount.toFixed(2)} NOK
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{format(new Date(doc.date), "MMMM d, yyyy")}</span>
                  </div>
                  {expenseId=="new" && doc.image && (
                    <div className="flex items-center space-x-4 mt-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span>{doc.image.name}</span>
                      <a
                        href={URL.createObjectURL(doc.image)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}

                  {expenseId!="new" && (
                    <div className="flex items-center space-x-4 mt-2">

                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => deleteAttachment(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {addFormVisible && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...doc_form}>
                <form
                  onSubmit={doc_form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={doc_form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (NOK)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={doc_form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="date"
                              placeholder="Enter date"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={doc_form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={doc_form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="file"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0] || null)
                              }
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClick}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {attachments.attachments.length === 0 && !addFormVisible && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-500 mb-4">No documents added yet</p>
              <Button onClick={handleClick} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Document
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {step < 4 && (
          <Button
            type="button"
            className="ml-auto"
            onClick={() => handleSubmit()}
          >
            Next
          </Button>
        )}
      </CardFooter>
    </div>
  );
}
