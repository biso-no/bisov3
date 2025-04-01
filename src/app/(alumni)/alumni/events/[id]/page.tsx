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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <p className="text-muted-foreground mt-2">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => router.push('/alumni/events')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
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
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1" 
          asChild
        >
          <Link href="/alumni/events">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Link>
        </Button>
      </div>
      
      <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <Badge 
            variant="outline" 
            className={cn(
              "bg-background/80 backdrop-blur-sm font-medium mb-2",
              event.category === "Networking" && "border-blue-500/70 text-blue-500",
              event.category === "Education" && "border-purple-500/70 text-purple-500",
              event.category === "Career" && "border-green-500/70 text-green-500",
              event.category === "Mentoring" && "border-amber-500/70 text-amber-500",
              event.category === "Entrepreneurship" && "border-red-500/70 text-red-500",
            )}
          >
            {event.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{event.title}</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.longDescription}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {event.schedule.length > 0 && (
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-32 shrink-0 font-medium">{item.time}</div>
                      <div>{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {event.speakers.length > 0 && (
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Speakers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={speaker.image} />
                        <AvatarFallback>{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{speaker.name}</div>
                        <div className="text-sm text-muted-foreground">{speaker.title}</div>
                        <p className="text-sm mt-1">{speaker.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Date and Time</div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(event.date), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {event.location}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.address}
                    </div>
                    {event.online && (
                      <Badge variant="outline" className="mt-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <Globe className="h-3 w-3 mr-1" />
                        Online Event
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Organizer</div>
                    <div className="text-sm text-muted-foreground">
                      {event.organizer}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.organizerContact}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Attendees</div>
                    <div className="text-sm text-muted-foreground">
                      {event.attendees} / {event.maxAttendees} registered
                    </div>
                    <div className="w-full h-2 bg-muted mt-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {event.price && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Price</div>
                      <div className="text-sm text-muted-foreground">
                        {event.price}
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {registered ? (
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <UserCheck className="h-6 w-6 mx-auto text-green-500" />
                    <p className="font-medium text-green-500 mt-1">You&apos;re registered!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check your email for confirmation details
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full" 
                    disabled={isRegistrationClosed || isFull}
                    onClick={handleRegister}
                  >
                    Register Now
                  </Button>
                )}
                
                {isRegistrationClosed && !registered && (
                  <p className="text-xs text-center text-muted-foreground">
                    Registration closed on {format(registrationDeadline, "MMM d, yyyy")}
                  </p>
                )}
                
                {isFull && !registered && !isRegistrationClosed && (
                  <p className="text-xs text-center text-muted-foreground">
                    This event is at full capacity
                  </p>
                )}
                
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {event.online && (
            <Card className="border-primary/10 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-500" />
                  Online Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  This is a virtual event happening on Zoom. A link will be sent to registered participants prior to the event.
                </p>
                {registered && (
                  <Button className="w-full mt-4">
                    Join Event
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 