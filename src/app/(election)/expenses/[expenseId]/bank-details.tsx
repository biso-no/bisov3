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
import { bankDetailsSchema } from "./zodSchemas";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../contexts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormContext } from "./formContext";

export function BankDetailsStep() {
  //const { data, setFormData } = useFormContext()

  const [isVisible, setIsVisible] = useState(false);

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
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bank_account: formData.bank_account,
      has_prepayment: formData.has_prepayment,
      prepayment_amount: formData.prepayment_amount,
      description: formData.description,
    },
  });

  useEffect(() => {
    if (!isVisible) {
      form.setValue("prepayment_amount", 0); // Reset prepaymentAmount to null
      console.log("Prepayment Amount field hidden and reset to null.");
    }
  }, [isVisible, form]);

  /*
  const onSubmit = (values: { bankAccount: string; hasPrepayment: boolean }) => {
    setFormData(values)
  }
*/
  const onSubmit = (values: z.infer<typeof bankDetailsSchema>) => {
    updateFormData(values);
    nextStep()
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent>
            <Progress value={step * 25} className="w-full mb-6" />

            <FormField
              control={form.control}
              name="bank_account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account</FormLabel>
                  <FormControl>
                    <Input placeholder="Bank Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_prepayment"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Did you receive a prepayment?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value); // Update the form state
                        setIsVisible(value); // Update your local state
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isVisible && (
              <FormField
                control={form.control}
                name="prepayment_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prepayment Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Prepayment Amount" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
