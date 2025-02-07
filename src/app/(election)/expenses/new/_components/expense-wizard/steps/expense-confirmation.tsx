"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import {
  FileText,
  CreditCard,
  File,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"

interface ExpenseConfirmationProps {
  onPrevious: () => void
  data: {
    contact?: {
      name: string;
      email: string;
      phone: string;
      bank_account: string;
      swift?: string;
      isInternational: boolean;
    };
    documents?: Array<{
      fileId: string;
      fileName: string;
      date: string;
      amount: number;
      description: string;
    }>;
    description?: {
      description: string;
      additionalNotes?: string;
    };
  }
}

export function ExpenseConfirmation({
  onPrevious,
  data,
}: ExpenseConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const { toast } = useToast()

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('nb-NO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const totalAmount = data.documents?.reduce((sum, doc) => sum + doc.amount, 0) || 0

  const handleSubmit = async () => {
    if (!hasAgreed) {
      toast({
        title: "Agreement Required",
        description: "Please confirm that all information is correct before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Here you would submit the expense claim
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
      toast({
        title: "Success",
        description: "Your expense claim has been submitted successfully.",
      })
      // Redirect to success page or expense list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit expense claim. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Expense Claim</CardTitle>
          <CardDescription>
            Please review all information before submitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Bank Details</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{data.contact?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{data.contact?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{data.contact?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Account</p>
                <p className="font-medium font-mono">{data.contact?.bank_account}</p>
              </div>
              {data.contact?.isInternational && data.contact?.swift && (
                <div>
                  <p className="text-sm text-gray-500">SWIFT/BIC Code</p>
                  <p className="font-medium font-mono">{data.contact.swift}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.documents?.map((doc) => (
                  <TableRow key={doc.fileId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-blue-500" />
                        {doc.fileName}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(doc.date), 'PP')}</TableCell>
                    <TableCell>{formatAmount(doc.amount)} kr</TableCell>
                    <TableCell>{doc.description}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-semibold">
                    Total Amount:
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {formatAmount(totalAmount)} kr
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{data.description?.description}</p>
              </div>
              {data.description?.additionalNotes && (
                <div>
                  <p className="text-sm text-gray-500">Additional Notes</p>
                  <p className="whitespace-pre-wrap">{data.description.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreement"
          checked={hasAgreed}
          onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
        />
        <label
          htmlFor="agreement"
          className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I confirm that all information provided is correct and complete
        </label>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !hasAgreed}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Expense Claim'
          )}
        </Button>
      </div>
    </div>
  )
} 