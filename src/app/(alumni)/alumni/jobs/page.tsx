"use client"

import { useEffect, useState } from "react"
import { Search, MapPin, Briefcase, Building, Calendar, Clock, ArrowUpRight, Filter, BookmarkPlus, ExternalLink, Banknote, BarChart4, ArrowRight } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { Job } from "@/lib/types/alumni"
import { getJobs } from "../actions"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/ui/page-header"


// Helper function to format posted date
function formatPostedDate(dateString: string) {
  const postedDate = new Date(dateString);
  const daysAgo = differenceInDays(new Date(), postedDate);
  
  if (daysAgo === 0) {
    return "Today";
  } else if (daysAgo === 1) {
    return "Yesterday";
  } else if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  } else {
    return format(postedDate, "MMM d, yyyy");
  }
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([])
  const [showAlumniOnly, setShowAlumniOnly] = useState(false)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set document title
    document.title = "Alumni Job Board | BISO";
    
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await getJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);
  
  const categories = Array.from(new Set(jobs.map(job => job.category)))
  const types = Array.from(new Set(jobs.map(job => job.type)))
  const workModes = Array.from(new Set(jobs.map(job => job.workMode)))
  
  const activeJob = activeJobId ? jobs.find(job => job.$id === activeJobId) : null
  
  const filteredJobs = jobs.filter(job => {
    // Search query filter
    if (searchQuery && 
        !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Category filter
    if (selectedCategory && job.category !== selectedCategory) {
      return false
    }
    
    // Job type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(job.type)) {
      return false
    }
    
    // Work mode filter
    if (selectedWorkModes.length > 0 && !selectedWorkModes.includes(job.workMode)) {
      return false
    }
    
    // Alumni filter
    if (showAlumniOnly && !job.alumni) {
      return false
    }
    
    return true
  })

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    )
  }
  
  const handleWorkModeChange = (mode: string) => {
    setSelectedWorkModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode) 
        : [...prev, mode]
    )
  }
  
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedTypes([])
    setSelectedWorkModes([])
    setShowAlumniOnly(false)
  }

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <section className="container p-8">
        <PageHeader
          gradient
          heading="Alumni Job Board"
          subheading="Discover career opportunities from the BISO Alumni network and top employers"
        />
      
        <Card variant="glass-dark" className="border-0 overflow-hidden mt-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 via-secondary-100/10 to-blue-accent/10 opacity-20"></div>
          <CardContent className="p-6 md:p-8 relative z-10">
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
                    placeholder="Search jobs by title, company, or keywords..."
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
              
              <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                <SelectTrigger 
                  className="w-[180px] glass-dark border-secondary-100/20 group hover:border-secondary-100/30 text-gray-300 h-12 px-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-all duration-300">
                      <Briefcase className="h-3.5 w-3.5 text-secondary-100" />
                    </div>
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                  <SelectItem value="all" className="focus:bg-blue-accent/20">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="focus:bg-blue-accent/20">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="glass" 
                    className="h-12 gap-2 backdrop-blur-sm border border-secondary-100/20 hover:border-secondary-100/40 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                    <SheetDescription className="text-gray-300">
                      Refine your job search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-white">Job Type</h4>
                      {types.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`type-${type}`} 
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => handleTypeChange(type)}
                          />
                          <label 
                            htmlFor={`type-${type}`}
                            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-secondary-100/10" />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-white">Work Mode</h4>
                      {workModes.map(mode => (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mode-${mode}`} 
                            checked={selectedWorkModes.includes(mode)}
                            onCheckedChange={() => handleWorkModeChange(mode)}
                          />
                          <label 
                            htmlFor={`mode-${mode}`}
                            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {mode}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-secondary-100/10" />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="alumni-only" 
                        checked={showAlumniOnly}
                        onCheckedChange={(checked) => setShowAlumniOnly(checked as boolean)}
                      />
                      <label 
                        htmlFor="alumni-only"
                        className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Posted by Alumni
                      </label>
                    </div>
                  </div>
                  <SheetFooter>
                    <Button variant="glass" onClick={clearFilters}>Clear All</Button>
                    <SheetClose asChild>
                      <Button variant="gradient">Apply Filters</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="md:w-1/2 lg:w-2/5 space-y-4">
            <Card variant="glass-dark" className="border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 via-secondary-100/10 to-blue-accent/10 opacity-20" />
              <CardContent className="p-4 z-10 relative">
                <div className="text-sm text-gray-300">
                  Found <span className="font-medium text-white mx-1">{filteredJobs.length}</span> job opportunities
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.$id} 
                    job={job} 
                    onClick={() => setActiveJobId(job.$id)} 
                    active={job.$id === activeJobId}
                  />
                ))
              ) : (
                <Card variant="glass-dark" className="border-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/10 opacity-20" />
                  <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                      <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                        <Briefcase className="h-10 w-10 text-blue-accent" />
                      </div>
                    </div>
                    <p className="text-xl font-medium text-white mb-3">No jobs found</p>
                    <p className="text-gray-300 max-w-md mb-6 text-center">No jobs match your current search criteria. Try adjusting your filters or search terms.</p>
                    <Button 
                      variant="gradient" 
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 lg:w-3/5">
            {isLoading ? (
              <JobDetailSkeleton />
            ) : activeJob ? (
              <Card variant="glass-dark" className="sticky top-24 border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-white">{activeJob.title}</CardTitle>
                      <CardDescription className="mt-1 text-gray-300">
                        <span className="font-medium">{activeJob.company}</span> • {activeJob.location}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="glass" size="sm" className="border border-secondary-100/20 hover:border-secondary-100/40 transition-colors">
                        <BookmarkPlus className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="gradient" size="sm" asChild>
                        <Link href={`/alumni/jobs/${activeJob.$id}`} target="_blank" rel="noopener noreferrer">
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="py-1 px-2 border-blue-accent/20 bg-blue-accent/5">
                        <div className="flex items-center">
                          <Briefcase className="h-3.5 w-3.5 mr-1 text-blue-accent" />
                          <span>{activeJob.type}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="py-1 px-2 border-secondary-100/20 bg-secondary-100/5">
                        <div className="flex items-center">
                          <Building className="h-3.5 w-3.5 mr-1 text-secondary-100" />
                          <span>{activeJob.workMode}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                        <Banknote className="h-3.5 w-3.5 text-blue-accent" />
                      </div>
                      <span>{activeJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                        <BarChart4 className="h-3.5 w-3.5 text-secondary-100" />
                      </div>
                      <span>{activeJob.experience} experience</span>
                    </div>
                  </div>
                  
                  <Separator className="bg-secondary-100/10" />
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-white mb-2">Description</h3>
                      <p className="text-sm text-gray-300">{activeJob.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-white mb-2">Responsibilities</h3>
                      <ul className="space-y-1.5 text-sm text-gray-300 list-disc list-inside">
                        {activeJob.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-white mb-2">Qualifications</h3>
                      <ul className="space-y-1.5 text-sm text-gray-300 list-disc list-inside">
                        {activeJob.qualifications.map((qualification, index) => (
                          <li key={index}>{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Separator className="bg-secondary-100/10" />
                  
                  <div className="flex items-center justify-between gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-md bg-blue-accent/10 transition-colors">
                        <Calendar className="h-3.5 w-3.5 text-blue-accent" />
                      </div>
                      <span>Posted: {formatPostedDate(activeJob.postedDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-md bg-secondary-100/10 transition-colors">
                        <Clock className="h-3.5 w-3.5 text-secondary-100" />
                      </div>
                      <span>Apply by: {format(new Date(activeJob.applicationDeadline), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-secondary-100/10 bg-primary-80/30 relative z-10 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-primary-80/50" asChild>
                    <Link href={`/alumni/companies/${activeJob.company.toLowerCase().replace(/\s+/g, '-')}`}>
                      About {activeJob.company}
                    </Link>
                  </Button>
                  <Button variant="gradient" size="sm" asChild>
                    <Link href={`/alumni/jobs/${activeJob.$id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Apply Now <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card variant="glass-dark" className="border-0 h-[75vh] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardContent className="flex flex-col items-center text-center p-6 relative z-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                    <div className="relative z-10 p-5 rounded-full bg-blue-accent/10 backdrop-blur-sm border border-secondary-100/20">
                      <Briefcase className="h-12 w-12 text-blue-accent" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white">Select a job</h3>
                  <p className="text-gray-300 mt-2 max-w-md">
                    Click on a job listing to view detailed information about the role, responsibilities, and application process.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

interface JobCardProps {
  job: Job
  active?: boolean
  onClick?: () => void
}

function JobCard({ job, active = false, onClick }: JobCardProps) {
  return (
    <Card 
      variant="glass-dark"
      className={cn(
        "overflow-hidden border-0 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-card-hover",
        active 
          ? "ring-1 ring-blue-accent/30 ring-offset-1 ring-offset-primary-90" 
          : "border-0"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
      <CardContent className="p-4 relative z-10">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-primary-80/50 flex-shrink-0 border border-secondary-100/20">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${job.companyLogo})` }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-medium truncate text-white">{job.title}</h3>
              {job.featured && (
                <Badge variant="gradient" className="ml-2">
                  Featured
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-300 mt-1 truncate">{job.company} • {job.location}</p>
            
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="bg-blue-accent/5 border-blue-accent/20 text-xs text-blue-accent">
                {job.type}
              </Badge>
              <Badge variant="outline" className="bg-secondary-100/5 border-secondary-100/20 text-xs text-secondary-100">
                {job.workMode}
              </Badge>
              {job.alumni && (
                <Badge variant="outline" className="bg-gold-default/10 text-gold-default border-gold-default/20 text-xs">
                  Alumni
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span>{formatPostedDate(job.postedDate)}</span>
              <div className="flex items-center gap-1 group-hover:text-blue-accent transition-colors">
                <span className="group-hover:text-blue-accent transition-colors">View</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function JobCardSkeleton() {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
      <CardContent className="p-4 relative z-10">
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-md" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 ml-2" />
            </div>
            
            <Skeleton className="h-4 w-full mt-2" />
            
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function JobDetailSkeleton() {
  return (
    <Card variant="glass-dark" className="sticky top-24 border-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="w-full max-w-sm">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        
        <Separator className="bg-secondary-100/10" />
        
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div>
            <Skeleton className="h-5 w-36 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        <Separator className="bg-secondary-100/10" />
        
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-36" />
        </div>
      </CardContent>
      <CardFooter className="border-t border-secondary-100/10 bg-primary-80/30 relative z-10 flex justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  )
} 