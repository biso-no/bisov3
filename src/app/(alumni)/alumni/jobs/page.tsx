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

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Job Board</h1>
        <p className="text-muted-foreground mt-2">
          Discover career opportunities from the BISO Alumni network and top employers
        </p>
      </div>
      
      <Card className="border-primary/10 overflow-hidden bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs by title, company, or keywords..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your job search results
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Job Type</h4>
                    {types.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeChange(type)}
                        />
                        <label 
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Work Mode</h4>
                    {workModes.map(mode => (
                      <div key={mode} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`mode-${mode}`} 
                          checked={selectedWorkModes.includes(mode)}
                          onCheckedChange={() => handleWorkModeChange(mode)}
                        />
                        <label 
                          htmlFor={`mode-${mode}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {mode}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="alumni-only" 
                      checked={showAlumniOnly}
                      onCheckedChange={(checked) => setShowAlumniOnly(checked as boolean)}
                    />
                    <label 
                      htmlFor="alumni-only"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Posted by Alumni
                    </label>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 lg:w-2/5 space-y-4">
          <div className="text-sm text-muted-foreground mb-2">
            Found {filteredJobs.length} job opportunities
          </div>
          
          <div className="space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard 
                  key={job.$id} 
                  job={job} 
                  onClick={() => setActiveJobId(job.$id)} 
                  active={job.$id === activeJobId}
                />
              ))
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-medium">No jobs found</p>
                  <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
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
          {activeJob ? (
            <Card className="sticky top-24 border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{activeJob.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="font-medium">{activeJob.company}</span> • {activeJob.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/alumni/jobs/${activeJob.$id}`} target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="py-1 px-2">
                      <Briefcase className="h-3.5 w-3.5 mr-1 inline-flex" />
                      {activeJob.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="py-1 px-2">
                      <Building className="h-3.5 w-3.5 mr-1 inline-flex" />
                      {activeJob.workMode}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{activeJob.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart4 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{activeJob.experience} experience</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{activeJob.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Responsibilities</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                      {activeJob.responsibilities.map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Qualifications</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                      {activeJob.qualifications.map((qualification, index) => (
                        <li key={index}>{qualification}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Posted: {formatPostedDate(activeJob.postedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Apply by: {format(new Date(activeJob.applicationDeadline), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 flex justify-between">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/alumni/companies/${activeJob.company.toLowerCase().replace(/\s+/g, '-')}`}>
                    About {activeJob.company}
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/alumni/jobs/${activeJob.$id}`} target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-primary/10 h-[75vh] flex items-center justify-center bg-muted/20">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Briefcase className="h-16 w-16 text-primary/20 mb-4" />
                <h3 className="text-xl font-medium">Select a job</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Click on a job listing to view detailed information about the role, responsibilities, and application process.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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
      className={cn(
        "overflow-hidden hover:border-primary/20 transition-all cursor-pointer",
        active 
          ? "border-primary ring-1 ring-primary/20 ring-offset-1 ring-offset-background" 
          : "border-primary/10"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/50 flex-shrink-0 border">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${job.companyLogo})` }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-medium truncate">{job.title}</h3>
              {job.featured && (
                <Badge variant="default" className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 border-none">
                  Featured
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 truncate">{job.company} • {job.location}</p>
            
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                {job.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {job.workMode}
              </Badge>
              {job.alumni && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                  Alumni
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>{formatPostedDate(job.postedDate)}</span>
              <div className="flex items-center">
                <ArrowRight className="h-3.5 w-3.5 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 