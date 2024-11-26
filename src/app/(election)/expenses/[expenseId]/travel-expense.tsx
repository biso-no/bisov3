import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function TravelExpense() {
  const { control } = useFormContext()

  return (
    <div>
      <FormField
        control={control}
        name="travelPurpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Travel Purpose</FormLabel>
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
        name="travelStartDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Travel Start Date</FormLabel>
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
        name="travelEndDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Travel End Date</FormLabel>
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
        name="totalKilometers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Kilometers</FormLabel>
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
        name="tollFees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Toll Fees</FormLabel>
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
            <FormLabel>MVA (VAT)</FormLabel>
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

