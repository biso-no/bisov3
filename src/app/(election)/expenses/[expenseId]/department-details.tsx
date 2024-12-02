"use client";

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
import { departmentCampusSchema } from "./zodSchemas";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../contexts";
import { Campus } from "@/lib/types/campus";
import { Department } from "@/lib/types/department";

export function DepartmentDetailsStep() {
  //const { data, setFormData } = useFormContext()

  const appContext = useAppContext();
  const departments = appContext.departments;
  const campuses = appContext.campuses;

  const form = useForm({
    resolver: zodResolver(departmentCampusSchema),
    defaultValues: {
      department: null,
      campus: null,
    },
  });

  /*
  const onSubmit = (values: { bankAccount: string; hasPrepayment: boolean }) => {
    setFormData(values)
  }
*/
  const onSubmit = (values: z.infer<typeof departmentCampusSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      {departments.map((department:Department) => (
                        <SelectItem key={department.Name} value={department.Name}>
                          {department.Name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
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
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder="Select a Campus"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      {campuses.map((campus:Campus) => (
                        <SelectItem key={campus.name} value={campus.name}>
                          {campus.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
