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
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { useFormContext } from "@/context/form-context"
import { documentSchema } from "./zodSchemas";
import * as z from "zod";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading3, PlusCircleIcon } from "lucide-react";

export function DocumentsDetailsStep() {
  //const { data, setFormData } = useFormContext()
  const [attachments, setAttachments] = useState<{
    total: number;
    attachments: {
      amount: number;
      date: Date;
      description: string;
      image: File | null;
    }[];
  }>({
    total: 0,
    attachments: [],
  });

  const [addFormVisible, setAddFormVisible] = useState(false);

  //amount: z.number().min(0, "Amount must be positive"),
  //date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  //description: z.string().min(1, "Description is required"),
  //image: z.any()

  const form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      amount: 0, // Ensure amount is a number
      date: "", // Default date value
      description: "",
      image: null,
    },
  });

  /*
  const onSubmit = (values: { bankAccount: string; hasPrepayment: boolean }) => {
    setFormData(values)
  }
*/
  const onSubmit = (values: z.infer<typeof documentSchema>) => {
    console.log("here");
    // Create a new ExpenseAttachment object from form values
    const newAttachment = {
      amount: values.amount,
      date: new Date(values.date), // Convert date string to a Date object
      description: values.description,
      image: values.image, // File object from the form
    };

    // Update the attachments state by appending the new attachment
    setAttachments((prev) => ({
      total: prev.total + values.amount,
      attachments: [...prev.attachments, newAttachment],
    }));

    // Hide the form and reset its fields
    setAddFormVisible(false);
    form.reset();
    return;
  };

  const handleClick = () => {
    setAddFormVisible(!addFormVisible);
    form.reset();
    return;
  };

  const deleteAttachment = (docIndex) => {
    setAttachments((prev) => ({
      total: prev.total - prev.attachments[docIndex].amount,
      attachments: prev.attachments.filter((_, index) => index !== docIndex),
    }));
  };
  return (
    <div>
      <Card>
        <CardHeader>{attachments.total} NOK</CardHeader>
        <CardContent className="grid">
            <div>
            {attachments.attachments.length} documents
            </div>
          
          {!addFormVisible && (
            <Button onClick={handleClick}>
              Add Document <PlusCircleIcon></PlusCircleIcon>
            </Button>
          )}
        </CardContent>
      </Card>
      <h1 className="text-lg font-bold">Documents</h1>
      {attachments.attachments.length ? (
        attachments.attachments.map((doc, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                NOK {doc.amount} - {doc.description}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Date:</strong> {format(new Date(doc.date), "yyyy-MM-dd")}
              </p>
              <Button onClick={()=> deleteAttachment(index)}>Delete</Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No documents added yet</p>
      )}

      {addFormVisible && (
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BAttachment</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex">
                  <Button type="submit">Submit</Button>
                  <Button onClick={handleClick}>Cancel</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
