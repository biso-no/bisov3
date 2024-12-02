"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Calendar, CreditCard, DollarSign, FileText, MapPin } from 'lucide-react';

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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Expense Overview Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center text-2xl">
            <FileText className="mr-2" />
            Expense Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<CreditCard />} label="Bank Account" value={expenseOverview.bankAccount || "N/A"} />
            <InfoItem icon={<MapPin />} label="Campus" value={expenseOverview.campus} />
            <InfoItem icon={<Building />} label="Department" value={expenseOverview.department} />
            <InfoItem icon={<FileText />} label="Description" value={expenseOverview.description || "N/A"} />
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center pt-2 text-lg font-semibold">
            <span className="flex items-center">
              <DollarSign className="mr-2" />
              Total Amount:
            </span>
            <span>{expenseOverview.totalAmount} kr</span>
          </div>
        </CardContent>
      </Card>

      {/* Expense Attachments Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center text-2xl">
            <FileText className="mr-2" />
            Expense Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {expenseAttachments.length > 0 ? (
            <div className="space-y-4">
              {expenseAttachments.map((attachment, index) => (
                <Card key={index} className="bg-secondary">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoItem icon={<DollarSign />} label="Amount" value={`${attachment.amount} kr`} />
                      <InfoItem icon={<Calendar />} label="Date" value={attachment.date} />
                      <InfoItem icon={<FileText />} label="Description" value={attachment.description} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No attachments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

