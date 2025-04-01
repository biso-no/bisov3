"use client"
import { useState } from "react"
import { CalendarDays, Filter, MapPin, Users, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { format, isSameMonth, isSameDay, parseISO, formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { DayContentProps } from "react-day-picker"
import { getEvents } from "../actions"
import { Event } from "@/lib/types/alumni"


export default function EventsPage() {
  const [view, setView] = useState("list")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const filteredEvents = events.filter(event => {
    // Search query filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Category filter
    if (selectedCategory && event.category !== selectedCategory) {
      return false
    }
    
    // Date filter (only in calendar view)
    if (view === "calendar" && date && !isSameMonth(parseISO(event.date), date)) {
      return false
    }
    
    return true
  })
  
  const categories = Array.from(new Set(events.map(event => event.category)))
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Events</h1>
        <p className="text-muted-foreground mt-2">
          Connect and engage with the BISO Alumni community through our events
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events by name, description, or location..."
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
        
        <Tabs defaultValue="list" className="w-[200px]" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card className="bg-background/60 border-primary/10">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            Displaying <span className="font-medium text-foreground">{filteredEvents.length}</span> events
          </div>
        </CardContent>
      </Card>
      
      {view === "list" ? (
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            <>
              {filteredEvents.filter(e => e.featured).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Featured Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.filter(e => e.featured).map((event) => (
                      <FeaturedEventCard key={event.$id} event={event} />
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {filteredEvents.filter(e => !e.featured).map((event) => (
                    <EventCard key={event.$id} event={event} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium">No events found</p>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <Card className="md:col-span-5 border-primary/10">
            <CardHeader>
              <CardTitle>Events Calendar</CardTitle>
              <CardDescription>
                Browse events by date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
                components={{
                  DayContent: (props: DayContentProps) => {
                    const { date, ...dayProps } = props;
                    const dayHasEvents = events.some(event => {
                      const eventDate = parseISO(event.date);
                      return isSameDay(eventDate, date);
                    });
                    
                    return (
                      <div className="relative h-full w-full p-2">
                        <div className="h-full w-full flex items-center justify-center">
                          {format(date, "d")}
                        </div>
                        {dayHasEvents && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 border-primary/10">
            <CardHeader>
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
              <CardDescription>
                {date ? (
                  `Events on ${format(date, "MMM d")}`
                ) : (
                  "Choose a date to see events"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {date && (
                <div className="space-y-4">
                  {filteredEvents.filter(event => {
                    const eventDate = parseISO(event.date);
                    return isSameDay(eventDate, date);
                  }).length > 0 ? (
                    filteredEvents.filter(event => {
                      const eventDate = parseISO(event.date);
                      return isSameDay(eventDate, date);
                    }).map(event => (
                      <div key={event.$id} className="text-sm">
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(parseISO(event.date), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto mt-1" 
                          asChild
                        >
                          <Link href={`/alumni/events/${event.$id}`}>
                            View details
                          </Link>
                        </Button>
                        <Separator className="my-3" />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm py-4 text-center">
                      No events on this date
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="shrink-0 flex items-center justify-center">
            <div className="rounded-md overflow-hidden border bg-muted/50 p-1">
              <div className="w-16 h-16 flex flex-col items-center justify-center font-medium">
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(event.date), "MMM").toUpperCase()}
                </span>
                <span className="text-2xl">
                  {format(parseISO(event.date), "dd")}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-2 whitespace-nowrap",
                      event.category === "Networking" && "border-blue-500/50 text-blue-500",
                      event.category === "Education" && "border-purple-500/50 text-purple-500",
                      event.category === "Career" && "border-green-500/50 text-green-500",
                      event.category === "Mentoring" && "border-amber-500/50 text-amber-500",
                      event.category === "Entrepreneurship" && "border-red-500/50 text-red-500",
                    )}
                  >
                    {event.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>{format(parseISO(event.date), "E, MMM d, yyyy")}</span>
              </div>
              <span className="hidden sm:inline-block">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{format(parseISO(event.date), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}</span>
              </div>
              <span className="hidden sm:inline-block">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <span className="hidden sm:inline-block">•</span>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{event.attendees}/{event.maxAttendees} attending</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button asChild>
                <Link href={`/alumni/events/${event.$id}`}>
                  Register Now
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/alumni/events/${event.$id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedEventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors group">
      <div className="relative h-40 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge 
            variant="outline" 
            className={cn(
              "bg-background/80 backdrop-blur-sm font-medium",
              event.category === "Networking" && "border-blue-500/70 text-blue-500",
              event.category === "Education" && "border-purple-500/70 text-purple-500",
              event.category === "Career" && "border-green-500/70 text-green-500",
              event.category === "Mentoring" && "border-amber-500/70 text-amber-500",
              event.category === "Entrepreneurship" && "border-red-500/70 text-red-500",
            )}
          >
            {event.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg truncate">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{format(parseISO(event.date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(parseISO(event.date), "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{event.attendees} attending</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-muted/20">
        <Button asChild className="w-full">
          <Link href={`/alumni/events/${event.$id}`}>
            Register Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 