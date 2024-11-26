import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExpenseType({ setFormType }) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="expenseType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Expense Type</FormLabel>
          <FormControl>
            <Select onValueChange={(value) => {
              field.onChange(value)
              setFormType(value)
            }} value={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Expense Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Expense Type</SelectLabel>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="non-travel">Non-travel</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

