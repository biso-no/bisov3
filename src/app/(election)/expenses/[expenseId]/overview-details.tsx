"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ExpenseOverview() {
  const expenseOverview = {
    bankAccount: "",
    campus: "Bergen",
    department: "Ledelsen Bergen",
    description: "",
    totalAmount: 200,
  };

  const expenseAttachments = [
    {
      amount: 200,
      date: "29.11.2024",
      description: "test",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Expense Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 bg-blue-50 p-4 rounded-md">
          <div className="flex justify-between">
            <span>Bank Account:</span>
            <span>{expenseOverview.bankAccount || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Campus:</span>
            <span>{expenseOverview.campus}</span>
          </div>
          <div className="flex justify-between">
            <span>Department:</span>
            <span>{expenseOverview.department}</span>
          </div>
          <div className="flex justify-between">
            <span>Description:</span>
            <span>{expenseOverview.description || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span>{expenseOverview.totalAmount} kr</span>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Expense Attachments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Attachments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 bg-blue-50 p-4 rounded-md">
          {expenseAttachments.map((attachment, index) => (
            <div
              key={index}
              className="p-2 border border-gray-200 rounded-md space-y-2"
            >
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{attachment.amount} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{attachment.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Description:</span>
                <span>{attachment.description}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
