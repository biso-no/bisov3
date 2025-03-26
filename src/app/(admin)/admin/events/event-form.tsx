"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, CheckIcon, Loader2, X, ImageIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/rich-text-editor";
import { toast } from "@/lib/hooks/use-toast";
import { createEvent, updateEvent } from "@/app/actions/admin";
import { Event } from "@/lib/types/event";
import { Department } from "@/lib/types/department";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the form schema with Zod for validation
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }).optional(),
  start_time: z.string().min(1, { message: "Start time is required" }),
  end_time: z.string().min(1, { message: "End time is required" }),
  campus: z.string().min(1, { message: "Campus is required" }),
  units: z.array(z.string()).min(1, { message: "At least one unit must be selected" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }).default(0),
  ticket_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  event?: Event;
  departments: Department[];
  campuses: any[];
}

export function EventForm({ event, departments, campuses }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<Department[]>([]);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  
  // Prepare initial values for the form
  const defaultValues = event
    ? {
        title: event.title,
        description: event.description,
        start_date: new Date(event.start_date),
        end_date: event.end_date ? new Date(event.end_date) : undefined,
        start_time: event.start_time,
        end_time: event.end_time,
        campus: event.campus || "",
        units: event.units?.map(unit => unit.$id) || [],
        price: event.price || 0,
        ticket_url: event.ticket_url || "",
        image: event.image || "",
      }
    : {
        title: "",
        description: "",
        start_date: new Date(),
        end_date: undefined,
        start_time: "18:00",
        end_time: "21:00",
        campus: "",
        units: [],
        price: 0,
        ticket_url: "",
        image: "",
      };

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update filtered departments when campus changes
  const selectedCampus = form.watch("campus");
  
  useEffect(() => {
    if (selectedCampus) {
      // Filter departments that belong to the selected campus
      const depsForCampus = departments.filter(
        dept => dept.campus_id === selectedCampus
      );
      setFilteredDepartments(depsForCampus);
      
      // Clear selected units that don't belong to this campus
      const currentUnitIds = form.getValues("units") || [];
      const validUnitIds = currentUnitIds.filter(unitId => 
        depsForCampus.some(dept => dept.$id === unitId)
      );
      
      // Update form value and selected units state
      form.setValue("units", validUnitIds, { shouldValidate: true });
      setSelectedUnits(prevUnits => 
        prevUnits.filter(unit => 
          depsForCampus.some(dept => dept.$id === unit.$id)
        )
      );
    } else {
      setFilteredDepartments([]);
      form.setValue("units", [], { shouldValidate: true });
      setSelectedUnits([]);
    }
  }, [selectedCampus, departments, form]);

  // Set up selected units on form initialization
  useEffect(() => {
    if (event?.units && departments.length > 0) {
      const units = event.units.map(unit => {
        return departments.find(dept => dept.$id === unit.$id) || unit;
      });
      setSelectedUnits(units);
      
      if (event.campus) {
        const depsForCampus = departments.filter(
          dept => dept.campus_id === event.campus
        );
        setFilteredDepartments(depsForCampus);
      }
    }
  }, [event, departments]);

  // Handle unit selection
  const toggleUnit = useCallback((unit: Department) => {
    const unitsValue = form.getValues("units") || [];
    const isSelected = unitsValue.includes(unit.$id);
    
    if (isSelected) {
      // Remove unit
      const newUnitIds = unitsValue.filter(id => id !== unit.$id);
      form.setValue("units", newUnitIds, { shouldValidate: true });
      setSelectedUnits(prev => prev.filter(u => u.$id !== unit.$id));
    } else {
      // Add unit
      const newUnitIds = [...unitsValue, unit.$id];
      form.setValue("units", newUnitIds, { shouldValidate: true });
      setSelectedUnits(prev => [...prev, unit]);
    }
  }, [form]);

  // Remove unit handler
  const removeUnit = useCallback((unitId: string) => {
    const unitsValue = form.getValues("units");
    const newUnitIds = unitsValue.filter(id => id !== unitId);
    form.setValue("units", newUnitIds, { shouldValidate: true });
    setSelectedUnits(prev => prev.filter(u => u.$id !== unitId));
  }, [form]);

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format dates for API
      const formattedValues = {
        ...values,
        start_date: format(values.start_date, "yyyy-MM-dd"),
        end_date: values.end_date ? format(values.end_date, "yyyy-MM-dd") : format(values.start_date, "yyyy-MM-dd"),
      };
      
      if (event?.$id) {
        // Update existing event
        await updateEvent(event.$id, formattedValues);
        toast({
          title: "Event updated",
          description: "The event has been successfully updated",
        });
      } else {
        // Create new event
        await createEvent(formattedValues);
        toast({
          title: "Event created",
          description: "The event has been successfully created and is pending approval",
        });
      }
      
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to save the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content column */}
            <div className="lg:col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Event Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a descriptive title for your event" 
                        {...field} 
                        className="text-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed as the main title of your event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Description</FormLabel>
                    <FormControl>
                      <div className="min-h-[350px] border rounded-md">
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your event. This will be shown in the app and website.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Event Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image for your event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ticket_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Ticket Purchase URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://tickets.example.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        The URL where users can purchase tickets (if applicable).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sidebar column for event details */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Date & Time</h3>
                  
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Same as start date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => {
                                const startDate = form.getValues("start_date");
                                return date < startDate;
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">Campus & Units</h3>
                  
                  <FormField
                    control={form.control}
                    name="campus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a campus" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campuses.map((campus) => (
                              <SelectItem key={campus.$id} value={campus.$id}>
                                {campus.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the campus where this event will take place.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Units</FormLabel>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedUnits.length > 0 ? (
                            selectedUnits.map((unit) => (
                              <Badge key={unit.$id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                {unit.Name}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => removeUnit(unit.$id)}
                                  className="h-4 w-4 p-0 ml-1"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-sm">No units selected</div>
                          )}
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowUnitSelector(!showUnitSelector)}
                          disabled={!selectedCampus}
                        >
                          {!selectedCampus ? "Select a campus first" : showUnitSelector ? "Hide Units" : "Select Units"}
                        </Button>
                        
                        {selectedCampus && showUnitSelector && (
                          <div className="mt-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                            {filteredDepartments.length > 0 ? (
                              <div className="grid grid-cols-1 gap-1">
                                {filteredDepartments.map((unit) => {
                                  const isSelected = field.value?.includes(unit.$id);
                                  return (
                                    <div
                                      key={unit.$id}
                                      className={cn(
                                        "flex items-center p-2 rounded-md cursor-pointer transition-colors",
                                        isSelected
                                          ? "bg-primary/10 hover:bg-primary/20"
                                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                      )}
                                      onClick={() => toggleUnit(unit)}
                                    >
                                      <div className={cn(
                                        "w-4 h-4 rounded-sm border mr-2 flex items-center justify-center",
                                        isSelected ? "bg-primary border-primary" : "border-gray-300"
                                      )}>
                                        {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                                      </div>
                                      <span>{unit.Name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No units available for the selected campus.
                              </div>
                            )}
                          </div>
                        )}
                        <FormDescription>
                          Select the unit(s) hosting this event. You must select a campus first.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center">
                            <span>Price (kr)</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Set to 0 for free events</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {event ? "Update Event" : "Create Event"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push("/admin/events")}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
} 