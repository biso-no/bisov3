"use client";
import { Expense } from "@/lib/types/expense";

import { Form } from "react-hook-form";
import { useState } from 'react'
import { CalendarIcon, Receipt, Building2, BanknoteIcon as Bank, FileText, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { updateExpenseStatus } from "@/app/actions/admin";
import { useRouter } from "next/navigation"


export function AdminExpenseDetails({
  expenseData,
}: {
    expenseData: Expense;
}) {
    const router = useRouter();
  const [status, setStatus] = useState(expenseData.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate =  () => {
    setIsUpdating(true)
    try {
        expenseData.status=status
        updateExpenseStatus(expenseData.$id,{status: status})
      console.log('Status updated to:', status)
      router.push(`/admin/expenses`)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Expense Details</CardTitle>
          <div className="text-sm text-muted-foreground">
            Reference ID: {expenseData.$id}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'pending' | 'submitted') => setStatus(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>

          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Campus</span>
              </div>
              <div className="font-medium">{expenseData.campus}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Department</span>
              </div>
              <div className="font-medium">{expenseData.department}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bank className="h-4 w-4" />
                <span>Bank Account</span>
              </div>
              <div className="font-medium">{expenseData.bank_account}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="h-4 w-4" />
                <span>Invoice ID</span>
              </div>
              <div className="font-medium">#{expenseData.invoice_id}</div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid gap-6 md:grid-cols-2 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <div className="text-2xl font-bold">
                ${expenseData.total}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prepayment Amount</Label>
              <div className="text-2xl font-bold text-muted-foreground">
                ${expenseData.prepayment_amount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="p-4 bg-muted/30 rounded-lg">
              {expenseData.description}
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>Submitted By</span>
            </div>
            <div className="space-y-1">
              <div className="font-medium">{expenseData.userId}</div>
              <div className="text-sm text-muted-foreground">{expenseData.userId}</div>
            </div>
          </div>

          {/* Submission Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Submitted on {new Date(expenseData.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
