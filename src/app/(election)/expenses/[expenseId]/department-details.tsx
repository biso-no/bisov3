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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { departmentCampusSchema } from "./zodSchemas";
import * as z from "zod";
import { useAppContext } from "../../../contexts";
import { Campus } from "@/lib/types/campus";
import { Department } from "@/lib/types/department";
import { Building, MapPin } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./formContext";
import { Progress } from "@/components/ui/progress";

export function DepartmentDetailsStep() {
  const appContext = useAppContext();
  const departments = appContext.departments;
  const campuses = appContext.campuses;

  const formContext = useFormContext();
  const step = formContext.step;
  const nextStep = formContext.nextStep;
  const updateFormData = formContext.updateFormData;
  const prevStep = formContext.prevStep;
  const formData = formContext.formData;

  const form = useForm({
    resolver: zodResolver(departmentCampusSchema),
    defaultValues: {
      department: formData.department,
      campus: formData.campus,
    },
  });

  const onSubmit = (values: z.infer<typeof departmentCampusSchema>) => {
    updateFormData(values);
    nextStep()
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent>
          <Progress value={step * 25} className="w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full pl-10">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Departments</SelectLabel>
                              {departments.map((department: Department) => (
                                <SelectItem
                                  key={department.Name}
                                  value={department.Name}
                                >
                                  {department.Name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
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
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full pl-10">
                            <SelectValue placeholder="Select a Campus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Campuses</SelectLabel>
                              {campuses.map((campus: Campus) => (
                                <SelectItem
                                  key={campus.name}
                                  value={campus.name}
                                >
                                  {campus.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {step < 4 && (
              <Button type="submit" className="ml-auto">
                Next
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
