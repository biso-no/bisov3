import { 
  Users, 
  Calendar, 
  Briefcase, 
  Newspaper, 
  Book, 
  MessageSquare 
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlumniStats } from "@/components/alumni/stats"
import { EventsList } from "@/components/alumni/events-list"
import { JobsList } from "@/components/alumni/jobs-list"

export default function AlumniDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Welcome to the BISO Alumni Portal</h1>
        <p className="text-muted-foreground text-lg">
          Connect with fellow alumni, stay updated with events, and explore career opportunities
        </p>
      </div>
      
      <AlumniStats />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors group">
          <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-medium">Network</CardTitle>
              <CardDescription className="text-sm">Connect with alumni</CardDescription>
            </div>
            <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Discover and connect with over 2,000 BISO alumni from various classes and departments.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/alumni/network">
                Explore Network
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors group">
          <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-medium">Mentoring</CardTitle>
              <CardDescription className="text-sm">Find a mentor or become one</CardDescription>
            </div>
            <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Book className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Participate in our mentoring program to guide students or get advice from experienced alumni.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/alumni/mentoring">
                Join Program
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors group">
          <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-medium">Discussions</CardTitle>
              <CardDescription className="text-sm">Join conversations</CardDescription>
            </div>
            <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Engage in discussions on topics relevant to our community and industry.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/alumni/discussions">
                View Discussions
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/alumni/events">View All</Link>
            </Button>
          </div>
          <EventsList />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Latest Opportunities</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/alumni/jobs">View All</Link>
            </Button>
          </div>
          <JobsList />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest News & Updates</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Alumni Advisory Board Announcement</h3>
                  <p className="text-sm text-muted-foreground">
                    We are excited to announce the formation of the BISO Alumni Advisory Board!
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Annual Alumni Reunion</h3>
                  <p className="text-sm text-muted-foreground">
                    Save the date for our annual alumni reunion on September 15th.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Career Development Workshop</h3>
                  <p className="text-sm text-muted-foreground">
                    Join our upcoming workshop on career development in the tech industry.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 