"use client"

import { useEffect, useState } from "react"
import { Check, Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Mentor } from "@/lib/types/alumni"
import { getMentors } from "../actions"


// Extract all unique expertise areas and industries from mentors


export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [mentors, setMentors] = useState<Mentor[]>([])

  useEffect(() => {
    const fetchMentors = async () => {
      const fetchedMentors = await getMentors();
      setMentors(fetchedMentors);
    };
    fetchMentors();
  }, []);

  const allExpertiseAreas = Array.from(
    new Set(mentors.flatMap(mentor => mentor.expertise))
  ).sort();
  
  const allIndustries = Array.from(
    new Set(mentors.flatMap(mentor => mentor.industries))
  ).sort();
  
  const filteredMentors = mentors.filter(mentor => {
    // Search query filter
    if (searchQuery && 
        !mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Expertise filter
    if (selectedExpertise.length > 0 && 
        !mentor.expertise.some(exp => selectedExpertise.includes(exp))) {
      return false;
    }
    
    // Industry filter
    if (selectedIndustries.length > 0 && 
        !mentor.industries.some(ind => selectedIndustries.includes(ind))) {
      return false;
    }
    
    return true;
  });
  
  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise) 
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
  };
  
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };
  
  const clearFilters = () => {
    setSelectedExpertise([]);
    setSelectedIndustries([]);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Mentors</h1>
        <p className="text-muted-foreground mt-2">
          Connect with experienced alumni who are available to mentor and guide you in your career journey
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search mentors by name, title, company, or expertise..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:w-[180px] gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {(selectedExpertise.length > 0 || selectedIndustries.length > 0) && (
                <Badge variant="secondary" className="ml-1">
                  {selectedExpertise.length + selectedIndustries.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[340px] sm:w-[480px]">
            <SheetHeader>
              <SheetTitle>Filter Mentors</SheetTitle>
              <SheetDescription>
                Find the perfect mentor by filtering based on expertise and industry
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Filters Applied</h3>
                {(selectedExpertise.length > 0 || selectedIndustries.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-3 text-xs">
                    Clear All
                  </Button>
                )}
              </div>
              
              {(selectedExpertise.length > 0 || selectedIndustries.length > 0) ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedExpertise.map(exp => (
                    <Badge key={exp} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                      {exp}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full"
                        onClick={() => toggleExpertise(exp)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {selectedIndustries.map(ind => (
                    <Badge key={ind} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                      {ind}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full"
                        onClick={() => toggleIndustry(ind)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-6">No filters applied</p>
              )}
              
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Expertise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {allExpertiseAreas.map(expertise => (
                      <div key={expertise} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`expertise-${expertise}`} 
                          checked={selectedExpertise.includes(expertise)}
                          onCheckedChange={() => toggleExpertise(expertise)}
                        />
                        <label
                          htmlFor={`expertise-${expertise}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {expertise}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Industry</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {allIndustries.map(industry => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`industry-${industry}`} 
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={() => toggleIndustry(industry)}
                        />
                        <label
                          htmlFor={`industry-${industry}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <Card className="bg-background/60 border-primary/10">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            Displaying <span className="font-medium text-foreground">{filteredMentors.length}</span> mentors
          </div>
        </CardContent>
      </Card>
      
      {selectedExpertise.length > 0 || selectedIndustries.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedExpertise.map(exp => (
            <Badge key={exp} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
              {exp}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => toggleExpertise(exp)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedIndustries.map(ind => (
            <Badge key={ind} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
              {ind}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => toggleIndustry(ind)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {(selectedExpertise.length > 0 || selectedIndustries.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-3 text-xs">
              Clear All
            </Button>
          )}
        </div>
      ) : null}
      
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.$id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No mentors found</p>
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
  )
}

interface MentorCardProps {
  mentor: Mentor
}

function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatarUrl} />
            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-lg">{mentor.name}</CardTitle>
            <CardDescription className="text-sm line-clamp-1">
              {mentor.title} at {mentor.company}
            </CardDescription>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{mentor.location}</span>
              <span>•</span>
              <span>Graduated {mentor.graduationYear}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-5 flex-1">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {mentor.bio}
          </p>
          
          <div>
            <h4 className="text-xs font-medium mb-2">EXPERTISE</h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map(exp => (
                <Badge key={exp} variant="outline" className="text-xs">
                  {exp}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-medium mb-2">INDUSTRY FOCUS</h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.industries.map(ind => (
                <Badge key={ind} variant="secondary" className="text-xs">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm pt-1">
            <div>
              <div className="font-medium flex items-center">
                {mentor.rating}
                <div className="flex ml-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      className={cn(
                        "h-3.5 w-3.5",
                        star <= Math.round(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                      )}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {mentor.reviewCount} reviews
              </div>
            </div>
            
            <div>
              <div className="font-medium">{mentor.availability} hours</div>
              <div className="text-xs text-muted-foreground">per month</div>
            </div>
            
            <div>
              <div className="font-medium">{mentor.menteeCount}/{mentor.maxMentees}</div>
              <div className="text-xs text-muted-foreground">mentees</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 flex items-center justify-between border-t bg-muted/10 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex">
                {mentor.languages.slice(0, 3).map((lang, index) => (
                  <Badge 
                    key={lang} 
                    variant="outline" 
                    className={cn(
                      "text-xs rounded-full px-2 border-primary/20",
                      index > 0 && "-ml-1",
                    )}
                  >
                    {lang}
                  </Badge>
                ))}
                {mentor.languages.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs rounded-full px-2 border-primary/20 -ml-1"
                  >
                    +{mentor.languages.length - 3}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Languages: {mentor.languages.join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button asChild>
          <Link href={`/alumni/mentors/${mentor.$id}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 