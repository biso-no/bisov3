import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function NonTravelExpense() {
  const { control } = useFormContext()

  return (
    <div>
      <FormField
        control={control}
        name="totalAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Amount</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mva"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MVA</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

