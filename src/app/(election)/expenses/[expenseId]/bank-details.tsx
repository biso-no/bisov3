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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bankDetailsSchema } from "./zodSchemas";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../contexts";
import { CreditCard, DollarSign, FileText } from 'lucide-react';

export function BankDetailsStep() {
  const [isVisible, setIsVisible] = useState(false);

  const appContext = useAppContext();
  const departments = appContext.departments;
  const campuses = appContext.campuses;

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
      description: null
    },
  });

  useEffect(() => {
    if (!isVisible) {
      form.setValue("prepaymentAmount", null);
    }
  }, [isVisible, form]);

  const onSubmit = (values: z.infer<typeof bankDetailsSchema>) => {
    console.log(values);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input className="pl-10" placeholder="Bank Account" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasPrepayment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Received Prepayment?</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            setIsVisible(value);
                          }}
                        />
                        <span>{field.value ? 'Yes' : 'No'}</span>
                      </div>
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
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input className="pl-10" placeholder="Prepayment Amount" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400" />
                      <Textarea 
                        placeholder="Enter description" 
                        className="pl-10 min-h-[100px]" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

