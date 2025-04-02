"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Briefcase, GraduationCap, Calendar, Loader2, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlumniCard } from "./_components/alumni-card"
import { AlumniGrid } from "./_components/alumni-grid"
import { AlumniList } from "./_components/alumni-list"
import { AlumniMap } from "./_components/alumni-map"
import { getAlumniProfiles, getAlumniFilterOptions, getAlumniCount } from "../actions"
import { UserProfile } from "@/lib/types/alumni"
import { PageHeader } from "@/components/ui/page-header"
import { cn } from "@/lib/utils"

export default function NetworkPage() {
  const [view, setView] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("recent")
  const [alumniProfiles, setAlumniProfiles] = useState<UserProfile[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<{
    graduationYears: string[],
    departments: string[],
    locations: string[]
  }>({
    graduationYears: [],
    departments: [],
    locations: []
  })
  
  const [filters, setFilters] = useState<{
    graduationYears: string[],
    departments: string[],
    locations: string[],
    industries: string[]
  }>({
    graduationYears: [],
    departments: [],
    locations: [],
    industries: []
  })
  
  // Load filter options on initial page load
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const options = await getAlumniFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    }
    
    async function loadTotalCount() {
      try {
        const count = await getAlumniCount();
        setTotalCount(count);
      } catch (error) {
        console.error("Error loading alumni count:", error);
      }
    }
    
    loadFilterOptions();
    loadTotalCount();
  }, []);
  
  // Load alumni profiles whenever filters or search query changes
  useEffect(() => {
    async function loadAlumniProfiles() {
      try {
        setIsLoading(true);
        const profiles = await getAlumniProfiles(searchQuery, filters, sortOption);
        setAlumniProfiles(profiles);
      } catch (error) {
        console.error("Error loading alumni profiles:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Add a slight debounce for search
    const debounceTimeout = setTimeout(() => {
      loadAlumniProfiles();
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, filters, sortOption]);
  
  // Handle checkbox changes for filters
  const handleFilterChange = (category: 'graduationYears' | 'departments' | 'locations' | 'industries', value: string, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        // Add the value to the filter array
        return {
          ...prev,
          [category]: [...prev[category], value]
        };
      } else {
        // Remove the value from the filter array
        return {
          ...prev,
          [category]: prev[category].filter(item => item !== value)
        };
      }
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      graduationYears: [],
      departments: [],
      locations: [],
      industries: []
    });
    setSearchQuery("");
  };
  
  // Remove a specific filter
  const removeFilter = (category: 'graduationYears' | 'departments' | 'locations' | 'industries', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }));
  };
  
  // Get the active filter count
  const activeFilterCount = 
    filters.graduationYears.length + 
    filters.departments.length + 
    filters.locations.length + 
    filters.industries.length +
    (searchQuery ? 1 : 0);
  
  return (
    <div className="relative min-h-screen pb-12 bg-primary-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <section className="container pt-8 pb-8">
        <PageHeader
          gradient
          heading="Alumni Network"
          subheading="Connect with fellow alumni from around the world to expand your professional network"
          actions={
            <>
              <Button variant="glass-dark">Request Connection</Button>
              <Button variant="gradient">Join Groups</Button>
            </>
          }
        />
        
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <div className="flex-1 relative group">
            {/* Refined glow effects */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-accent/20 via-secondary-100/20 to-blue-accent/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-md backdrop-blur-sm border border-secondary-100/20 group-hover:border-secondary-100/30 group-focus-within:border-secondary-100/50 transition-all duration-300"></div>
            
            {/* Input content with updated styles */}
            <div className="relative flex items-center backdrop-blur-0">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-blue-accent/10 group-focus-within:bg-blue-accent/20 transition-all duration-300">
                <Search className="h-3.5 w-3.5 text-secondary-100" />
              </div>
              <Input
                type="search"
                placeholder="Search by name, class, department, company, or keyword..."
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="glass-dark" 
                className="flex gap-2 group hover:border-secondary-100/30 border-secondary-100/20 h-12 px-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-all duration-300">
                    <Filter className="h-3.5 w-3.5 text-secondary-100" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Filters</span>
                </div>
                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-center min-w-5 h-5 rounded-full bg-blue-accent text-xs font-medium text-white">
                    {activeFilterCount}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px] glass-dark border-secondary-100/20 backdrop-blur-md">
              <DropdownMenuLabel className="text-secondary-100">Filter Alumni</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-secondary-100/20" />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs pt-2 text-gray-300">Graduation Year</DropdownMenuLabel>
                <div className="p-2 grid grid-cols-2 gap-2">
                  {filterOptions.graduationYears.map((year) => (
                    <div key={year} className="flex items-center gap-2 group">
                      <Checkbox 
                        id={`year-${year}`} 
                        checked={filters.graduationYears.includes(year)}
                        onCheckedChange={(checked) => 
                          handleFilterChange('graduationYears', year, checked === true)
                        }
                        className="data-[state=checked]:bg-blue-accent data-[state=checked]:border-blue-accent"
                      />
                      <label htmlFor={`year-${year}`} className="text-sm text-gray-300 group-hover:text-white transition-colors">{year}</label>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-secondary-100/20" />
              </DropdownMenuGroup>
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs pt-2 text-gray-300">Department</DropdownMenuLabel>
                <div className="p-2 space-y-2">
                  {filterOptions.departments.map((dept) => (
                    <div key={dept} className="flex items-center gap-2 group">
                      <Checkbox 
                        id={`dept-${dept}`} 
                        checked={filters.departments.includes(dept)}
                        onCheckedChange={(checked) => 
                          handleFilterChange('departments', dept, checked === true)
                        }
                        className="data-[state=checked]:bg-secondary-100 data-[state=checked]:border-secondary-100"
                      />
                      <label htmlFor={`dept-${dept}`} className="text-sm text-gray-300 group-hover:text-white transition-colors">{dept}</label>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-secondary-100/20" />
              </DropdownMenuGroup>
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs pt-2 text-gray-300">Location</DropdownMenuLabel>
                <div className="p-2 space-y-2">
                  {filterOptions.locations.map((location) => (
                    <div key={location} className="flex items-center gap-2 group">
                      <Checkbox 
                        id={`location-${location}`} 
                        checked={filters.locations.includes(location)}
                        onCheckedChange={(checked) => 
                          handleFilterChange('locations', location, checked === true)
                        }
                        className="data-[state=checked]:bg-gold-default data-[state=checked]:border-gold-default"
                      />
                      <label htmlFor={`location-${location}`} className="text-sm text-gray-300 group-hover:text-white transition-colors">{location}</label>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-secondary-100/20" />
              </DropdownMenuGroup>
              
              <div className="p-2 flex justify-between">
                <Button variant="glass" size="sm" onClick={clearAllFilters}>
                  Reset
                </Button>
                <Button variant="gradient" size="sm">
                  Apply Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Select 
            value={sortOption}
            onValueChange={setSortOption}
          >
            <SelectTrigger 
              className="w-[180px] glass-dark border-secondary-100/20 group hover:border-secondary-100/30 text-gray-300 h-12 px-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gold-default/10 group-hover:bg-gold-default/20 transition-all duration-300">
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gold-default" />
                </div>
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
              <SelectItem value="recent" className="focus:bg-blue-accent/20">Recently Active</SelectItem>
              <SelectItem value="name-asc" className="focus:bg-blue-accent/20">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc" className="focus:bg-blue-accent/20">Name (Z-A)</SelectItem>
              <SelectItem value="year-desc" className="focus:bg-blue-accent/20">Graduation Year (Recent)</SelectItem>
              <SelectItem value="year-asc" className="focus:bg-blue-accent/20">Graduation Year (Oldest)</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs defaultValue="grid" className="w-[200px]" onValueChange={setView}>
            <TabsList className="w-full grid grid-cols-3 glass-dark backdrop-blur-md border border-secondary-100/20 p-1 h-12">
              <TabsTrigger 
                value="grid" 
                className={cn(
                  "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                  view === "grid" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded" : "text-gray-400"
                )}
              >
                Grid
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className={cn(
                  "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                  view === "list" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded" : "text-gray-400"
                )}
              >
                List
              </TabsTrigger>
              <TabsTrigger 
                value="map" 
                className={cn(
                  "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                  view === "map" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded" : "text-gray-400"
                )}
              >
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      
      <section className="container">
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500">
            {searchQuery && (
              <Badge variant="glass-dark" className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-blue-accent/20 transition-colors group">
                <Search className="h-3 w-3 text-blue-accent" /> 
                <span>{searchQuery}</span> 
                <button 
                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center text-xs bg-blue-accent/20 text-blue-accent group-hover:bg-blue-accent group-hover:text-white transition-colors" 
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.graduationYears.map(year => (
              <Badge key={`year-${year}`} variant="glass-dark" className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-secondary-100/20 transition-colors group">
                <GraduationCap className="h-3 w-3 text-secondary-100" />
                <span>Class of {year}</span>
                <button 
                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center text-xs bg-secondary-100/20 text-secondary-100 group-hover:bg-secondary-100 group-hover:text-white transition-colors" 
                  onClick={() => removeFilter('graduationYears', year)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.departments.map(dept => (
              <Badge key={`dept-${dept}`} variant="glass-dark" className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-blue-accent/20 transition-colors group">
                <Briefcase className="h-3 w-3 text-blue-accent" />
                <span>{dept}</span>
                <button 
                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center text-xs bg-blue-accent/20 text-blue-accent group-hover:bg-blue-accent group-hover:text-white transition-colors" 
                  onClick={() => removeFilter('departments', dept)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            {filters.locations.map(location => (
              <Badge key={`loc-${location}`} variant="glass-dark" className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-gold-default/20 transition-colors group">
                <MapPin className="h-3 w-3 text-gold-default" />
                <span>{location}</span>
                <button 
                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center text-xs bg-gold-default/20 text-gold-default group-hover:bg-gold-default group-hover:text-primary-100 transition-colors" 
                  onClick={() => removeFilter('locations', location)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            <Button variant="glass-dark" size="sm" className="h-auto py-1.5 text-xs group hover:bg-blue-accent/20 transition-colors" onClick={clearAllFilters}>
              <span className="gradient-text group-hover:opacity-80 transition-opacity">Clear all filters</span>
            </Button>
          </div>
        )}
        
        <Card variant="glass-dark" className="mb-6 border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 to-secondary-100/10 opacity-30" />
          <CardContent className="p-4 z-10 relative">
            <div className="text-sm text-gray-300">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-secondary-100" />
                  <span>Loading alumni profiles...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  Displaying <span className="font-medium text-white mx-1">{alumniProfiles.length}</span> 
                  {' '}of <span className="font-medium text-white mx-1">{totalCount}</span> alumni
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg bg-blue-accent/30 animate-pulse"></div>
              <Loader2 className="h-10 w-10 animate-spin text-secondary-100 relative z-10" />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in-50 duration-500">
            {view === "grid" && <AlumniGrid alumni={alumniProfiles} />}
            {view === "list" && <AlumniList alumni={alumniProfiles} />}
            {view === "map" && <AlumniMap alumni={alumniProfiles} />}
          </div>
        )}
      </section>
    </div>
  )
}