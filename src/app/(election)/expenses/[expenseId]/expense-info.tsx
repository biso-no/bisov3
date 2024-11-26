import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function ExpenseInfo() {
  const { control } = useFormContext()

  return (
    <div>
      <FormField
        control={control}
        name="expenseDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expense Description</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="activity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activity</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="expenseDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expense Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="expenseLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expense Location</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

