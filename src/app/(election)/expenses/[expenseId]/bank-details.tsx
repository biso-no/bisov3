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

export function BankDetailsStep() {
  //const { data, setFormData } = useFormContext()

  const [isVisible, setIsVisible] = useState(false);

  const appContext = useAppContext();
  const departments = appContext.departments;
  const campuses = appContext.campuses;

  //dummy for the context
  const [data, setData] = useState({
    bankAccount: "100000",
    hasPrepayment: false,
    prepaymentAmount: null
  });

  const form = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bankAccount: data.bankAccount,
      hasPrepayment: data.hasPrepayment,
      prepaymentAmount: null,
      description:null
    },
  });

  useEffect(() => {
    if (!isVisible) {
      form.setValue("prepaymentAmount", null); // Reset prepaymentAmount to null
      console.log("Prepayment Amount field hidden and reset to null.");
    }
  }, [isVisible, form]);

  /*
  const onSubmit = (values: { bankAccount: string; hasPrepayment: boolean }) => {
    setFormData(values)
  }
*/
  const onSubmit = (values: z.infer<typeof bankDetailsSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bankAccount"
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
          name="hasPrepayment"
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
            name="prepaymentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prepayment Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Prepayment Amount" {...field} />
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


      </form>
    </Form>
  );
}
