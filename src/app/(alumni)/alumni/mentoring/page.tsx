"use client"

import { useEffect, useState } from "react"
import { Search, Filter, UserRound, Sparkles, Briefcase, GraduationCap, ArrowRight, Calendar as CalendarIcon, Medal, Lightbulb, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Mentor, MentoringProgram } from "@/lib/types/alumni"
import { getMentors, getMentoringPrograms, applyToBeMentor } from "@/app/(alumni)/alumni/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/ui/page-header"

// Mock data for programs until we have the real data
const programs: MentoringProgram[] = [
  {
    $id: "program-001",
    $createdAt: "2023-01-01T00:00:00.000Z",
    $updatedAt: "2023-01-01T00:00:00.000Z",
    $permissions: [],
    $collectionId: "mentoringPrograms",
    $databaseId: "alumni",
    title: "Career Accelerator Program",
    description: "A structured 3-month mentoring program designed to help early-career professionals accelerate their career development through personalized guidance.",
    category: "Career Development",
    duration: "3 months",
    commitment: "4-6 hours per month",
    startDate: "2023-09-01",
    applicationDeadline: "2023-08-15",
    spots: 25,
    spotsRemaining: 8,
    featured: true,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    $id: "program-002",
    $createdAt: "2023-01-01T00:00:00.000Z",
    $updatedAt: "2023-01-01T00:00:00.000Z",
    $permissions: [],
    $collectionId: "mentoringPrograms",
    $databaseId: "alumni",
    title: "Leadership Excellence Initiative",
    description: "Designed for mid-level managers looking to develop advanced leadership skills through mentoring, workshops, and peer learning.",
    category: "Leadership",
    duration: "6 months",
    commitment: "6-8 hours per month",
    startDate: "2023-10-15",
    applicationDeadline: "2023-09-30",
    spots: 20,
    spotsRemaining: 5,
    featured: true,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    $id: "program-003",
    $createdAt: "2023-01-01T00:00:00.000Z",
    $updatedAt: "2023-01-01T00:00:00.000Z",
    $permissions: [],
    $collectionId: "mentoringPrograms",
    $databaseId: "alumni",
    title: "Entrepreneurship Bootcamp",
    description: "An intensive program connecting aspiring entrepreneurs with successful founders and business experts to develop business ideas and startup skills.",
    category: "Entrepreneurship",
    duration: "2 months",
    commitment: "8-10 hours per month",
    startDate: "2023-08-20",
    applicationDeadline: "2023-08-05",
    spots: 15,
    spotsRemaining: 3,
    featured: false,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
];

export default function MentoringPage() {
  const [activeTab, setActiveTab] = useState("find-mentor")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [mentoringPrograms, setMentoringPrograms] = useState<MentoringProgram[]>([])
  const [isLoadingMentors, setIsLoadingMentors] = useState(true)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)

  useEffect(() => {
    // Set document title
    document.title = "Alumni Mentoring | BISO";
    
    const fetchData = async () => {
      try {
        // Fetch mentors
        setIsLoadingMentors(true);
        const fetchedMentors = await getMentors();
        setMentors(fetchedMentors);
        setIsLoadingMentors(false);
        
        // Fetch mentoring programs
        setIsLoadingPrograms(true);
        const fetchedPrograms = await getMentoringPrograms();
        setMentoringPrograms(fetchedPrograms.length > 0 ? fetchedPrograms : programs);
        setIsLoadingPrograms(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingMentors(false);
        setIsLoadingPrograms(false);
        // Fall back to mock data if API fails
        setMentoringPrograms(programs);
      }
    };
    
    fetchData();
  }, []);

  // Get unique industries for the filter
  const industries = Array.from(new Set(mentors.map(mentor => mentor.industry)))
  
  // Filter mentors based on search query and selected industry
  const filteredMentors = mentors.filter(mentor => {
    // Search query filter
    if (searchQuery && 
        !mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.expertise?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Industry filter
    if (selectedIndustry && mentor.industry !== selectedIndustry) {
      return false
    }
    
    return true
  })

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <section className="container pt-8 pb-8">
        <PageHeader
          gradient
          heading="Alumni Mentoring"
          subheading="Connect with experienced alumni mentors for career guidance and professional development"
        />
      
        <Card variant="glass-dark" className="border-0 overflow-hidden mt-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 via-secondary-100/10 to-blue-accent/10 opacity-20"></div>
          <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-blue-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <UserRound className="h-6 w-6 text-blue-accent" />
              </div>
              <h3 className="text-xl font-medium text-white">Find a Mentor</h3>
              <p className="text-sm text-gray-300">Connect with industry experts who can guide your career journey and professional development</p>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-secondary-100/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-secondary-100" />
              </div>
              <h3 className="text-xl font-medium text-white">Join Programs</h3>
              <p className="text-sm text-gray-300">Participate in structured mentoring programs designed for specific career stages and goals</p>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-gold-default/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <GraduationCap className="h-6 w-6 text-gold-default" />
              </div>
              <h3 className="text-xl font-medium text-white">Become a Mentor</h3>
              <p className="text-sm text-gray-300">Share your expertise and give back to the alumni community by mentoring the next generation</p>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="container">
        <Tabs defaultValue="find-mentor" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-dark backdrop-blur-md border border-secondary-100/20 p-1 h-12">
            <TabsTrigger 
              value="find-mentor" 
              className={cn(
                "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                activeTab === "find-mentor" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded font-medium" : "text-gray-400"
              )}
            >
              Find a Mentor
            </TabsTrigger>
            <TabsTrigger 
              value="programs" 
              className={cn(
                "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                activeTab === "programs" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded font-medium" : "text-gray-400"
              )}
            >
              Programs
            </TabsTrigger>
            <TabsTrigger 
              value="become-mentor" 
              className={cn(
                "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                activeTab === "become-mentor" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded font-medium" : "text-gray-400"
              )}
            >
              Become a Mentor
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="find-mentor" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-accent/20 via-secondary-100/20 to-blue-accent/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 rounded-md backdrop-blur-sm border border-secondary-100/20 group-hover:border-secondary-100/30 group-focus-within:border-secondary-100/50 transition-all duration-300"></div>
                
                <div className="relative flex items-center backdrop-blur-0">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-blue-accent/10 group-focus-within:bg-blue-accent/20 transition-all duration-300">
                    <Search className="h-3.5 w-3.5 text-blue-accent" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search mentors by name, expertise, or background..."
                    className="pl-12 pr-10 py-6 bg-transparent shadow-none border-0 h-12 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent' }}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center rounded-full bg-primary-70/50 text-gray-300 hover:text-white hover:bg-blue-accent/30"
                      onClick={() => setSearchQuery("")}
                    >
                      <span className="sr-only">Clear search</span>
                      ×
                    </Button>
                  )}
                </div>
              </div>
              
              <Select value={selectedIndustry || "all"} onValueChange={(value) => setSelectedIndustry(value === "all" ? null : value)}>
                <SelectTrigger 
                  className="w-[180px] glass-dark border-secondary-100/20 group hover:border-secondary-100/30 text-gray-300 h-12 px-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-all duration-300">
                      <Briefcase className="h-3.5 w-3.5 text-secondary-100" />
                    </div>
                    <SelectValue placeholder="All Industries" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                  <SelectItem value="all" className="focus:bg-blue-accent/20">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry} className="focus:bg-blue-accent/20">
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isLoadingMentors ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MentorCardSkeleton />
                <MentorCardSkeleton />
                <MentorCardSkeleton />
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.$id} mentor={mentor} />
                ))}
              </div>
            ) : (
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/10 opacity-20" />
                <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                    <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                      <UserRound className="h-10 w-10 text-blue-accent" />
                    </div>
                  </div>
                  <p className="text-xl font-medium text-white mb-3">No mentors found</p>
                  <p className="text-gray-300 max-w-md mb-6 text-center">No mentors match your current search criteria. Try adjusting your filters or search terms.</p>
                  <Button 
                    variant="gradient" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedIndustry(null);
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="programs" className="space-y-6">
            <Card variant="glass-dark" className="border-0 overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 via-secondary-100/10 to-blue-accent/10 opacity-20"></div>
              <CardContent className="p-6 md:flex items-center justify-between relative z-10">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-medium text-white">Mentoring Programs</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Join structured mentoring programs tailored to specific career paths and professional goals
                  </p>
                </div>
                <Button 
                  variant="glass" 
                  className="backdrop-blur-sm border border-secondary-100/20 hover:border-secondary-100/40 transition-colors"
                  asChild
                >
                  <Link href="/alumni/mentoring/programs/all">
                    View All Programs
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {isLoadingPrograms ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProgramCardSkeleton />
                <ProgramCardSkeleton />
              </div>
            ) : mentoringPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentoringPrograms.map((program) => (
                  <ProgramCard key={program.$id} program={program} />
                ))}
              </div>
            ) : (
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/10 opacity-20" />
                <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                    <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                      <Sparkles className="h-10 w-10 text-blue-accent" />
                    </div>
                  </div>
                  <p className="text-xl font-medium text-white mb-3">No programs available</p>
                  <p className="text-gray-300 max-w-md mb-6 text-center">
                    There are currently no mentoring programs available. Please check back soon for new opportunities.
                  </p>
                  <Button 
                    variant="gradient" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Programs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="become-mentor" className="space-y-6">
            <Card variant="glass-dark" className="border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-default/10 to-blue-accent/10 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-white text-2xl">Share Your Expertise</CardTitle>
                <CardDescription className="text-gray-300">
                  Make a meaningful impact by mentoring students and alumni
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-6 space-y-4 glass rounded-lg border border-secondary-100/10 hover:border-secondary-100/20 transition-all duration-300 group">
                    <div className="h-16 w-16 rounded-full bg-blue-accent/10 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                      <Clock className="h-8 w-8 text-blue-accent" />
                    </div>
                    <h3 className="font-medium text-white text-lg">Flexible Commitment</h3>
                    <p className="text-sm text-gray-300">Choose your availability and mentoring format that works with your schedule</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-6 space-y-4 glass rounded-lg border border-secondary-100/10 hover:border-secondary-100/20 transition-all duration-300 group">
                    <div className="h-16 w-16 rounded-full bg-secondary-100/10 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                      <Lightbulb className="h-8 w-8 text-secondary-100" />
                    </div>
                    <h3 className="font-medium text-white text-lg">Personal Growth</h3>
                    <p className="text-sm text-gray-300">Develop leadership skills and gain new perspectives through mentoring relationships</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-6 space-y-4 glass rounded-lg border border-secondary-100/10 hover:border-secondary-100/20 transition-all duration-300 group">
                    <div className="h-16 w-16 rounded-full bg-gold-default/10 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                      <Medal className="h-8 w-8 text-gold-default" />
                    </div>
                    <h3 className="font-medium text-white text-lg">Community Impact</h3>
                    <p className="text-sm text-gray-300">Help shape the next generation of professionals and strengthen the alumni network</p>
                  </div>
                </div>
                
                <Card variant="glass-dark" className="border border-secondary-100/10 mt-8">
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                      <div className="relative z-10 p-4 rounded-full bg-blue-accent/10 backdrop-blur-sm border border-secondary-100/20">
                        <GraduationCap className="h-10 w-10 text-blue-accent" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-w-2xl">
                      <h3 className="text-2xl font-medium text-white">Ready to Make a Difference?</h3>
                      <p className="text-gray-300">
                        By becoming a mentor, you&apos;ll join a community of dedicated alumni who are helping to shape the future of our graduates. Share your expertise, provide guidance, and create meaningful connections.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        variant="gradient" 
                        size="lg" 
                        className="group"
                        asChild
                      >
                        <Link href="/alumni/mentoring/apply" className="flex items-center gap-2">
                          Apply to Become a Mentor
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="glass" 
                        size="lg"
                        asChild
                      >
                        <Link href="/alumni/mentoring/faq">
                          Learn More About Mentoring
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

interface MentorCardProps {
  mentor: Mentor
}

function MentorCard({ mentor }: MentorCardProps) {
  const initials = mentor.name
    ? mentor.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "ME"
    
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
      <CardHeader className="pb-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-accent/50 to-secondary-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <Avatar className="h-16 w-16 border-2 border-primary-90/50 relative">
              <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
              <AvatarFallback className="text-lg bg-primary-80">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              <Link 
                href={`/alumni/mentoring/${mentor.$id}`}
                className="hover:text-blue-accent transition-colors inline-flex items-center gap-1"
              >
                {mentor.name}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1 text-gray-300">{mentor.title} {mentor.company ? `at ${mentor.company}` : ''}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          {mentor.industry && (
            <Badge variant="gradient" className="border border-blue-accent/20 text-xs">
              {mentor.industry}
            </Badge>
          )}
          {mentor.graduationYear && (
            <Badge variant="outline" className="bg-primary-80/50 text-xs">Class of {mentor.graduationYear}</Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-3 mb-3">
          {mentor.bio}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {mentor.experience && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                <Briefcase className="h-3.5 w-3.5 text-blue-accent" />
              </div>
              <span>{mentor.experience} years exp.</span>
            </div>
          )}
          {mentor.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                <MapPin className="h-3.5 w-3.5 text-secondary-100" />
              </div>
              <span className="truncate">{mentor.location}</span>
            </div>
          )}
        </div>
        
        {mentor.expertise && mentor.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {mentor.expertise.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="outline" className="border-secondary-100/20 text-secondary-100 bg-secondary-100/5 text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-secondary-100/10 bg-primary-80/30 pt-3 relative z-10">
        <Button variant="gradient" className="w-full gap-1 group" asChild>
          <Link href={`/alumni/mentoring/${mentor.$id}`} className="flex items-center">
            Connect 
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ProgramCardProps {
  program: MentoringProgram
}

function ProgramCard({ program }: ProgramCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3";
  
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${program.image || defaultImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-90 via-primary-90/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          {program.category && (
            <Badge 
              variant="outline" 
              className={cn(
                "backdrop-blur-sm font-medium",
                program.category === "Career Development" && "text-blue-accent border-blue-accent/30",
                program.category === "Leadership" && "text-purple-500 border-purple-500/30",
                program.category === "Entrepreneurship" && "text-amber-500 border-amber-500/30",
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
      
      <CardContent className="p-5 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-accent/20 to-transparent opacity-30 blur-3xl"></div>
        
        <h3 className="font-medium text-xl truncate text-white group-hover:text-blue-accent transition-colors">{program.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2 mt-2 h-10">{program.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-gray-400">
          {program.startDate && (
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                <CalendarIcon className="h-3.5 w-3.5 text-blue-accent" />
              </div>
              <span>Starts: {new Date(program.startDate).toLocaleDateString()}</span>
            </div>
          )}
          {program.duration && (
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                <Clock className="h-3.5 w-3.5 text-secondary-100" />
              </div>
              <span>{program.duration}</span>
            </div>
          )}
          {program.spots && (
            <div className="flex items-center gap-1.5 col-span-2">
              <div className="p-1.5 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                <Users className="h-3.5 w-3.5 text-gold-default" />
              </div>
              <span className="text-white font-medium">{program.spotsRemaining || 0}</span>
              <span> of {program.spots} spots remaining</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t border-secondary-100/10 bg-primary-80/30">
        <Button variant="gradient" className="w-full gap-1 group" asChild>
          <Link href={`/alumni/mentoring/program/${program.$id}`} className="flex items-center">
            Apply Now
            <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Skeleton loaders
function MentorCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-primary/10 h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 pt-3">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

function ProgramCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-primary/10">
      <Skeleton className="h-48 w-full" />
      
      <CardContent className="p-4">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40 col-span-2" />
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-muted/20">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}