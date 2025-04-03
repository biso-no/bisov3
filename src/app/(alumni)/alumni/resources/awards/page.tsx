"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trophy, ArrowLeft, Loader2, Sparkles, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define form schema
const nominationSchema = z.object({
  nominatorName: z.string().min(2, {
    message: "Please enter your name",
  }),
  nominatorEmail: z.string().email({
    message: "Please enter a valid email",
  }),
  nomineeName: z.string().min(2, {
    message: "Please enter the nominee&apos;s name",
  }),
  nomineeGraduationYear: z.string().min(4, {
    message: "Please enter a valid graduation year",
  }).max(4),
  category: z.string({
    required_error: "Please select an award category",
  }),
  achievementDescription: z.string().min(100, {
    message: "Description must be at least 100 characters",
  }).max(1000, {
    message: "Description must not exceed 1000 characters"
  }),
  impact: z.string().min(50, {
    message: "Impact statement must be at least 50 characters",
  }).max(500, {
    message: "Impact statement must not exceed 500 characters"
  }),
  nomineeCurrentRole: z.string().min(2, {
    message: "Please enter the nominee&apos;s current role",
  }),
  relationship: z.string({
    required_error: "Please select your relationship to the nominee",
  }),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
})

type NominationFormValues = z.infer<typeof nominationSchema>

// Default values for the form
const defaultValues: Partial<NominationFormValues> = {
  nominatorName: "",
  nominatorEmail: "",
  nomineeName: "",
  nomineeGraduationYear: "",
  category: "",
  achievementDescription: "",
  impact: "",
  nomineeCurrentRole: "",
  relationship: "",
  termsAgreed: false,
}

export default function AwardsNominationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<NominationFormValues>({
    resolver: zodResolver(nominationSchema),
    defaultValues,
  })

  async function onSubmit(values: NominationFormValues) {
    setIsSubmitting(true)
    
    try {
      // Simulated API call - replace with actual implementation
      // const response = await fetch("/api/alumni/nominations", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(values),
      // })
      
      // if (!response.ok) throw new Error("Failed to submit nomination")
      
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitSuccess(true)
      
      toast({
        title: "Nomination Submitted!",
        description: "Thank you for your nomination. We will review it shortly.",
      })
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/alumni/resources")
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit nomination. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/alumni/resources")
  }

  // Award categories
  const awardCategories = [
    { id: "lifetime", name: "Lifetime Achievement" },
    { id: "innovation", name: "Innovation & Research" },
    { id: "leadership", name: "Leadership Excellence" },
    { id: "community", name: "Community Impact" },
    { id: "entrepreneurship", name: "Entrepreneurship" },
    { id: "young", name: "Rising Star (Young Alumni)" },
  ]

  // Relationship types
  const relationshipTypes = [
    { id: "colleague", name: "Professional Colleague" },
    { id: "classmate", name: "Former Classmate" },
    { id: "faculty", name: "Faculty Member" },
    { id: "employer", name: "Employer/Supervisor" },
    { id: "mentee", name: "Mentee" },
    { id: "other", name: "Other" },
  ]

  return (
    <div className="relative min-h-screen pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
      </div>
      
      {/* Header */}
      <section className="container pt-8 pb-12">
        <PageHeader
          gradient
          heading="Alumni Achievement Awards"
          subheading="Nominate outstanding alumni who have made significant contributions to their field or community"
        />
        <div className="flex justify-center mt-4">
          <Trophy className="h-12 w-12 text-gold-default" />
        </div>
      </section>
      
      {/* Main content */}
      <section className="container pb-16">
        {submitSuccess ? (
          <Card variant="glass-dark" className="max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-center text-gold-default mb-4">
                <Sparkles className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl text-center text-white">Nomination Submitted Successfully!</CardTitle>
              <CardDescription className="text-center text-gray-300 mt-2">
                Thank you for recognizing excellence in our alumni community. Your nomination has been received and will be reviewed by our committee.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white mb-6">You will be redirected to the resources page in a few seconds...</p>
              <Button variant="gradient" onClick={() => router.push("/alumni/resources")}>
                Return to Resources
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card variant="glass-dark">
              <CardHeader>
                <CardTitle className="text-xl text-white">Nomination Form</CardTitle>
                <CardDescription className="text-gray-300">
                  Please provide information about yourself and the alumnus/alumna you wish to nominate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nominatorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Your Name</FormLabel>
                              <FormControl>
                                <Input className="text-white" placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="nominatorEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Your Email</FormLabel>
                              <FormControl>
                                <Input className="text-white" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Your Relationship to the Nominee</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="text-white">
                                  <SelectValue placeholder="Select your relationship" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {relationshipTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white">Nominee Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nomineeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Nominee&apos;s Name</FormLabel>
                              <FormControl>
                                <Input className="text-white" placeholder="Nominee&apos;s full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="nomineeGraduationYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Graduation Year</FormLabel>
                              <FormControl>
                                <Input className="text-white" placeholder="e.g. 2015" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="nomineeCurrentRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Current Position/Role</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="e.g. CEO at Company X" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white">Award Details</h3>
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Award Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="text-white">
                                  <SelectValue placeholder="Select award category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {awardCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-gray-400">
                              Select the most appropriate category for this nomination
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="achievementDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Description of Achievements</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="text-white min-h-[150px]" 
                                placeholder="Describe the nominee's accomplishments, awards, or significant achievements..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              {field.value?.length || 0}/1000 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="impact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Impact Statement</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="text-white min-h-[100px]" 
                                placeholder="Explain how the nominee's contributions have made a positive impact..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              {field.value?.length || 0}/500 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="bg-blue-accent/10 p-4 rounded-lg border border-blue-accent/20">
                        <h4 className="text-blue-accent font-medium text-sm mb-2 flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Supporting Documents (Optional)
                        </h4>
                        <p className="text-gray-300 text-sm mb-4">
                          You may upload supporting documents such as letters of recommendation, CVs, or other relevant materials to strengthen the nomination.
                        </p>
                        <Button type="button" variant="outline" size="sm" className="text-blue-accent border-blue-accent/30">
                          Upload Documents
                        </Button>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-200">
                              I confirm that all information provided is accurate and complete.
                            </FormLabel>
                            <FormDescription className="text-gray-400">
                              By submitting this form, you agree to our terms and conditions regarding the nomination process.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="text-white"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>

                      <div className="flex items-center gap-4">
                        <Button
                          type="submit"
                          variant="golden-gradient"
                          size="lg"
                          disabled={isSubmitting}
                          className="min-w-[180px]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Trophy className="mr-2 h-4 w-4" />
                              Submit Nomination
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </div>
  )
} 