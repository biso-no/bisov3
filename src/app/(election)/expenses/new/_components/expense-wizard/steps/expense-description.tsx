"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, StickyNote } from "lucide-react"

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  additionalNotes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ExpenseDescriptionProps {
  onNext: () => void
  onPrevious: () => void
  data: {
    documents?: Array<{
      description: string;
      amount: number;
      date: string;
    }>;
  }
  onUpdate: (data: any) => void
}

export function ExpenseDescription({
  onNext,
  onPrevious,
  data,
  onUpdate,
}: ExpenseDescriptionProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      additionalNotes: "",
    },
  })

  // Auto-generate description from documents
  useEffect(() => {
    if (data?.documents?.length) {
      const totalAmount = data.documents.reduce((sum, doc) => sum + doc.amount, 0)
      const description = `Expense claim for ${data.documents.length} document${data.documents.length > 1 ? 's' : ''} totaling $${totalAmount.toFixed(2)}`
      form.setValue('description', description)
    }
  }, [data, form])

  const onSubmit = (values: FormValues) => {
    onUpdate(values)
    onNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
            <CardDescription>
              Review and finalize your expense description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Description
                    </FormLabel>
                    <FormDescription>
                      A clear description of your expense claim
                    </FormDescription>
                    <FormControl>
                      <Input {...field} className="font-medium" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-blue-500" />
                      Additional Notes
                    </FormLabel>
                    <FormDescription>
                      Any additional information or context for this expense claim
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any additional notes or context here..."
                        className="min-h-[100px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8"
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  )
} 