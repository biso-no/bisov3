"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Briefcase, GraduationCap, Calendar, MapPin, Star, MessageSquare, Users, CheckCircle2, AlertCircle, Globe, Loader2, Clock } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Mentor } from "@/lib/types/alumni"
import { getMentor } from "@/app/(alumni)/alumni/actions"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function MentorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const mentorId = params.mentorId as string
  
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionRequested, setConnectionRequested] = useState(false)
  
  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const mentorData = await getMentor(mentorId)
        
        if (!mentorData) {
          notFound()
          return
        }
        
        setMentor(mentorData)
      } catch (err) {
        console.error("Error fetching mentor:", err)
        setError("Failed to load mentor data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMentor()
  }, [mentorId])
  
  // Handle connection request
  const handleRequestConnection = () => {
    // In a real implementation, this would call an API to request a connection
    setConnectionRequested(true)
    
    // Simulate redirection after a few seconds (in a real app, this might depend on the implementation)
    setTimeout(() => {
      router.push(`/alumni/messages?new=${mentorId}`)
    }, 3000)
  }
  
  // Calculate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
            <Link href="/alumni/mentoring" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Mentors
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4">
              <Loader2 className="h-12 w-12 text-blue-accent animate-spin" />
            </div>
            <p className="text-gray-300">Loading mentor profile...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : mentor ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10 pt-8 pb-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-accent/50 to-secondary-100/30 blur-md opacity-70"></div>
                      <Avatar className="h-24 w-24 border-2 border-primary-90/50 relative">
                        <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                        <AvatarFallback className="text-2xl bg-primary-80">{getInitials(mentor.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <CardTitle className="text-2xl text-white">{mentor.name}</CardTitle>
                        {mentor.featured && (
                          <Badge variant="gradient" className="ml-2">
                            Featured Mentor
                          </Badge>
                        )}
                      </div>
                      
                      <CardDescription className="text-lg text-gray-300 mb-3">
                        {mentor.title} {mentor.company && `at ${mentor.company}`}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2">
                        {mentor.industry && (
                          <Badge variant="outline" className="bg-primary-80/50">
                            {mentor.industry}
                          </Badge>
                        )}
                        {mentor.graduationYear && (
                          <Badge variant="secondary" className="bg-blue-accent/20 text-blue-accent border-blue-accent/30">
                            Class of {mentor.graduationYear}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-6 px-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mentor.experience && (
                      <div className="flex flex-col items-center text-center p-4 glass-dark rounded-lg">
                        <div className="p-2 rounded-full bg-blue-accent/20 mb-2">
                          <Briefcase className="h-5 w-5 text-blue-accent" />
                        </div>
                        <p className="text-sm text-gray-400">Experience</p>
                        <p className="text-white font-medium">{mentor.experience} years</p>
                      </div>
                    )}
                    
                    {mentor.menteeCount !== undefined && (
                      <div className="flex flex-col items-center text-center p-4 glass-dark rounded-lg">
                        <div className="p-2 rounded-full bg-secondary-100/20 mb-2">
                          <Users className="h-5 w-5 text-secondary-100" />
                        </div>
                        <p className="text-sm text-gray-400">Mentees</p>
                        <p className="text-white font-medium">{mentor.menteeCount} mentored</p>
                      </div>
                    )}
                    
                    {mentor.rating && (
                      <div className="flex flex-col items-center text-center p-4 glass-dark rounded-lg">
                        <div className="p-2 rounded-full bg-amber-500/20 mb-2">
                          <Star className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-sm text-gray-400">Rating</p>
                        <p className="text-white font-medium">{mentor.rating.toFixed(1)} / 5</p>
                      </div>
                    )}
                    
                    {mentor.availability && (
                      <div className="flex flex-col items-center text-center p-4 glass-dark rounded-lg">
                        <div className="p-2 rounded-full bg-purple-500/20 mb-2">
                          <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-sm text-gray-400">Availability</p>
                        <p className="text-white font-medium">{mentor.availability}</p>
                      </div>
                    )}
                  </div>
                  
                  <Tabs defaultValue="about" className="space-y-4">
                    <TabsList className="glass-dark border border-secondary-100/20 w-full justify-start h-10 p-1">
                      <TabsTrigger 
                        value="about" 
                        className="rounded data-[state=active]:bg-blue-accent/20 data-[state=active]:text-blue-accent"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger 
                        value="expertise" 
                        className="rounded data-[state=active]:bg-blue-accent/20 data-[state=active]:text-blue-accent"
                      >
                        Expertise
                      </TabsTrigger>
                      <TabsTrigger 
                        value="education" 
                        className="rounded data-[state=active]:bg-blue-accent/20 data-[state=active]:text-blue-accent"
                      >
                        Education
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="about" className="space-y-4 pt-2">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Bio</h3>
                        <p className="text-gray-300 leading-relaxed">{mentor.bio}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {mentor.location && (
                          <div className="flex items-center gap-3 p-3 glass-dark rounded-lg">
                            <div className="p-2 rounded-full bg-blue-accent/10">
                              <MapPin className="h-5 w-5 text-blue-accent" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Location</p>
                              <p className="text-white">{mentor.location}</p>
                            </div>
                          </div>
                        )}
                        
                        {mentor.languages && mentor.languages.length > 0 && (
                          <div className="flex items-center gap-3 p-3 glass-dark rounded-lg">
                            <div className="p-2 rounded-full bg-secondary-100/10">
                              <Globe className="h-5 w-5 text-secondary-100" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Languages</p>
                              <p className="text-white">{mentor.languages.join(", ")}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {mentor.meetingPreference && mentor.meetingPreference.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-white font-medium mb-3">Meeting Preferences</h4>
                          <div className="flex flex-wrap gap-2">
                            {mentor.meetingPreference.map((pref, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="bg-primary-80/30 text-gray-300"
                              >
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="expertise" className="space-y-4 pt-2">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((skill, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary"
                              className="text-blue-accent bg-blue-accent/10 border border-blue-accent/20 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-gray-300 mt-4">
                          With {mentor.experience} years of industry experience, {mentor.name.split(' ')[0]} has developed deep expertise 
                          in these areas and is passionate about sharing knowledge and helping others grow professionally.
                        </p>
                      </div>
                      
                      {mentor.industries && mentor.industries.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-white font-medium mb-3">Industries</h4>
                          <div className="flex flex-wrap gap-2">
                            {mentor.industries.map((industry, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="bg-secondary-100/10 text-secondary-100 border-secondary-100/30"
                              >
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="education" className="space-y-4 pt-2">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Educational Background</h3>
                        <div className="p-4 glass-dark rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-blue-accent/10 mt-1">
                              <GraduationCap className="h-5 w-5 text-blue-accent" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{mentor.education}</p>
                              <p className="text-gray-400 text-sm">Graduated: {mentor.graduationYear}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card variant="glass-dark" className="border-0 overflow-hidden sticky top-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white">Connect with {mentor.name.split(' ')[0]}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Request mentorship and start your professional growth journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {connectionRequested ? (
                    <div className="flex flex-col items-center text-center py-8">
                      <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Request Sent!</h3>
                      <p className="text-gray-300 mb-4">
                        Your mentorship request has been sent to {mentor.name}. 
                        You&apos;ll be redirected to the messaging page to start the conversation.
                      </p>
                      <p className="text-sm text-gray-400">Redirecting...</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md border border-blue-accent/20 bg-blue-accent/5 p-4">
                        <div className="flex gap-4">
                          <div className="p-2 rounded-full bg-blue-accent/20 h-fit">
                            <MessageSquare className="h-5 w-5 text-blue-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white mb-1">How It Works</p>
                            <ul className="space-y-2 text-xs text-gray-300">
                              <li className="flex items-start gap-2">
                                <span>1.</span>
                                <span>Request a connection with {mentor.name.split(' ')[0]}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span>2.</span>
                                <span>Send a message introducing yourself and what you&apos;d like to learn</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span>3.</span>
                                <span>If accepted, schedule your first mentoring session</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span>4.</span>
                                <span>Maintain regular communication to get the most out of your mentorship</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center text-center p-3 glass-dark rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-accent mb-2" />
                          <p className="text-xs text-gray-400">Mentoring Since</p>
                          <p className="text-white text-sm font-medium">2021</p>
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-3 glass-dark rounded-lg">
                          <Users className="h-5 w-5 text-secondary-100 mb-2" />
                          <p className="text-xs text-gray-400">Available Slots</p>
                          <p className="text-white text-sm font-medium">
                            {mentor.maxMentees && mentor.menteeCount !== undefined
                              ? Math.max(0, mentor.maxMentees - mentor.menteeCount)
                              : "Limited"}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="gradient" 
                        size="lg" 
                        className="w-full"
                        onClick={handleRequestConnection}
                        disabled={mentor.maxMentees !== undefined && 
                                 mentor.menteeCount !== undefined && 
                                 mentor.menteeCount >= mentor.maxMentees}
                      >
                        Request Mentorship
                      </Button>
                    </>
                  )}
                </CardContent>
                <CardFooter className="border-t border-secondary-100/10 bg-primary-80/30 px-6 py-4 relative z-10">
                  <p className="text-xs text-gray-400">
                    By requesting mentorship, you agree to maintain professional communication 
                    and respect the mentor&apos;s time and expertise.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-white mb-2">Mentor Not Found</h2>
            <p className="text-gray-300 mb-6">
              The mentor you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Button variant="gradient" asChild>
              <Link href="/alumni/mentoring">View All Mentors</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 