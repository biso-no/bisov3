import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function BankDetails() {
  const { control } = useFormContext()

  return (
    <div>
      <FormField
        control={control}
        name="bankAccountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Account Number</FormLabel>
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
        name="confirmBankAccountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Bank Account Number</FormLabel>
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

