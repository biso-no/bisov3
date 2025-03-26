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
import { useState } from "react"

// Mock data for events - should be moved to a central data store or API
const events = [
  {
    id: "event-001",
    title: "Annual Alumni Reunion & Networking",
    description: "Join us for our annual alumni reunion and networking event. This is your chance to reconnect with fellow alumni, make new connections, and celebrate our community&apos;s achievements.",
    longDescription: "The Annual Alumni Reunion & Networking event is one of our most anticipated gatherings of the year. This elegant evening at the Oslo Opera House brings together alumni from all graduating classes for a night of reconnection, celebration, and networking. \n\nThe evening will begin with a welcome reception featuring hors d&apos;oeuvres and drinks, followed by a keynote speech from a distinguished alumnus. Throughout the night, you&apos;ll have ample opportunity to network with fellow graduates, faculty members, and industry professionals. \n\nThis year&apos;s event will also include a special recognition ceremony for alumni who have made notable contributions to their fields or the community.",
    category: "Networking",
    date: "2023-09-15T18:00:00Z",
    endDate: "2023-09-15T22:00:00Z",
    location: "Oslo Opera House, Oslo",
    address: "Kirsten Flagstads Plass 1, 0150 Oslo",
    attendees: 124,
    maxAttendees: 200,
    online: false,
    registrationRequired: true,
    registrationDeadline: "2023-09-10T23:59:59Z",
    featured: true,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    organizer: "BISO Alumni Committee",
    organizerContact: "alumni@biso.no",
    price: "500 NOK",
    schedule: [
      { time: "18:00 - 18:30", activity: "Welcome Reception" },
      { time: "18:30 - 19:15", activity: "Keynote Speech" },
      { time: "19:15 - 20:30", activity: "Networking & Dinner" },
      { time: "20:30 - 21:00", activity: "Alumni Recognition Ceremony" },
      { time: "21:00 - 22:00", activity: "Continued Networking & Closing" }
    ],
    speakers: [
      { 
        name: "Nina Johansen", 
        title: "CEO, TechNova", 
        bio: "Nina is a 2005 graduate who has led TechNova to become one of Norway's fastest-growing technology companies.",
        image: "https://randomuser.me/api/portraits/women/42.jpg" 
      }
    ]
  },
  {
    id: "event-002",
    title: "Tech Industry Panel Discussion",
    description: "A panel discussion with industry leaders about the future of technology and digital transformation. Learn from experts and engage in thought-provoking discussions.",
    longDescription: "This online panel discussion brings together leading experts in the technology industry to discuss current trends, future directions, and the impact of digital transformation across various sectors. Our distinguished panelists will share their insights on artificial intelligence, blockchain, cybersecurity, and more. \n\nThe session will include a moderated discussion followed by an interactive Q&A where attendees can pose questions directly to the panelists. This is an excellent opportunity to gain valuable perspectives from industry leaders and to network with professionals sharing similar interests.",
    category: "Education",
    date: "2023-06-22T19:00:00Z",
    endDate: "2023-06-22T21:00:00Z",
    location: "Online",
    address: "Zoom Webinar",
    attendees: 78,
    maxAttendees: 300,
    online: true,
    registrationRequired: true,
    registrationDeadline: "2023-06-22T18:00:00Z",
    featured: false,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    organizer: "BISO Tech Committee",
    organizerContact: "tech@biso.no",
    price: "Free",
    schedule: [
      { time: "19:00 - 19:10", activity: "Introduction of Panelists" },
      { time: "19:10 - 20:15", activity: "Panel Discussion" },
      { time: "20:15 - 21:00", activity: "Q&A Session" }
    ],
    speakers: [
      { 
        name: "Erik Lundberg", 
        title: "CTO, FinTech Solutions", 
        bio: "Erik has over 15 years of experience in fintech and leads technology innovation at FinTech Solutions.",
        image: "https://randomuser.me/api/portraits/men/22.jpg" 
      },
      { 
        name: "Maria Solberg", 
        title: "Head of AI Research, Nordic Tech", 
        bio: "Maria specializes in AI applications for business and has published numerous papers on machine learning algorithms.",
        image: "https://randomuser.me/api/portraits/women/65.jpg" 
      },
      { 
        name: "Thomas Berg", 
        title: "Cybersecurity Expert, Secure Systems", 
        bio: "Thomas advises corporations and governments on cybersecurity strategy and incident response.",
        image: "https://randomuser.me/api/portraits/men/32.jpg" 
      }
    ]
  },
  {
    id: "event-003",
    title: "Career Development Workshop",
    description: "Learn about career advancement strategies from HR professionals and industry leaders. This workshop will cover resume building, interview techniques, and networking strategies.",
    longDescription: "This intensive workshop is designed to provide you with practical tools and strategies for advancing your career. Led by experienced HR professionals and industry leaders, the session will cover essential aspects of professional development.\n\nTopics will include crafting a compelling resume that stands out to employers, mastering interview techniques for various formats (traditional, behavioral, and case interviews), and developing effective networking strategies in today's digital age.\n\nParticipants will engage in hands-on exercises, receive personalized feedback, and leave with actionable steps to enhance their career prospects. This workshop is ideal for recent graduates, professionals considering a career change, or anyone looking to advance in their current field.",
    category: "Career",
    date: "2023-07-10T14:00:00Z",
    endDate: "2023-07-10T16:00:00Z",
    location: "Campus Main Building, Room 302, Oslo",
    address: "Nydalsveien 37, 0484 Oslo",
    attendees: 45,
    maxAttendees: 50,
    online: false,
    registrationRequired: true,
    registrationDeadline: "2023-07-09T23:59:59Z",
    featured: false,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    organizer: "BISO Career Center",
    organizerContact: "career@biso.no",
    price: "200 NOK",
    schedule: [
      { time: "14:00 - 14:15", activity: "Introduction and Workshop Overview" },
      { time: "14:15 - 14:45", activity: "Resume Building Masterclass" },
      { time: "14:45 - 15:15", activity: "Interview Techniques and Practice" },
      { time: "15:15 - 15:45", activity: "Networking Strategies" },
      { time: "15:45 - 16:00", activity: "Q&A and Closing Remarks" }
    ],
    speakers: [
      { 
        name: "Helena Bjørk", 
        title: "HR Director, Global Corp", 
        bio: "Helena has 20+ years of experience in talent acquisition and development across multiple industries.",
        image: "https://randomuser.me/api/portraits/women/28.jpg" 
      },
      { 
        name: "Andreas Lie", 
        title: "Career Coach", 
        bio: "Andreas specializes in helping professionals navigate career transitions and develop personal branding strategies.",
        image: "https://randomuser.me/api/portraits/men/56.jpg" 
      }
    ]
  },
  {
    id: "event-004",
    title: "Alumni Mentor Program Launch",
    description: "Join us for the official launch of our Alumni Mentor Program. Learn how you can become a mentor to current students or find a mentor to guide your career.",
    longDescription: "We are excited to announce the official launch of the BISO Alumni Mentor Program, a structured initiative designed to connect experienced alumni with students and recent graduates seeking professional guidance.\n\nDuring this launch event, you&apos;ll learn about the program&apos;s framework, expectations for mentors and mentees, and the application process. We&apos;ll showcase success stories from our pilot program and provide detailed information on how mentoring relationships are formed and supported.\n\nWhether you&apos;re an established professional looking to give back to the community by becoming a mentor, or a student/recent graduate seeking guidance from someone who has navigated similar career paths, this event will provide you with all the information needed to participate in this valuable program.",
    category: "Mentoring",
    date: "2023-08-05T17:30:00Z",
    endDate: "2023-08-05T19:30:00Z",
    location: "BI Norwegian Business School, Auditorium 1, Oslo",
    address: "Nydalsveien 37, 0484 Oslo",
    attendees: 67,
    maxAttendees: 100,
    online: false,
    registrationRequired: true,
    registrationDeadline: "2023-08-04T23:59:59Z",
    featured: true,
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    organizer: "BISO Alumni Advisory Board",
    organizerContact: "mentoring@biso.no",
    price: "Free",
    schedule: [
      { time: "17:30 - 17:45", activity: "Welcome and Introduction" },
      { time: "17:45 - 18:15", activity: "Presentation of the Mentor Program" },
      { time: "18:15 - 18:45", activity: "Alumni Mentor Success Stories Panel" },
      { time: "18:45 - 19:15", activity: "Q&A and Application Process Explanation" },
      { time: "19:15 - 19:30", activity: "Networking and Refreshments" }
    ],
    speakers: [
      { 
        name: "Lars Nilsen", 
        title: "Alumni Relations Director", 
        bio: "Lars oversees all alumni engagement initiatives and has developed mentor programs for several educational institutions.",
        image: "https://randomuser.me/api/portraits/men/76.jpg" 
      },
      { 
        name: "Sofie Andersen", 
        title: "Mentor Program Coordinator", 
        bio: "Sofie has matched over 200 mentor pairs and facilitates mentor training workshops.",
        image: "https://randomuser.me/api/portraits/women/90.jpg" 
      }
    ]
  },
  {
    id: "event-005",
    title: "Entrepreneurship Spotlight",
    description: "Showcasing successful entrepreneurs from our alumni community. Hear their stories, challenges, and insights into building successful businesses.",
    longDescription: "This special event highlights the entrepreneurial spirit within our alumni community by showcasing graduates who have successfully launched and grown their own businesses. Through a series of TED-style talks, our alumni entrepreneurs will share their journey from idea to execution, the challenges they faced, and key lessons learned along the way.\n\nThe event provides a unique opportunity to hear authentic stories of business creation across various industries, from technology startups to service businesses, retail ventures, and social enterprises. Speakers will discuss funding strategies, market entry approaches, team building, and how they overcame critical obstacles.\n\nIn addition to the inspiring talks, there will be a networking session where attendees can connect with the speakers and other entrepreneurially-minded alumni. Whether you&apos;re currently running your own business, considering entrepreneurship as a career path, or simply interested in the startup ecosystem, this event offers valuable insights and connections.",
    category: "Entrepreneurship",
    date: "2023-07-18T18:00:00Z",
    endDate: "2023-07-18T20:00:00Z",
    location: "Startup Hub, Bergen",
    address: "Thormøhlens Gate 51, 5006 Bergen",
    attendees: 52,
    maxAttendees: 80,
    online: false,
    registrationRequired: true,
    registrationDeadline: "2023-07-17T23:59:59Z",
    featured: false,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    organizer: "BISO Entrepreneurship Network",
    organizerContact: "entrepreneurs@biso.no",
    price: "250 NOK",
    schedule: [
      { time: "18:00 - 18:15", activity: "Welcome and Introduction" },
      { time: "18:15 - 19:15", activity: "Entrepreneur Spotlight Talks" },
      { time: "19:15 - 19:45", activity: "Panel Discussion: Keys to Success" },
      { time: "19:45 - 20:00", activity: "Q&A and Networking" }
    ],
    speakers: [
      { 
        name: "Jonas Olsen", 
        title: "Founder & CEO, EcoTech Solutions", 
        bio: "Jonas launched his sustainable technology company three years after graduation and has secured over €2M in venture funding.",
        image: "https://randomuser.me/api/portraits/men/36.jpg" 
      },
      { 
        name: "Kari Bakken", 
        title: "Co-founder, HealthApp", 
        bio: "Kari&apos;s digital health platform now serves over 50,000 users across Scandinavia.",
        image: "https://randomuser.me/api/portraits/women/42.jpg" 
      },
      { 
        name: "Fredrik Hansen", 
        title: "Founder, Craft Brewery Chain", 
        bio: "Fredrik turned his passion project into a successful chain of craft breweries with locations in three Norwegian cities.",
        image: "https://randomuser.me/api/portraits/men/43.jpg" 
      }
    ]
  },
  {
    id: "event-006",
    title: "International Alumni Mixer",
    description: "A virtual event connecting BISO alumni from around the world. Share your experiences, network, and learn about global opportunities.",
    longDescription: "This virtual event brings together BISO alumni from across the globe for an evening of international networking and connection. Designed to bridge geographical distances, the International Alumni Mixer provides a platform for graduates living and working in different countries to connect, share experiences, and explore global opportunities.\n\nThe program includes structured networking sessions where participants will be placed in small breakout rooms based on regions, industries, or graduating classes. This format ensures meaningful conversations and connections. We&apos;ll also feature alumni spotlights from different regions, sharing their international career journeys and insights about professional life in various countries.\n\nWhether you&apos;re considering an international move, seeking global business connections, or simply want to expand your network beyond national borders, this event offers a valuable opportunity to connect with fellow alumni worldwide.",
    category: "Networking",
    date: "2023-08-25T19:00:00Z",
    endDate: "2023-08-25T21:00:00Z",
    location: "Online",
    address: "Zoom Meeting",
    attendees: 94,
    maxAttendees: 200,
    online: true,
    registrationRequired: true,
    registrationDeadline: "2023-08-25T18:00:00Z",
    featured: false,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    organizer: "BISO Global Alumni Network",
    organizerContact: "global@biso.no",
    price: "Free",
    schedule: [
      { time: "19:00 - 19:15", activity: "Welcome and Overview" },
      { time: "19:15 - 19:45", activity: "Alumni Spotlights: International Careers" },
      { time: "19:45 - 20:30", activity: "Breakout Networking Sessions" },
      { time: "20:30 - 21:00", activity: "Open Networking and Closing" }
    ],
    speakers: [
      { 
        name: "Ingrid Haugen", 
        title: "Marketing Director, US Tech Company (Based in New York)", 
        bio: "Ingrid graduated in 2010 and has built her career across three continents.",
        image: "https://randomuser.me/api/portraits/women/17.jpg" 
      },
      { 
        name: "Sven Eriksen", 
        title: "Finance Manager, Global Bank (Based in Singapore)", 
        bio: "Sven specializes in international finance and has worked in both Europe and Asia.",
        image: "https://randomuser.me/api/portraits/men/67.jpg" 
      },
      { 
        name: "Lisa Monsen", 
        title: "Entrepreneur (Based in Berlin)", 
        bio: "Lisa founded her tech startup in Berlin after working for several European companies.",
        image: "https://randomuser.me/api/portraits/women/35.jpg" 
      }
    ]
  }
]

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [registered, setRegistered] = useState(false);
  
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  const event = events.find(e => e.id === eventId);
  
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