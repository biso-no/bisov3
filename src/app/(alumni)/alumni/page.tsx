import { AlumniStats } from "@/components/alumni/stats"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Quote, 
  Briefcase, 
  MapPin,
  MessageCircle,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Testimonial, UserProfile, Event } from "@/lib/types/alumni"
import { getAlumniProfiles, getEvents, getTestimonials } from "./actions"
import { format } from "date-fns"
import { Query } from "appwrite"

// Helper function to generate avatar initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper function to format dates
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return '';
  }
}

// Helper function to get month and day from date
function getMonthDay(dateString: string): { month: string; day: string } {
  try {
    const date = new Date(dateString);
    return {
      month: format(date, 'MMM'),
      day: format(date, 'd')
    };
  } catch (error) {
    return { month: '', day: '' };
  }
}

export default async function AlumniPage() {
  // Fetch data from database with error handling
  let featuredAlumni: UserProfile[] = [];
  let upcomingEvents: Event[] = [];
  let testimonials: Testimonial[] = [];
  
  try {
    // Try to fetch alumni profiles
    featuredAlumni = await getAlumniProfiles('', {}, 'recent', 4);
    
    // Fetch upcoming events (order by date ascending, limit to next 3)
    const now = new Date().toISOString();
    upcomingEvents = await getEvents([
      Query.greaterThan('date', now),
      Query.orderAsc('date'),
      Query.limit(3)
    ]);
    
    // Fetch testimonials
    testimonials = await getTestimonials();
  } catch (error) {
    console.error("Error fetching data for alumni homepage:", error);
    // We will use the empty arrays which is fine
  }
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      {/* Header */}
      <section className="container pt-8 pb-12">
        <PageHeader
          gradient
          heading="BISO Alumni Network"
          subheading="Connect with our community of graduates and industry professionals"
          actions={
            <>
              <Button variant="glass-dark" asChild>
                <Link href="/alumni/network">Join Network</Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link href="/alumni/events">Explore Events</Link>
              </Button>
            </>
          }
        />
      </section>

      {/* Stats */}
      <section className="container pb-16">
        <AlumniStats />
      </section>
      
      {/* Featured sections */}
      <section className="container pb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Featured Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="glass-dark" className="group hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-secondary-100">Mentorship Program</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">Learn from industry experts</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-secondary-100/20 group-hover:bg-secondary-100/30 transition-colors">
                  <GraduationCap className="h-5 w-5 text-secondary-100" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Connect with experienced professionals who can guide your career path and provide valuable insights.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" className="w-full mt-2 group" asChild>
                <Link href="/alumni/mentoring">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card variant="glass-dark" className="group hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-accent">Networking Events</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">Expand your professional network</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-blue-accent/20 group-hover:bg-blue-accent/30 transition-colors">
                  <Users className="h-5 w-5 text-blue-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Participate in exclusive events designed to help you build meaningful connections with fellow alumni.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="gradient" size="sm" className="w-full mt-2 group" asChild>
                <Link href="/alumni/events">
                  View Calendar
                  <Calendar className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card variant="golden" className="group hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-gold-strong">Achievement Awards</CardTitle>
                  <CardDescription className="text-primary-80 mt-1">Recognize excellence</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-gold-strong/20 group-hover:bg-gold-strong/30 transition-colors">
                  <Trophy className="h-5 w-5 text-gold-strong" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-80">
                Nominate outstanding alumni who have made significant contributions to their fields or communities.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="golden-gradient" size="sm" className="w-full mt-2 group" asChild>
                <Link href="/alumni/resources/awards">
                  Nominate Now
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Testimonials section */}
      {testimonials.length > 0 && (
        <section className="container pb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Alumni Testimonials</h2>
            <Button variant="outline" size="sm" className="group" asChild>
              <Link href="/alumni/network">
                View All Alumni
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.$id} variant="glass-dark" className="group overflow-hidden hover:shadow-card-hover transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-accent to-secondary-100 opacity-70" />
                <CardContent className="pt-6 relative">
                  <div className="absolute top-4 right-4 text-blue-accent opacity-30 group-hover:opacity-50 transition-opacity">
                    <Quote className="h-12 w-12 rotate-180" />
                  </div>
                  <p className="italic text-gray-300 mb-6 relative z-10">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-blue-accent/20">
                      <AvatarImage src={testimonial.avatarUrl || ""} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-accent to-secondary-100 text-white">
                        {getInitials(testimonial.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">
                        {testimonial.role} • Class of {testimonial.graduationYear}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {/* Featured Alumni */}
      {featuredAlumni.length > 0 && (
        <section className="container pb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Alumni</h2>
            <Button variant="outline" size="sm" className="group text-white" asChild>
              <Link href="/alumni/network">
                Browse Network
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAlumni.map((profile) => (
              <Card 
                key={profile.$id} 
                variant="glass-dark" 
                className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group"
              >
                <div className="h-24 bg-gradient-to-r from-blue-accent/30 to-secondary-100/30 transition-opacity duration-300 group-hover:opacity-80">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)] opacity-70" />
                </div>
                
                <CardContent className="p-6 pt-0 -mt-12 relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 border-4 border-primary-90 shadow-glow-blue transition-all duration-300 group-hover:scale-105">
                      <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-accent to-secondary-100 text-white font-bold">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-lg font-semibold mt-4 text-white group-hover:text-secondary-100 transition-colors">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-gray-300">{profile.title}</p>
                    
                    {profile.company && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Briefcase className="h-3 w-3 text-blue-accent" />
                        <span>{profile.company}</span>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3 text-gold-default" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.graduationYear && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <GraduationCap className="h-3 w-3 text-secondary-100" />
                        <span>Class of {profile.graduationYear}</span>
                      </div>
                    )}
                    
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 justify-center">
                        {profile.skills.slice(0, 2).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            +{profile.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 w-full">
                      <Button variant="outline" size="sm" className="w-full group" asChild>
                        <Link href={`/alumni/profile/${profile.$id}`}>
                          View Profile
                          <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {/* Recent Events */}
      {upcomingEvents.length > 0 && (
        <section className="container pb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            <Button variant="outline" size="sm" className="group" asChild>
              <Link href="/alumni/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.$id} variant="glass-dark" className="group overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <Image 
                    src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3'}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-100 to-transparent opacity-70" />
                  <Badge 
                    variant={event.category === "Networking" ? "gradient" : 
                             event.category === "Education" ? "secondary" : "gold"} 
                    className="absolute top-3 right-3"
                  >
                    {event.category}
                  </Badge>
                </div>
                <CardContent className="relative pt-5">
                  <div className="absolute -top-10 left-4 bg-primary-90/80 backdrop-blur-sm rounded-lg p-2 border border-secondary-100/20 text-center min-w-[50px]">
                    <p className="text-xs font-semibold text-blue-accent">
                      {getMonthDay(event.date).month}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {getMonthDay(event.date).day}
                    </p>
                  </div>
                  <div className="pl-16">
                    <h3 className="font-semibold text-white group-hover:text-secondary-100 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                      <MapPin className="h-3.5 w-3.5 text-blue-accent" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full group" asChild>
                      <Link href={`/alumni/events/${event.$id}`}>
                        Event Details
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {/* Feature banner */}
      <section className="container pb-16">
        <Card variant="gradient" className="overflow-hidden">
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">Join Our Global Alumni Community</h2>
              <p className="text-white/80">
                Access exclusive resources, events, job opportunities, and connect with fellow graduates around the world.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button variant="glass" className="backdrop-blur-md border border-white/20" asChild>
                  <Link href="/alumni/network">Sign Up Now</Link>
                </Button>
                <Button variant="animated" asChild>
                  <Link href="/alumni/resources">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full md:w-1/3 aspect-video bg-primary-80/30 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:16px_16px] animate-pulse opacity-60" />
              </div>
              <div className="text-6xl font-bold animate-float">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
} 