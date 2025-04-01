"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Briefcase, GraduationCap, Calendar, Loader2 } from "lucide-react"
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
import { getAlumniProfiles, getAlumniFilterOptions, getAlumniCount,  } from "../actions"
import { UserProfile } from "@/lib/types/alumni"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Network</h1>
        <p className="text-muted-foreground mt-2">
          Connect with fellow BISO alumni from around the world
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, class, department, company, or keyword..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 py-0 h-5 min-w-5 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px]">
            <DropdownMenuLabel>Filter Alumni</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Graduation Year</DropdownMenuLabel>
              <div className="p-2 grid grid-cols-2 gap-2">
                {filterOptions.graduationYears.map((year) => (
                  <div key={year} className="flex items-center gap-2">
                    <Checkbox 
                      id={`year-${year}`} 
                      checked={filters.graduationYears.includes(year)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('graduationYears', year, checked === true)
                      }
                    />
                    <label htmlFor={`year-${year}`} className="text-sm">{year}</label>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Department</DropdownMenuLabel>
              <div className="p-2 space-y-2">
                {filterOptions.departments.map((dept) => (
                  <div key={dept} className="flex items-center gap-2">
                    <Checkbox 
                      id={`dept-${dept}`} 
                      checked={filters.departments.includes(dept)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('departments', dept, checked === true)
                      }
                    />
                    <label htmlFor={`dept-${dept}`} className="text-sm">{dept}</label>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Location</DropdownMenuLabel>
              <div className="p-2 space-y-2">
                {filterOptions.locations.map((location) => (
                  <div key={location} className="flex items-center gap-2">
                    <Checkbox 
                      id={`location-${location}`} 
                      checked={filters.locations.includes(location)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('locations', location, checked === true)
                      }
                    />
                    <label htmlFor={`location-${location}`} className="text-sm">{location}</label>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <div className="p-2 flex justify-between">
              <Button variant="outline" size="sm" onClick={clearAllFilters}>Reset</Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Select 
          value={sortOption}
          onValueChange={setSortOption}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Active</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="year-desc">Graduation Year (Recent)</SelectItem>
            <SelectItem value="year-asc">Graduation Year (Oldest)</SelectItem>
          </SelectContent>
        </Select>
        
        <Tabs defaultValue="grid" className="w-[200px]" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {searchQuery && (
            <Badge variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
              Search: {searchQuery} <button className="ml-2 text-xs" onClick={() => setSearchQuery("")}>×</button>
            </Badge>
          )}
          
          {filters.graduationYears.map(year => (
            <Badge key={`year-${year}`} variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
              Class of {year} <button className="ml-2 text-xs" onClick={() => removeFilter('graduationYears', year)}>×</button>
            </Badge>
          ))}
          
          {filters.departments.map(dept => (
            <Badge key={`dept-${dept}`} variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
              {dept} <button className="ml-2 text-xs" onClick={() => removeFilter('departments', dept)}>×</button>
            </Badge>
          ))}
          
          {filters.locations.map(location => (
            <Badge key={`loc-${location}`} variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
              {location} <button className="ml-2 text-xs" onClick={() => removeFilter('locations', location)}>×</button>
            </Badge>
          ))}
          
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={clearAllFilters}>
            Clear all filters
          </Button>
        </div>
      )}
      
      <Card className="bg-background/60 border-primary/10">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading alumni...
              </div>
            ) : (
              <>
                Displaying <span className="font-medium text-foreground">{alumniProfiles.length}</span> 
                {' '}of <span className="font-medium text-foreground">{totalCount}</span> alumni
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {view === "grid" && <AlumniGrid alumni={alumniProfiles} />}
          {view === "list" && <AlumniList alumni={alumniProfiles} />}
          {view === "map" && <AlumniMap alumni={alumniProfiles} />}
        </>
      )}
    </div>
  )
}