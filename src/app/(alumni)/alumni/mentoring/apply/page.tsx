"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Info, Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { applyToBeMentor, isAutoAcceptMentorsEnabled } from "@/app/(alumni)/alumni/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define industries list
const industriesList = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Legal",
  "Entertainment",
  "Non-profit",
  "Government",
  "Other"
]

// Define languages list
const languagesList = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Russian",
  "Portuguese",
  "Hindi",
  "Other"
]

// Define meeting preferences
const meetingPreferencesList = [
  "One-on-one video calls",
  "Email exchanges",
  "Group sessions",
  "In-person meetings",
  "Asynchronous messaging",
  "Phone calls"
]

// Define the form schema
const mentorFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Job title is required.",
  }),
  company: z.string().min(1, {
    message: "Company name is required.",
  }),
  expertise: z.string().min(5, {
    message: "Please list your areas of expertise.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  experience: z.coerce.number().min(1, {
    message: "Years of experience is required.",
  }),
  education: z.string().min(2, {
    message: "Education information is required.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  availability: z.string().min(2, {
    message: "Please specify your availability.",
  }),
  bio: z.string().min(50, {
    message: "Bio must be at least 50 characters.",
  }).max(500, {
    message: "Bio must not exceed 500 characters."
  }),
  graduationYear: z.string().min(4, {
    message: "Graduation year is required.",
  }),
  languages: z.array(z.string()).optional(),
  meetingPreference: z.array(z.string()).min(1, {
    message: "Please select at least one meeting preference.",
  }),
  maxMentees: z.coerce.number().min(1, {
    message: "Maximum number of mentees is required.",
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  })
})

type MentorFormValues = z.infer<typeof mentorFormSchema>

