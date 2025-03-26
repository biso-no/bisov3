"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Briefcase, GraduationCap, Calendar } from "lucide-react"
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
import { AlumniCard } from "@/components/alumni/alumni-card"
import { AlumniGrid } from "@/components/alumni/alumni-grid"
import { AlumniList } from "@/components/alumni/alumni-list"
import { AlumniMap } from "@/components/alumni/alumni-map"

export default function NetworkPage() {
  const [view, setView] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    graduationYears: [],
    departments: [],
    locations: [],
    industries: []
  })
  
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px]">
            <DropdownMenuLabel>Filter Alumni</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Graduation Year</DropdownMenuLabel>
              <div className="p-2 grid grid-cols-2 gap-2">
                {['2023', '2022', '2021', '2020', '2019', '2018'].map((year) => (
                  <div key={year} className="flex items-center gap-2">
                    <Checkbox id={`year-${year}`} />
                    <label htmlFor={`year-${year}`} className="text-sm">{year}</label>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Department</DropdownMenuLabel>
              <div className="p-2 space-y-2">
                {['Business Administration', 'Computer Science', 'Economics', 'Marketing', 'Finance'].map((dept) => (
                  <div key={dept} className="flex items-center gap-2">
                    <Checkbox id={`dept-${dept}`} />
                    <label htmlFor={`dept-${dept}`} className="text-sm">{dept}</label>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Location</DropdownMenuLabel>
              <div className="p-2 space-y-2">
                {['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'International'].map((location) => (
                  <div key={location} className="flex items-center gap-2">
                    <Checkbox id={`location-${location}`} />
                    <label htmlFor={`location-${location}`} className="text-sm">{location}</label>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs pt-2">Industry</DropdownMenuLabel>
              <div className="p-2 space-y-2">
                {['Technology', 'Finance', 'Consulting', 'Healthcare', 'Education', 'Government'].map((industry) => (
                  <div key={industry} className="flex items-center gap-2">
                    <Checkbox id={`industry-${industry}`} />
                    <label htmlFor={`industry-${industry}`} className="text-sm">{industry}</label>
                  </div>
                ))}
              </div>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <div className="p-2 flex justify-between">
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Select defaultValue="recent">
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
      
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
          All Alumni <button className="ml-2 text-xs">×</button>
        </Badge>
        <Badge variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
          Oslo <button className="ml-2 text-xs">×</button>
        </Badge>
        <Badge variant="outline" className="rounded-md px-3 py-1 bg-primary/5">
          Class of 2023 <button className="ml-2 text-xs">×</button>
        </Badge>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Clear all filters
        </Button>
      </div>
      
      <Card className="bg-background/60 border-primary/10">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            Displaying <span className="font-medium text-foreground">248</span> alumni
          </div>
        </CardContent>
      </Card>
      
      {view === "grid" && <AlumniGrid />}
      {view === "list" && <AlumniList />}
      {view === "map" && <AlumniMap />}
    </div>
  )
} 