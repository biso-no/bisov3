"use client"
import { useState, useEffect } from "react"
import { CalendarDays, Filter, MapPin, Users, Clock, Search, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react"
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
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"


export default function EventsPage() {
  const [view, setView] = useState("list")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
  
  useEffect(() => {
    // Set document title
    document.title = "Alumni Events | BISO";
    
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-140 h-140 rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <section className="container max-w-5xl p-8">
        <PageHeader
          gradient
          heading="Alumni Events"
          subheading="Connect and engage with the BISO Alumni community through our events and gatherings"
        />
      
        <Card variant="glass-dark" className="border-0 overflow-hidden mt-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-gold-default/10 via-secondary-100/10 to-gold-default/10 opacity-20"></div>
          <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-gold-default/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <CalendarDays className="h-6 w-6 text-gold-default" />
              </div>
              <h3 className="text-xl font-medium text-white">Upcoming Events</h3>
              <p className="text-sm text-gray-300">Browse and register for upcoming alumni events, networking opportunities, and workshops</p>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-secondary-100/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <Clock className="h-6 w-6 text-secondary-100" />
              </div>
              <h3 className="text-xl font-medium text-white">Virtual Events</h3>
              <p className="text-sm text-gray-300">Join our online community events and webinars from anywhere in the world</p>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-blue-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <Users className="h-6 w-6 text-blue-accent" />
              </div>
              <h3 className="text-xl font-medium text-white">Alumni Gatherings</h3>
              <p className="text-sm text-gray-300">Connect with fellow alumni at social gatherings, reunions, and exclusive networking sessions</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          {/* Enhanced search field */}
          <div className="flex-1 relative group">
            {/* Refined glow effects */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-gold-default/20 via-secondary-100/20 to-gold-default/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-md backdrop-blur-sm border border-secondary-100/20 group-hover:border-secondary-100/30 group-focus-within:border-secondary-100/50 transition-all duration-300"></div>
            
            {/* Input content with updated styles */}
            <div className="relative flex items-center backdrop-blur-0">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-gold-default/10 group-focus-within:bg-gold-default/20 transition-all duration-300">
                <Search className="h-3.5 w-3.5 text-gold-default" />
              </div>
              <Input
                type="search"
                placeholder="Search events by name, description, or location..."
                className="pl-12 pr-10 py-6 bg-transparent shadow-none border-0 h-12 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent' }}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center rounded-full bg-primary-70/50 text-gray-300 hover:text-white hover:bg-gold-default/30"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="sr-only">Clear search</span>
                  ×
                </Button>
              )}
            </div>
          </div>
          
          {/* Enhanced category select */}
          <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
            <SelectTrigger 
              className="w-[180px] glass-dark border-secondary-100/20 group hover:border-secondary-100/30 text-gray-300 h-12 px-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-all duration-300">
                  <Filter className="h-3.5 w-3.5 text-secondary-100" />
                </div>
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
              <SelectItem value="all" className="focus:bg-gold-default/20">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="focus:bg-gold-default/20">{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Enhanced tabs */}
          <Tabs defaultValue="list" className="w-[200px]" onValueChange={setView}>
            <TabsList className="w-full grid grid-cols-2 glass-dark backdrop-blur-md border border-secondary-100/20 p-1 h-12">
              <TabsTrigger 
                value="list" 
                className={cn(
                  "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                  view === "list" ? "bg-linear-to-r from-gold-default/70 to-gold-strong/70 text-primary-100 rounded font-medium" : "text-gray-400"
                )}
              >
                List
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className={cn(
                  "data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                  view === "calendar" ? "bg-linear-to-r from-gold-default/70 to-gold-strong/70 text-primary-100 rounded font-medium" : "text-gray-400"
                )}
              >
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      
      <section className="container max-w-5xl p-8">
        {/* Enhanced count card */}
        <Card variant="glass-dark" className="mb-6 border-0 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-gold-default/10 to-secondary-100/10 opacity-30" />
          <CardContent className="p-4 z-10 relative">
            <div className="text-sm text-gray-300">
              Displaying <span className="font-medium text-white mx-1">{filteredEvents.length}</span> events
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Featured Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeaturedEventCardSkeleton />
                <FeaturedEventCardSkeleton />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </div>
            </div>
          </div>
        ) : view === "list" ? (
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
              <EmptyEventsState onClearFilters={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <Card variant="glass-dark" className="md:col-span-5 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-white">Events Calendar</CardTitle>
                <CardDescription className="text-gray-300">
                  Browse events by date
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border border-secondary-100/20 mx-auto"
                  classNames={{
                    day_today: "bg-blue-accent/20 text-white font-semibold",
                    day_selected: "bg-linear-to-br from-gold-default to-gold-strong text-primary-100! font-bold",
                    day_outside: "text-gray-500 opacity-50",
                    day: "text-gray-200 hover:bg-primary-80 hover:text-white transition-colors",
                    head_cell: "text-gray-400",
                    caption: "text-white",
                    nav_button: "border border-secondary-100/20 bg-primary-80/50 text-gray-300 hover:bg-primary-70 hover:text-white transition-colors"
                  }}
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
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-default animate-pulse" />
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </CardContent>
            </Card>
            
            <Card variant="glass-dark" className="md:col-span-2 border-0">
              <div className="absolute inset-0 bg-linear-to-br from-secondary-100/10 to-gold-default/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-white">
                  {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {date ? (
                    `Events on ${format(date, "MMM d")}`
                  ) : (
                    "Choose a date to see events"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
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
                        <div key={event.$id} className="text-sm group glass p-3 rounded-lg hover:bg-primary-80/30 transition-colors">
                          <div className="font-medium text-white group-hover:text-secondary-100 transition-colors">{event.title}</div>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-2">
                            <div className="p-1 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                              <Clock className="h-3 w-3 text-secondary-100" />
                            </div>
                            <span>{format(parseISO(event.date), "h:mm a")}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-1.5">
                            <div className="p-1 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                              <MapPin className="h-3 w-3 text-gold-default" />
                            </div>
                            <span className="truncate">{event.location}</span>
                          </div>
                          <Button 
                            variant="gradient" 
                            size="sm" 
                            className="w-full mt-3" 
                            asChild
                          >
                            <Link href={`/alumni/events/${event.$id}`}>
                              View details
                            </Link>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 glass rounded-lg p-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gold-default/10 flex items-center justify-center mb-3">
                          <CalendarIcon className="h-6 w-6 text-gold-default" />
                        </div>
                        <p className="text-gray-300 text-sm">No events on this date</p>
                        <Button variant="ghost" size="sm" className="mt-3 gradient-text text-xs" onClick={() => setDate(new Date())}>
                          View today&apos;s events
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </div>
  )
}

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b opacity-80"
        style={{
          background: event.category === "Networking" ? "linear-gradient(to bottom, #1A77E9, #01417B)" :
                     event.category === "Education" ? "linear-gradient(to bottom, #a855f7, #7e22ce)" :
                     event.category === "Career" ? "linear-gradient(to bottom, #10b981, #059669)" :
                     event.category === "Mentoring" ? "linear-gradient(to bottom, #F7D64A, #BD9E16)" :
                     "linear-gradient(to bottom, #ef4444, #b91c1c)"
        }}
      />
      
      <CardContent className="p-6 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="shrink-0 flex items-center justify-center">
            <div className="rounded-lg overflow-hidden glass-dark p-1 border border-secondary-100/20 shadow-glow-blue">
              <div className="w-16 h-16 flex flex-col items-center justify-center">
                <span className="text-xs text-secondary-100">
                  {format(parseISO(event.date), "MMM").toUpperCase()}
                </span>
                <span className="text-2xl text-white">
                  {format(parseISO(event.date), "dd")}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg text-white group-hover:text-secondary-100 transition-colors">
                    {event.title}
                  </h3>
                  <Badge 
                    variant={
                      event.category === "Networking" ? "gradient" :
                      event.category === "Education" ? "purple" :
                      event.category === "Career" ? "green" :
                      event.category === "Mentoring" ? "gold" :
                      "destructive"
                    }
                    className="ml-2 whitespace-nowrap"
                  >
                    {event.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">{event.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-accent" />
                </div>
                <span>{format(parseISO(event.date), "E, MMM d, yyyy")}</span>
              </div>
              <span className="hidden sm:inline-block text-gray-500">•</span>
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                  <Clock className="h-3.5 w-3.5 text-secondary-100" />
                </div>
                <span>{format(parseISO(event.date), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}</span>
              </div>
              <span className="hidden sm:inline-block text-gray-500">•</span>
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-gold-default" />
                </div>
                <span>{event.location}</span>
              </div>
              <span className="hidden sm:inline-block text-gray-500">•</span>
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                  <Users className="h-3.5 w-3.5 text-secondary-100" />
                </div>
                <span>{event.attendees}/{event.maxAttendees} attending</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button variant="gradient" className="gap-1" asChild>
                <Link href={`/alumni/events/${event.$id}`}>
                  Register Now
                </Link>
              </Button>
              <Button variant="glass" className="backdrop-blur-sm" asChild>
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
    <Card variant="glass-dark" className="overflow-hidden border-0 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary-90 via-primary-90/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <Badge 
            variant={
              event.category === "Networking" ? "gradient" :
              event.category === "Education" ? "purple" :
              event.category === "Career" ? "green" :
              event.category === "Mentoring" ? "gold" :
              "destructive"
            }
            className="backdrop-blur-sm border border-white/10 font-medium"
          >
            {event.category}
          </Badge>
          
          <div className="bg-primary-80/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white flex items-center gap-1">
            <Users className="h-3 w-3 text-secondary-100" />
            <span>{event.attendees} attending</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-5 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-linear-to-br from-gold-default/20 to-transparent opacity-30 blur-3xl"></div>
        
        <h3 className="font-medium text-xl truncate text-white group-hover:text-secondary-100 transition-colors">{event.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2 mt-2 h-10">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
              <CalendarDays className="h-3 w-3 text-blue-accent" />
            </div>
            <span>{format(parseISO(event.date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
              <Clock className="h-3 w-3 text-secondary-100" />
            </div>
            <span>{format(parseISO(event.date), "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <div className="p-1.5 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
              <MapPin className="h-3 w-3 text-gold-default" />
            </div>
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t border-secondary-100/10 bg-primary-80/30">
        <Button variant="gradient" className="w-full gap-1 group" asChild>
          <Link href={`/alumni/events/${event.$id}`} className="flex items-center">
            Register Now
            <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function EventCardSkeleton() {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 group">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b opacity-80"
        style={{
          background: "linear-gradient(to bottom, #1A77E9, #01417B)"
        }}
      />
      
      <CardContent className="p-6 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="shrink-0 flex items-center justify-center">
            <Skeleton className="rounded-lg w-[80px] h-[80px]" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-24 ml-2" />
                </div>
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 text-sm">
              <Skeleton className="h-5 w-32" />
              <span className="hidden sm:inline-block text-gray-500">•</span>
              <Skeleton className="h-5 w-40" />
              <span className="hidden sm:inline-block text-gray-500">•</span>
              <Skeleton className="h-5 w-32" />
              <span className="hidden sm:inline-block text-gray-500">•</span>
              <Skeleton className="h-5 w-28" />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedEventCardSkeleton() {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 group">
      <Skeleton className="h-48 w-full" />
      
      <CardContent className="p-5 relative">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40 col-span-2" />
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t border-secondary-100/10 bg-primary-80/30">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

// Empty state component for no events
interface EmptyEventsStateProps {
  onClearFilters: () => void;
}

function EmptyEventsState({ onClearFilters }: EmptyEventsStateProps) {
  return (
    <Card variant="glass-dark" className="border-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-gold-default/10 to-secondary-100/10 opacity-20" />
      <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full blur-xl bg-gold-default/20 animate-pulse"></div>
          <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
            <CalendarIcon className="h-10 w-10 text-gold-default" />
          </div>
        </div>
        <p className="text-xl font-medium text-white mb-3">No events found</p>
        <p className="text-gray-300 max-w-md mb-6 text-center">Try adjusting your search criteria or filters to find events in our calendar.</p>
        <Button 
          variant="gradient" 
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
} 