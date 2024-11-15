"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { constants } from "fs";

//schema
const formSchema = z.object({
  expenseType: z.enum(["travel", "non-travel"]),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "Please enter a valid city"),
  zipCode: z.string().min(4, "Please enter a valid postal code"),
  phoneNumber: z.string().min(8, "Please enter a valid phone number"),
  personalEmail: z.string().email("Please enter a valid email address"),
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
  expenseDate: z.date(),
  expenseLocation: z.string().min(2, "Please enter the expense location"),
  totalAmount: z.string().min(1, "Please enter the total amount"),
  mva: z.string().optional(),
  travelPurpose: z.string().optional(),
  travelStartDate: z.date().optional(),
  travelEndDate: z.date().optional(),
  totalKilometers: z.string().optional(),
  tollFees: z.string().optional(),
});

export function ExpenseDetails() {
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [formType, setformType] = useState(null);

  //form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  //on submit func
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div>
      <div>
        <Card className = "w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Reimbursement Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <Progress value={step * 25} className="w-full" />
                {step == 1 && (
                  <FormField
                    control={form.control}
                    name="expenseType"
                    render={() => (
                      <FormItem>
                        <FormLabel>Expense Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={setformType}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Expense Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Expense Type</SelectLabel>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="non-travel">
                                  Non-travel
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {step == 2 && (
                  <div>

                    <FormField
                      control={form.control}
                      name="bankAccountNumber"
                      render={() => (
                        <FormItem>
                          <FormLabel>Bank Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmBankAccountNumber"
                      render={() => (
                        <FormItem>
                          <FormLabel>Confirm Bank Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {step == 3 && (
                  <div>
                    <FormField
                      control={form.control}
                      name="expenseDescription"
                      render={() => (
                        <FormItem>
                          <FormLabel>Expense Description</FormLabel>
                          <FormControl>
                            <Input placeholder="" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="activity"
                      render={() => (
                        <FormItem>
                          <FormLabel>Activity</FormLabel>
                          <FormControl>
                            <Input placeholder="" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expenseDate"
                      render={() => (
                        <FormItem>
                          <FormLabel>Expense Date</FormLabel>
                          <FormControl>
                            <Input placeholder="" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expenseLocation"
                      render={() => (
                        <FormItem>
                          <FormLabel>Expense Location</FormLabel>
                          <FormControl>
                            <Input placeholder="" />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {step == 4 &&
                  (step == 4 && formType == "travel" ? (
                    <div>

                      <FormField
                        control={form.control}
                        name="travelPurpose"
                        render={() => (
                          <FormItem>
                            <FormLabel>Travel Purpose</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="travelStartDate"
                        render={() => (
                          <FormItem>
                            <FormLabel>Travel Start Date</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="travelEndDate"
                        render={() => (
                          <FormItem>
                            <FormLabel>Travel End Date</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="totalKilometers"
                        render={() => (
                          <FormItem>
                            <FormLabel>Total Kilometers</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tollFees"
                        render={() => (
                          <FormItem>
                            <FormLabel>Toll Fees</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                                            <FormField
                        control={form.control}
                        name="totalAmount"
                        render={() => (
                          <FormItem>
                            <FormLabel>Total Amount</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mva"
                        render={() => (
                          <FormItem>
                            <FormLabel>MVA (VAT)</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div>
                      <FormField
                        control={form.control}
                        name="totalAmount"
                        render={() => (
                          <FormItem>
                            <FormLabel>Total Amount</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mva"
                        render={() => (
                          <FormItem>
                            <FormLabel>MVA</FormLabel>
                            <FormControl>
                              <Input placeholder="" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight  className="ml-2 h-4 w-4"/>
              </Button>
            ) : (
              <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="ml-auto">
                Submit
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
