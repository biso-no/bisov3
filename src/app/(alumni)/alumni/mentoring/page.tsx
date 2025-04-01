"use client"

import { useEffect, useState } from "react"
import { Search, Filter, UserRound, Sparkles, Briefcase, GraduationCap, ArrowRight, Calendar, Medal, Lightbulb, Clock, MapPin, Users } from "lucide-react"
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
        setMentoringPrograms(fetchedPrograms);
        setIsLoadingPrograms(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingMentors(false);
        setIsLoadingPrograms(false);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Mentoring</h1>
        <p className="text-muted-foreground mt-2">
          Connect with experienced alumni mentors for career guidance and professional development
        </p>
      </div>
      
      <Card className="border-none bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
        <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <UserRound className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Find a Mentor</h3>
            <p className="text-sm text-muted-foreground">Connect with industry experts who can guide your career journey and professional development</p>
          </div>
          
          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Join Programs</h3>
            <p className="text-sm text-muted-foreground">Participate in structured mentoring programs designed for specific career stages and goals</p>
          </div>
          
          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Become a Mentor</h3>
            <p className="text-sm text-muted-foreground">Share your expertise and give back to the alumni community by mentoring the next generation</p>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="find-mentor" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find-mentor">Find a Mentor</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="become-mentor">Become a Mentor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="find-mentor" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search mentors by name, expertise, or background..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedIndustry || "all"} onValueChange={(value) => setSelectedIndustry(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
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
            <div className="text-center py-12">
              <p className="text-muted-foreground">No mentors found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="programs" className="space-y-6">
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
            <div className="text-center py-12">
              <p className="text-muted-foreground">No mentoring programs are currently available.</p>
              <p className="text-sm text-muted-foreground mt-2">Please check back later or contact the alumni office for more information.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="become-mentor" className="space-y-6">
          <Card className="border border-primary/10">
            <CardHeader>
              <CardTitle>Share Your Expertise</CardTitle>
              <CardDescription>
                Make a meaningful impact by mentoring students and alumni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 space-y-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Flexible Commitment</h3>
                  <p className="text-sm text-muted-foreground">Choose your availability and mentoring format that works with your schedule</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 space-y-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Personal Growth</h3>
                  <p className="text-sm text-muted-foreground">Develop leadership skills and gain new perspectives through mentoring relationships</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 space-y-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Medal className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Community Impact</h3>
                  <p className="text-sm text-muted-foreground">Help shape the next generation of professionals and strengthen the alumni network</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <h3 className="text-xl font-medium">Ready to Make a Difference?</h3>
                <p className="text-muted-foreground max-w-2xl">
                  By becoming a mentor, you&apos;ll join a community of dedicated alumni who are helping to shape the future of our graduates.
                </p>
                <Button size="lg" className="mt-4" asChild>
                  <Link href="/alumni/mentoring/apply">
                    Apply to Become a Mentor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
    <Card className="overflow-hidden border border-primary/10 hover:border-primary/20 transition-colors group h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background">
            <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              <Link 
                href={`/alumni/mentoring/${mentor.$id}`}
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {mentor.name}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1">{mentor.title} {mentor.company ? `at ${mentor.company}` : ''}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          {mentor.industry && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {mentor.industry}
            </Badge>
          )}
          {mentor.graduationYear && (
            <Badge variant="outline" className="bg-muted/50">Class of {mentor.graduationYear}</Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {mentor.bio}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {mentor.experience && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{mentor.experience} years exp.</span>
            </div>
          )}
          {mentor.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{mentor.location}</span>
            </div>
          )}
        </div>
        
        {mentor.expertise && mentor.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {mentor.expertise.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/30">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/20 pt-3">
        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground" asChild>
          <Link href={`/alumni/mentoring/${mentor.$id}`}>
            Connect <ArrowRight className="h-4 w-4 ml-1" />
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
    <Card className="overflow-hidden border border-primary/10 hover:border-primary/20 transition-colors group">
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${program.image || defaultImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          {program.category && (
            <Badge 
              variant="outline" 
              className={cn(
                "bg-background/80 backdrop-blur-sm font-medium",
                program.category === "Career Development" && "border-blue-500/50 text-blue-500",
                program.category === "Leadership" && "border-purple-500/50 text-purple-500",
                program.category === "Entrepreneurship" && "border-amber-500/50 text-amber-500",
              )}
            >
              {program.category}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{program.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">{program.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-muted-foreground">
          {program.startDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Starts: {new Date(program.startDate).toLocaleDateString()}</span>
            </div>
          )}
          {program.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{program.duration}</span>
            </div>
          )}
          {program.spots && (
            <div className="flex items-center gap-1.5 col-span-2">
              <Users className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{program.spotsRemaining || 0}</span>
              <span> of {program.spots} spots remaining</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-muted/20">
        <Button asChild className="w-full">
          <Link href={`/alumni/mentoring/program/${program.$id}`}>
            Apply Now
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