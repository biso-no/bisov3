"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { BankDetailsStep } from "./bank-details";
import { DepartmentDetailsStep } from "./department-details";
import { DocumentsDetailsStep } from "./document-details";
import ExpenseOverview from "./overview-details";

import { useFormContext } from "./formContext";

const formSchema = z.object({
  expenseType: z.enum(["travel", "non-travel"]),
  bankAccountNumber: z
    .string()
    .min(8, "Please enter a valid bank account number"),
  confirmBankAccountNumber: z
    .string()
    .min(8, "Please confirm your bank account number"),
  expenseDescription: z
    .string()
    .min(10, "Please provide a detailed description"),
  activity: z.string().min(5, "Please specify the activity"),
  expenseDate: z.string(),
  expenseLocation: z.string().min(2, "Please enter the expense location"),
  totalAmount: z.string().min(1, "Please enter the total amount"),
  mva: z.string().optional(),
  travelPurpose: z.string().optional(),
  travelStartDate: z.string().optional(),
  travelEndDate: z.string().optional(),
  totalKilometers: z.string().optional(),
  tollFees: z.string().optional(),
});

export function ExpenseDetails({image}) {
  const formContext = useFormContext()
  const step = formContext.step
  const nextStep = formContext.nextStep
  const prevStep = formContext.prevStep

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });



  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const renderStep = () => {
    
    switch (step) {
      case 1:
        return <BankDetailsStep />;
      case 2:
        return <DepartmentDetailsStep />;
      case 3:
        return <DocumentsDetailsStep />;
      case 4:
        return <ExpenseOverview image={image} />;
      default:
        return null;
    }
  };



  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Reimbursement Form</CardTitle>
        </CardHeader>
        {renderStep()}
      </Card>
    </div>
  );
}
