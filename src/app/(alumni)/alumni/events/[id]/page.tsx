"use client"

import { useParams, useRouter } from "next/navigation"
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Calendar, 
  ArrowLeft,
  UserCheck,
  Globe,
  Building
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getEvent } from "../../actions"
import { Event } from "@/lib/types/alumni"

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [registered, setRegistered] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEvent(params.id as string);
      setEvent(event);
    };
    fetchEvent();
  }, [params.id]);
  
  if (!event) {
    return (
      <div className="relative min-h-screen pb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
          <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-gold-default/5 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-140 h-140 rounded-full bg-secondary-100/5 blur-3xl" />
        </div>
        
        <div className="container max-w-5xl pt-8 pb-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-gold-default/20 animate-pulse"></div>
              <div className="relative z-10 p-5 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                <Calendar className="h-12 w-12 text-gold-default" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Event Not Found</h1>
            <p className="text-gray-300 max-w-md text-center">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button 
              variant="gradient" 
              className="mt-4"
              onClick={() => router.push('/alumni/events')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const registrationDeadline = parseISO(event.registrationDeadline);
  const isRegistrationClosed = registrationDeadline < new Date(new Date().setHours(0, 0, 0, 0));
  const isFull = event.attendees >= event.maxAttendees;
  
  const handleRegister = () => {
    setRegistered(true);
    // In a real app, you would make an API call to register the user
  };
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-140 h-140 rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <div className="container max-w-5xl pt-8 pb-8 space-y-6">
        <div className="flex items-center">
          <Button 
            variant="glass" 
            size="sm" 
            className="gap-1 border border-secondary-100/10" 
            asChild
          >
            <Link href="/alumni/events">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events</span>
            </Link>
          </Button>
        </div>
        
        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
          <div className="absolute inset-0 bg-linear-to-t from-primary-100 via-primary-100/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <Badge 
              variant={
                event.category === "Networking" ? "gradient" : 
                event.category === "Education" ? "purple" : 
                event.category === "Career" ? "green" : 
                event.category === "Mentoring" ? "gold" : 
                "destructive"
              }
              className="mb-3"
            >
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">About This Event</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <p className="text-gray-300 whitespace-pre-line">
                    {event.longDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {event.schedule.length > 0 && (
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-gold-default/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gold-default" />
                    Event Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex gap-4 p-3 rounded-md hover:bg-white/5 transition-colors">
                        <div className="w-32 shrink-0 font-medium text-gold-default">{item.time}</div>
                        <div className="text-gray-300">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {event.speakers.length > 0 && (
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-secondary-100/10 to-blue-accent/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-secondary-100" />
                    Speakers
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex gap-4 p-3 rounded-md hover:bg-white/5 transition-colors">
                        <div className="relative group">
                          <div className="absolute -inset-1 rounded-full bg-linear-to-br from-blue-accent/50 to-secondary-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <Avatar className="h-12 w-12 border-2 border-primary-90 relative shadow-sm group-hover:shadow-glow-blue transition-all duration-300">
                            <AvatarImage src={speaker.image} />
                            <AvatarFallback className="bg-primary-80 text-white">{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="font-medium text-white">{speaker.name}</div>
                          <div className="text-sm text-secondary-100">{speaker.title}</div>
                          <p className="text-sm mt-1 text-gray-300">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                      <CalendarDays className="h-5 w-5 text-blue-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Date and Time</div>
                      <div className="text-sm text-gray-300">
                        {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
                      </div>
                      <div className="text-sm text-gray-300">
                        {format(parseISO(event.date), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                      <MapPin className="h-5 w-5 text-gold-default" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Location</div>
                      <div className="text-sm text-gray-300">
                        {event.location}
                      </div>
                      <div className="text-sm text-gray-300">
                        {event.address}
                      </div>
                      {event.online && (
                        <Badge variant="outline" className="mt-2 bg-blue-accent/10 text-blue-accent border-blue-accent/20">
                          <Globe className="h-3 w-3 mr-1" />
                          Online Event
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                      <Building className="h-5 w-5 text-secondary-100" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Organizer</div>
                      <div className="text-sm text-gray-300">
                        {event.organizer}
                      </div>
                      <div className="text-sm text-gray-300">
                        {event.organizerContact}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                      <Users className="h-5 w-5 text-secondary-100" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Attendees</div>
                      <div className="text-sm text-gray-300">
                        {event.attendees} / {event.maxAttendees} registered
                      </div>
                      <div className="w-full h-2 bg-primary-80/50 mt-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-linear-to-r from-gold-default to-gold-strong" 
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {event.price && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                        <Calendar className="h-5 w-5 text-blue-accent" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Price</div>
                        <div className="text-sm text-gray-300">
                          {event.price}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="bg-white/10" />
                  
                  {registered ? (
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <UserCheck className="h-6 w-6 mx-auto text-green-500" />
                      <p className="font-medium text-green-500 mt-2">You&apos;re registered!</p>
                      <p className="text-sm text-gray-300 mt-1">
                        Check your email for confirmation details
                      </p>
                    </div>
                  ) : (
                    <Button
                      variant="gradient"
                      className="w-full" 
                      disabled={isRegistrationClosed || isFull}
                      onClick={handleRegister}
                    >
                      Register Now
                    </Button>
                  )}
                  
                  {isRegistrationClosed && !registered && (
                    <p className="text-xs text-center text-gray-400">
                      Registration closed on {format(registrationDeadline, "MMM d, yyyy")}
                    </p>
                  )}
                  
                  {isFull && !registered && !isRegistrationClosed && (
                    <p className="text-xs text-center text-gray-400">
                      This event is at full capacity
                    </p>
                  )}
                  
                  <Button variant="glass" className="w-full border border-secondary-100/10" onClick={() => {}}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {event.online && (
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-accent" />
                    Online Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-gray-300">
                    This is a virtual event happening on Zoom. A link will be sent to registered participants prior to the event.
                  </p>
                  {registered && (
                    <Button variant="gradient" className="w-full mt-4">
                      Join Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 