export default function MentorApplicationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isAutoApproved, setIsAutoApproved] = useState(false)
  
  // Initialize form with default values
  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      expertise: "",
      industry: "",
      experience: 0,
      education: "",
      location: "",
      availability: "",
      bio: "",
      graduationYear: "",
      languages: [],
      meetingPreference: [],
      maxMentees: 1,
      termsAccepted: false
    },
  })

  // Check if auto-approval is enabled using the server action
  useEffect(() => {
    const checkAutoApproval = async () => {
      const autoApproved = await isAutoAcceptMentorsEnabled();
      setIsAutoApproved(autoApproved);
    };
    
    checkAutoApproval();
  }, []);

  // Handle form submission
  async function onSubmit(values: MentorFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Format expertise as array
      const expertiseArray = values.expertise
        .split(",")
        .map(item => item.trim())
        .filter(item => item.length > 0)
      
      // Prepare mentor data for submission
      const mentorData = {
        name: values.name,
        title: values.title,
        company: values.company,
        expertise: expertiseArray,
        industry: values.industry,
        experience: values.experience,
        education: values.education,
        location: values.location,
        availability: values.availability,
        bio: values.bio,
        graduationYear: values.graduationYear,
        languages: values.languages,
        meetingPreference: values.meetingPreference,
        maxMentees: values.maxMentees,
        available: true
      }
      
      // Submit application
      await applyToBeMentor(mentorData)
      setSubmitSuccess(true)
      
      // Redirect after successful submission (with a delay for user to see success message)
      setTimeout(() => {
        router.push("/alumni/mentoring?tab=become-mentor&success=true")
      }, 3000)
    } catch (error) {
      console.error("Error submitting mentor application:", error)
      setSubmitError("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-140 h-140 rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white"
            asChild
          >
            <Link href="/alumni/mentoring" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Mentoring
            </Link>
          </Button>
        </div>
        
        <PageHeader
          gradient
          heading="Become a Mentor"
          subheading="Share your expertise and help shape the next generation of professionals"
        />
        
        {submitSuccess ? (
          <Card variant="glass-dark" className="border-0 overflow-hidden mt-8">
            <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-blue-accent/10 opacity-20" />
            <CardContent className="p-8 flex flex-col items-center justify-center text-center relative z-10">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-medium text-white mb-2">Application Submitted Successfully!</h2>
              {isAutoApproved ? (
                <p className="text-gray-300 max-w-lg mb-6">
                  Thank you for applying to become a mentor. Your application has been automatically approved. You can now start mentoring students.
                </p>
              ) : (
                <p className="text-gray-300 max-w-lg mb-6">
                  Thank you for applying to become a mentor. Your application is now pending review by our administrators. We&apos;ll be in touch with you once your application has been reviewed.
                </p>
              )}
              <p className="text-sm text-gray-400">Redirecting you back to the mentoring page...</p>
            </CardContent>
          </Card>
        ) : (
          <Card variant="glass-dark" className="border-0 overflow-hidden mt-8">
            <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-xl">Mentor Application Form</CardTitle>
              <CardDescription className="text-gray-300">
                Please complete the form below to apply to join our mentoring program
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {submitError && (
                <Alert variant="destructive" className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
            
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Full Name</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="graduationYear"
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
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Location</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="languages"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-gray-200">Languages</FormLabel>
                              <FormDescription className="text-gray-300">
                                Select the languages you are fluent in.
                              </FormDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {languagesList.map((language) => (
                                <FormField
                                  key={language}
                                  control={form.control}
                                  name="languages"
                                  render={({ field }) => {
                                    return (
                                      <Badge
                                        variant={field.value?.includes(language) ? "gradient" : "outline"}
                                        className="cursor-pointer py-1.5 bg-primary-80/50 hover:bg-primary-80/70 transition-colors text-white"
                                        onClick={() => {
                                          const currentValues = field.value || []
                                          const updatedValues = currentValues.includes(language)
                                            ? currentValues.filter((l) => l !== language)
                                            : [...currentValues, language]
                                          field.onChange(updatedValues)
                                        }}
                                      >
                                        {language}
                                      </Badge>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-primary-80/20" />
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Job Title</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="Your current job title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Company</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="Your current company" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Industry</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="glass-dark text-white border-secondary-100/20 hover:border-secondary-100/40 transition-colors">
                                  <SelectValue placeholder="Select your industry" className="text-gray-300" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                                {industriesList.map((industry) => (
                                  <SelectItem key={industry} value={industry} className="text-white hover:bg-blue-accent/20 focus:bg-blue-accent/20 transition-colors">
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Years of Experience</FormLabel>
                            <FormControl>
                              <Input 
                                className="text-white"
                                type="number" 
                                min={1} 
                                placeholder="Years of professional experience" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel className="text-gray-200">Education</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="Your educational background" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-300">
                              List your degrees, institutions, and years (e.g., MBA, Harvard Business School, 2015)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel className="text-gray-200">Areas of Expertise</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="Leadership, Project Management, Data Analysis, etc." {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-300">
                              List your areas of expertise, separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-primary-80/20" />
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Mentoring Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Availability</FormLabel>
                            <FormControl>
                              <Input className="text-white" placeholder="e.g., 2-3 hours per week" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-300">
                              How much time can you dedicate to mentoring?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxMentees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Maximum Number of Mentees</FormLabel>
                            <FormControl>
                              <Input 
                                className="text-white"
                                type="number" 
                                min={1} 
                                max={10} 
                                placeholder="How many mentees can you take?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="meetingPreference"
                        render={() => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <div className="mb-4">
                              <FormLabel className="text-gray-200">Meeting Preferences</FormLabel>
                              <FormDescription className="text-gray-300">
                                How would you prefer to meet with your mentees?
                              </FormDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {meetingPreferencesList.map((preference) => (
                                <FormField
                                  key={preference}
                                  control={form.control}
                                  name="meetingPreference"
                                  render={({ field }) => {
                                    return (
                                      <Badge
                                        variant={field.value?.includes(preference) ? "gradient" : "outline"}
                                        className="cursor-pointer py-1.5 bg-primary-80/50 hover:bg-primary-80/70 transition-colors text-white"
                                        onClick={() => {
                                          const currentValues = field.value || []
                                          const updatedValues = currentValues.includes(preference)
                                            ? currentValues.filter((p) => p !== preference)
                                            : [...currentValues, preference]
                                          field.onChange(updatedValues)
                                        }}
                                      >
                                        {preference}
                                      </Badge>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel className="text-gray-200">Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="text-white"
                                placeholder="Tell us about yourself, your career journey, and why you want to be a mentor." 
                                rows={5}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-300">
                              {field.value.length}/500 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary-80/20 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-blue-500 data-[state=checked]:bg-blue-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-200">
                            I agree to BISO&apos;s <Link href="https://bistudentorganisasjon.sharepoint.com/:b:/g/EYZt6ULEILZDl19yJiu7DPABP28VU5me66AsjYmVWN4paw?e=njJKD8" target="_blank" className="text-blue-400 hover:underline">code of conduct</Link> and guidelines
                          </FormLabel>
                          <FormDescription className="text-gray-300">
                            By applying, you commit to upholding professional standards and supporting mentees to the best of your abilities.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 