"use client";

import { Expense } from "@/lib/types/expense";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Edit, Search, ArrowUpDown, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton for the table
const TableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4">
        {[...Array(7)].map((_, j) => (
          <Skeleton key={j} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  trend?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    pending: {
      icon: Clock,
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    },
    submitted: {
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    },
  };

  const statusConfig = config[status as keyof typeof config];
  const Icon = statusConfig.icon;

  return (
    <Badge 
      variant="secondary" 
      className={`${statusConfig.className} flex items-center gap-1.5`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

export function AdminExpenseTable({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  useEffect(() => {
    const departments = Array.from(new Set(expenses.map(expense => expense.department)));
    const campuses = Array.from(new Set(expenses.map(expense => expense.campus)));
    setUniqueDepartments(departments);
    setUniqueCampuses(campuses);
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [expenses]);

  const handleSort = (key: keyof Expense) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        (filters.search === "" ||
          expense.user?.name?.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.department === "all" || expense.department === filters.department) &&
        (filters.campus === "all" || expense.campus === filters.campus) &&
        (filters.status === "all" || expense.status === filters.status)
    );
  }, [filters, expenses]);

  const sortedExpenses = useMemo(() => {
    const sorted = [...filteredExpenses];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [filteredExpenses, sortConfig]);



  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(formData);
  };

  const actionClick = async (selected_expense_id: string) => {
    setIsLoading(true);
    try {
      await router.push(`/admin/expenses/${selected_expense_id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => ({
    pending: expenses.filter(expense => expense.status === "pending").length,
    submitted: expenses.filter(expense => expense.status === "submitted").length,
    totalAmount: expenses.reduce((sum, expense) => sum + Number(expense.total), 0),
  }), [expenses]);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Pending Expenses"
          value={stats.pending}
          icon={Clock}
          trend={5}
        />
        <StatCard
          title="Submitted Expenses"
          value={stats.submitted}
          icon={CheckCircle2}
          trend={-2}
        />
        <StatCard
          title="Total Amount"
          value={Number((stats.totalAmount / 1000).toFixed(1))}
          icon={ArrowUpDown}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Expenses Overview</h1>
          <p className="text-sm text-muted-foreground">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </p>
        </div>

        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-5">
          <Input
            type="text"
            placeholder="Search by name..."
            value={formData.search}
            onChange={(e) => setFormData(prev => ({ ...prev, search: e.target.value }))}
            className="md:col-span-2"
          />
          <Select value={formData.department} onValueChange={handleChange("department")}>
            <SelectTrigger>
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
            <SelectTrigger>
              <SelectValue placeholder="All Campuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campuses</SelectItem>
              {uniqueCampuses.map((camp) => (
                <SelectItem key={camp} value={camp}>{camp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('user')} className="cursor-pointer hover:bg-muted/50">
                  User <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead onClick={() => handleSort('department')} className="cursor-pointer hover:bg-muted/50">
                  Department <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead onClick={() => handleSort('campus')} className="cursor-pointer hover:bg-muted/50">
                  Campus <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead onClick={() => handleSort('total')} className="cursor-pointer hover:bg-muted/50">
                  Total <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer hover:bg-muted/50">
                  Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {sortedExpenses.map((expense) => (
                  <motion.tr
                    key={expense.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <TableCell>{expense.user?.name || 'N/A'}</TableCell>
                    <TableCell>{expense.department}</TableCell>
                    <TableCell>{expense.campus}</TableCell>
                    <TableCell>{expense.bank_account}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('sv-SE', { 
                        style: 'currency', 
                        currency: 'SEK' 
                      }).format(Number(expense.total))}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={expense.status} />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => actionClick(expense.$id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}