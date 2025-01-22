"use client"
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
import { Building, CheckCircle, ChevronLeft, ChevronRight, CreditCard, FileText, Receipt, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation"; // Import useRouter

import { BankDetailsStep } from "./bank-details";
import { DepartmentSelectionStep } from "./department-details";
import { DocumentUploadStep } from "./document-details";
import ExpenseOverview from "./overview-details";
import { getExpense } from "@/app/actions/admin";
import { useFormContext } from "./formContext";
import { motion, AnimatePresence } from "motion/react";
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            initial={false}
            animate={{
              scale: currentStep === index + 1 ? 1.2 : 1,
              backgroundColor: currentStep >= index + 1 ? "rgb(37 99 235)" : "rgb(229 231 235)",
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
          >
            {currentStep > index + 1 ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className="w-full mx-4">
              <div className="h-1 bg-gray-200 rounded">
                <motion.div
                  initial={false}
                  animate={{
                    width: currentStep > index + 1 ? "100%" : "0%",
                  }}
                  className="h-full bg-blue-600 rounded"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const stepTitles = [
  { title: "Bank Details", icon: CreditCard },
  { title: "Department Info", icon: Building },
  { title: "Documents", icon: FileText },
  { title: "Overview", icon: CheckCircle }
];

export function ExpenseDetails({ expenseId }) {
  const router = useRouter();
  const formContext = useFormContext();
  const { step } = formContext;
  const [pageDirection, setPageDirection] = useState(0);

  const handleClose = () => {
    try {
      router.push('/expenses');
    } catch (error) {
      console.error("Error returning to page:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BankDetailsStep />;
      case 2:
        return <DepartmentSelectionStep />;
      case 3:
        return <DocumentUploadStep />;
      case 4:
        return <ExpenseOverview expenseId={expenseId} />;
      default:
        return null;
    }
  };

  const StepIcon = stepTitles[step - 1]?.icon || Receipt;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="border border-gray-200 shadow-lg bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepIcon className="w-6 h-6 text-blue-600" />
                </motion.div>
                <CardTitle className="text-xl font-semibold">
                  {stepTitles[step - 1]?.title || "Reimbursement Form"}
                </CardTitle>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <StepIndicator currentStep={step} totalSteps={4} />
            
            <AnimatePresence mode="wait" custom={pageDirection}>
              <motion.div
                key={step}
                custom={pageDirection}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}