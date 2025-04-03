"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Users, CheckCircle2, AlertCircle, CalendarDays, Loader2, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { MentoringProgram } from "@/lib/types/alumni"
import { cn } from "@/lib/utils"
import { applyToProgram, getMentoringPrograms } from "@/app/(alumni)/alumni/actions"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const applicationSchema = z.object({
  motivationStatement: z.string().min(50, {
    message: "Your motivation statement should be at least 50 characters",
  }).max(500, {
    message: "Your motivation statement should not exceed 500 characters",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ProgramDetailPage() {
  const router = useRouter()
  const params = useParams()
  const programId = params.programId as string
  
  const [program, setProgram] = useState<MentoringProgram | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      motivationStatement: "",
    },
  });
  
  // Fetch program data
  useEffect(() => {
    const fetchProgram = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const programs = await getMentoringPrograms([`$id=${programId}`])
        
        if (programs.length === 0) {
          notFound()
          return
        }
        
        setProgram(programs[0])
      } catch (err) {
        console.error("Error fetching program:", err)
        setError("Failed to load program data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProgram()
  }, [programId])
  
  // Handle application submission
  async function onSubmit(data: ApplicationFormValues) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await applyToProgram(programId, data.motivationStatement)
      setApplicationSubmitted(true)
      
      // Redirect after successful submission (with a delay for user to see success message)
      setTimeout(() => {
        router.push("/alumni/mentoring?tab=programs&success=application")
      }, 3000)
    } catch (err) {
      console.error("Error submitting application:", err)
      setError("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Check if application deadline has passed
  const isDeadlinePassed = program ? new Date(program.applicationDeadline) < new Date() : false
  
  // Check if program is full
  const isProgramFull = program ? program.spotsRemaining <= 0 : false
  
  // Determine if user can apply
  const canApply = program && !isDeadlinePassed && !isProgramFull && !applicationSubmitted
  
  // Get category color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Career Development":
        return "text-blue-accent border-blue-accent/30"
      case "Leadership":
        return "text-purple-500 border-purple-500/30"
      case "Entrepreneurship":
        return "text-amber-500 border-amber-500/30"
      default:
        return "text-green-500 border-green-500/30"
    }
  }
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white"
            asChild
          >
            <Link href="/alumni/mentoring?tab=programs" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4">
              <Loader2 className="h-12 w-12 text-blue-accent animate-spin" />
            </div>
            <p className="text-gray-300">Loading program information...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : program ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="h-56 relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${program.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-90 via-primary-90/70 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    {program.category && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "backdrop-blur-sm font-medium",
                          getCategoryColor(program.category)
                        )}
                      >
                        {program.category}
                      </Badge>
                    )}
                    
                    {program.featured && (
                      <Badge variant="gradient" className="backdrop-blur-sm border-blue-accent/20">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{program.title}</CardTitle>
                  <CardDescription className="text-gray-300">{program.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-md bg-blue-accent/10">
                        <Calendar className="h-5 w-5 text-blue-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Start Date</p>
                        <p className="text-white">{formatDate(program.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-md bg-secondary-100/10">
                        <CalendarDays className="h-5 w-5 text-secondary-100" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Application Deadline</p>
                        <p className="text-white">{formatDate(program.applicationDeadline)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-md bg-purple-500/10">
                        <Clock className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Duration & Commitment</p>
                        <p className="text-white">{program.duration} • {program.commitment}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-md bg-amber-500/10">
                        <Users className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Availability</p>
                        <p className="text-white">
                          {program.spotsRemaining} of {program.spots} spots remaining
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-primary-80/20" />
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white">Program Details</h3>
                    <p className="text-gray-300">
                      This program offers structured mentoring sessions with experienced professionals who will guide participants through important career development milestones. You&apos;ll learn valuable skills, expand your professional network, and gain insights from successful alumni in your field.
                    </p>
                    <h4 className="font-medium text-white mt-4">What to expect:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      <li>Personalized guidance from experienced mentors</li>
                      <li>Regular one-on-one mentoring sessions</li>
                      <li>Networking opportunities with other program participants</li>
                      <li>Structured curriculum and resources</li>
                      <li>Career development workshops and activities</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card variant="glass-dark" className="border-0 overflow-hidden sticky top-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white">Apply to This Program</CardTitle>
                  <CardDescription className="text-gray-300">
                    Submit your application to join this mentoring program
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {applicationSubmitted ? (
                    <div className="flex flex-col items-center text-center py-8">
                      <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Application Submitted!</h3>
                      <p className="text-gray-300 mb-4">
                        Your application has been received. We&apos;ll review it and get back to you soon.
                      </p>
                      <p className="text-sm text-gray-400">Redirecting to programs page...</p>
                    </div>
                  ) : isDeadlinePassed ? (
                    <Alert className="border border-amber-500/20 bg-amber-500/10 text-amber-500">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Application Closed</AlertTitle>
                      <AlertDescription>
                        The application deadline for this program has passed. Please check other available programs.
                      </AlertDescription>
                    </Alert>
                  ) : isProgramFull ? (
                    <Alert className="border border-amber-500/20 bg-amber-500/10 text-amber-500">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Program Full</AlertTitle>
                      <AlertDescription>
                        This program is currently at capacity. Please check other available programs or join the waitlist.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="rounded-md border border-blue-accent/20 bg-blue-accent/5 p-4">
                        <div className="flex items-start gap-2">
                          <div className="p-1 rounded-full bg-blue-accent/20 mt-0.5">
                            <Check className="h-4 w-4 text-blue-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Great Choice!</p>
                            <p className="text-xs text-gray-300">
                              This program is a perfect opportunity to accelerate your career growth with guidance from experienced mentors.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="motivationStatement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Why do you want to join this program?</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Share your motivation for joining this program and what you hope to achieve..." 
                                    className="min-h-[150px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {field.value.length}/500 characters
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            variant="gradient" 
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </>
                  )}
                </CardContent>
                {canApply && (
                  <CardFooter className="border-t border-secondary-100/10 bg-primary-80/30 px-6 py-4 relative z-10">
                    <p className="text-xs text-gray-400">
                      By submitting an application, you agree to participate in the program activities and adhere to the program guidelines.
                    </p>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-white mb-2">Program Not Found</h2>
            <p className="text-gray-300 mb-6">
              The program you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Button variant="gradient" asChild>
              <Link href="/alumni/mentoring?tab=programs">View All Programs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 