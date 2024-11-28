'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ExpenseType } from './expense-type'
import { BankDetails } from './bank-details'
import { ExpenseInfo } from './expense-info'
import { TravelExpense } from './travel-expense'
import { NonTravelExpense } from './non-travel-expense'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"

const formSchema = z.object({
  expenseType: z.enum(["travel", "non-travel"]),
  bankAccountNumber: z.string().min(8, "Please enter a valid bank account number"),
  confirmBankAccountNumber: z.string().min(8, "Please confirm your bank account number"),
  expenseDescription: z.string().min(10, "Please provide a detailed description"),
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
})

export function ExpenseDetails() {
  const [step, setStep] = useState(1)
  const [formType, setFormType] = useState<'travel' | 'non-travel' | null>(null)


  const [step1, setStep1] =useState({
    expenseType: null
  })

  const validateStep1 = (data) => {
    if (!data.expenseType) return "Name is required.";
    return null;
  };

  const [step2, setStep2] =useState({
    bankAccountNumber: null,
    confirmBankAccountNumber: null,
  })

  const [step3, setStep3] =useState({
    expenseDescription: null,
    activity: null,
    expenseDate: null,
    expenseLocation: null,
  })

  const [step4_travel, setStep4_travel] =useState({
    totalAmount: null,
    mva: null,
  })
  const [step4_non_travel, setStep4_non_travel] =useState({
    totalAmount: null,
    mva: null,
    travelPurpose: null,
    travelStartDate: null,
    travelEndDate: null,
    totalKilometers: null,
    tollFees: null,
  })

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ExpenseType setFormType={setFormType} />
      case 2:
        return <BankDetails />
      case 3:
        return <ExpenseInfo />
      case 4:
        return formType === 'travel' ? <TravelExpense /> : <NonTravelExpense />
      default:
        return null
    }
  }

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Reimbursement Form</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <Progress value={step * 25} className="w-full mb-6" />
              {renderStep()}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Submit
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

