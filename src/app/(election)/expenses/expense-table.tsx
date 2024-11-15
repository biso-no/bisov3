"use client"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"


  export function ExpenseTable() {
    return (
      <div className="container mx-auto">
        <h1>Expenses Dashboard</h1>
        <div className="flex">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Reimbursements</CardTitle>
            </CardHeader>
            <CardContent>5</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Draft Reimbursements</CardTitle>
            </CardHeader>
            <CardContent>3</CardContent>
          </Card>
        </div>
        <div>
            <Button onClick={() => console.log('Add Travel Reimbursement')}>Add Travel</Button>
            <Button onClick={() => console.log('Add Travel Reimbursement')}>Add Non-Travel</Button>
        </div>
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
      </div>
    );
  }
  