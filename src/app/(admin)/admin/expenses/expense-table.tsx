"use client";
import { Expense } from "@/lib/types/expense";
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation"
import { Edit, Search } from 'lucide-react';
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminExpenseTable({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [uniqueCampuses, setUniqueCampuses] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    search: "",
    department: "all",
    campus: "all",
    status: "all"
  });
  const [filters, setFilters] = useState({
    search: "",
    department: "all",
    campus: "all",
    status: "all"
  });

  useEffect(() => {
    const departments = Array.from(new Set(expenses.map(expense => expense.department)));
    const campuses = Array.from(new Set(expenses.map(expense => expense.campus)));
    setUniqueDepartments(departments);
    setUniqueCampuses(campuses);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        (filters.search === "" ||
          expense.user.name.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.department === "all" || expense.department === filters.department) &&
        (filters.campus === "all" || expense.campus === filters.campus) &&
        (filters.status === "all" || expense.status === filters.status)
    );
  }, [filters, expenses]);

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(formData);
  };

  const actionClick = (selected_expense_id: string) => {
    router.push(`/admin/expenses/${selected_expense_id}`)
  }

  const pendingCount = useMemo(() => {
    return expenses.filter(expense => expense.status === "pending").length;
  }, [expenses]);

  const submittedCount = useMemo(() => {
    return expenses.filter(expense => expense.status === "submitted").length;
  }, [expenses]);

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}</div>
          </CardContent>
        </Card>
      </div>

      <h1 className="text-2xl font-bold mb-5">Expenses</h1>
      <form onSubmit={handleSearch} className="flex gap-4 mb-5">
        <Input
          type="text"
          placeholder="Search..."
          value={formData.search}
          onChange={(e) => setFormData(prev => ({ ...prev, search: e.target.value }))}
          className="flex-grow"
        />
        <Select value={formData.department} onValueChange={handleChange("department")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map((dep) => (
              <SelectItem key={dep} value={dep}>{dep}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={formData.campus} onValueChange={handleChange("campus")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Campuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campuses</SelectItem>
            {uniqueCampuses.map((camp) => (
              <SelectItem key={camp} value={camp}>{camp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={formData.status} onValueChange={handleChange("status")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>User</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Campus</TableHead>
            <TableHead>Bank Account</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.$id}>
              <TableCell>{expense.user===null?null :  expense.user.name }</TableCell>
              <TableCell>{expense.department}</TableCell>
              <TableCell>{expense.campus}</TableCell>
              <TableCell>{expense.bank_account}</TableCell>
              <TableCell>{expense.total}</TableCell>
              <TableCell>
              <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        expense.status === "pending"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {expense.status}
                    </span> </TableCell>
              <TableCell>
                <Button onClick={() => actionClick(expense.$id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

