"use client"
import React, { useState } from 'react';
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Plus, Send, TrendingUp, Clock } from 'lucide-react';
import { useRouter } from "next/navigation";
import { updateExpenseStatus } from "@/app/actions/admin";
import { Expense } from "@/lib/types/expense";

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4
    }
  })
};

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const [activeTab, setActiveTab] = useState<'submitted' | 'pending'>('pending');
  const submittedExpenses = expenses.filter(expense => expense.status === "submitted");
  const pendingExpenses = expenses.filter(expense => expense.status === "pending");
  const router = useRouter();

  const handleViewExpense = (id: string) => {
    router.push(`expenses/view/${id}`);
  };

  const onSubmitExpense = async (id: string) => {
    await updateExpenseStatus(id, "submitted");
    // Add visual feedback here
  };

  const handleAddExpense = () => {
    router.push("../expenses/new");
  };

  const StatusIndicator = ({ status }: { status: string }) => (
    <motion.span
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${status === "submitted" 
          ? "bg-green-50 text-green-700 border border-green-200" 
          : "bg-amber-50 text-amber-700 border border-amber-200"}
      `}
    >
      {status === "submitted" ? (
        <TrendingUp className="w-3 h-3 mr-1" />
      ) : (
        <Clock className="w-3 h-3 mr-1" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-4xl font-bold text-gray-900">Expenses Dashboard</h1>
          <Button 
            onClick={handleAddExpense}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 mr-2" />
            Add Expense
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Submitted Reimbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-gray-900"
              >
                {submittedExpenses.length}
              </motion.span>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-2 text-amber-600" />
                Pending Reimbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-gray-900"
              >
                {pendingExpenses.length}
              </motion.span>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
            className="flex-1 md:flex-none"
          >
            Pending
          </Button>
          <Button
            variant={activeTab === 'submitted' ? 'default' : 'outline'}
            onClick={() => setActiveTab('submitted')}
            className="flex-1 md:flex-none"
          >
            Submitted
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-lg shadow-lg border border-gray-100"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(activeTab === 'submitted' ? submittedExpenses : pendingExpenses).map((expense, i) => (
                  <motion.tr
                    key={expense.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="group hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium">
                      {format(new Date(expense.$createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {expense.total} kr
                    </TableCell>
                    <TableCell>
                      <StatusIndicator status={expense.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewExpense(expense.$id)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {expense.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSubmitExpense(expense.$id)}
                            className="hover:bg-green-50"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ExpenseTable;