"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  MessageSquare, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Link as LinkIcon, 
  Twitter, 
  Linkedin,
  Globe,
  Award,
  Users,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { alumniProfiles } from "@/components/alumni/alumni-data"

export default function AlumniProfilePage() {
  const { id } = useParams()
  
  // Find profile by ID
  const profile = alumniProfiles.find(p => p.id === id)
  
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground mt-2">The alumni profile you are looking for does not exist.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/alumni/network">Back to Network</Link>
        </Button>
      </div>
    )
  }
  
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/alumni/network">
              <ArrowLeft className="h-4 w-4" />
              Back to Network
            </Link>
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32 ring-4 ring-primary/20 ring-offset-4 ring-offset-background mx-auto">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-xl text-muted-foreground">{profile.position} at {profile.company}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.available.mentoring && (
                  <Badge variant="outline" className="border-blue-500/40 text-blue-500 bg-blue-500/10">
                    Available for mentoring
                  </Badge>
                )}
                
                {profile.available.jobOpportunities && (
                  <Badge variant="outline" className="border-green-500/40 text-green-500 bg-green-500/10">
                    Has job opportunities
                  </Badge>
                )}
                
                {profile.available.speaking && (
                  <Badge variant="outline" className="border-purple-500/40 text-purple-500 bg-purple-500/10">
                    Available for speaking
                  </Badge>
                )}
                
                {profile.available.networking && (
                  <Badge variant="outline" className="border-orange-500/40 text-orange-500 bg-orange-500/10">
                    Open to networking
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 mt-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{profile.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{profile.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Class of {profile.graduationYear}</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              {profile.social.linkedin && (
                <a 
                  href={profile.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              
              {profile.social.twitter && (
                <a 
                  href={profile.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              
              {profile.social.website && (
                <a 
                  href={profile.social.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{profile.bio}</p>
              
              <h3 className="font-medium text-lg mt-6 mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">BISO Outstanding Alumnus Award</h4>
                  <p className="text-sm text-muted-foreground">Received in 2022 for outstanding contributions to the community</p>
                </div>
                <div>
                  <h4 className="font-medium">Industry Recognition</h4>
                  <p className="text-sm text-muted-foreground">Top 30 Under 30 in Tech Leadership</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  BISO Involvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Past Roles</h4>
                  <p className="text-sm text-muted-foreground">Vice President, Marketing Committee (2016-2017)</p>
                  <p className="text-sm text-muted-foreground">Event Coordinator (2015-2016)</p>
                </div>
                <div>
                  <h4 className="font-medium">Current Involvement</h4>
                  <p className="text-sm text-muted-foreground">Alumni Advisory Board Member</p>
                  <p className="text-sm text-muted-foreground">Mentorship Program Volunteer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="experience" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-2 border-primary/30 pl-4 ml-2 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5"></div>
                <h3 className="font-medium">{profile.position}</h3>
                <p className="text-sm">{profile.company}</p>
                <p className="text-xs text-muted-foreground">2020 - Present</p>
                <p className="text-sm mt-2">Leading product development for enterprise SaaS solutions with a focus on user experience and business impact.</p>
              </div>
              
              <div className="border-l-2 border-primary/30 pl-4 ml-2 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5"></div>
                <h3 className="font-medium">Product Manager</h3>
                <p className="text-sm">Previous Company AB</p>
                <p className="text-xs text-muted-foreground">2018 - 2020</p>
                <p className="text-sm mt-2">Managed product development lifecycle and collaborated with engineering teams to deliver innovative solutions.</p>
              </div>
              
              <div className="border-l-2 border-primary/30 pl-4 ml-2 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5"></div>
                <h3 className="font-medium">Associate Product Manager</h3>
                <p className="text-sm">Startup Inc</p>
                <p className="text-xs text-muted-foreground">2017 - 2018</p>
                <p className="text-sm mt-2">Assisted in product development and market research for early-stage startup.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-2 border-primary/30 pl-4 ml-2 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5"></div>
                <h3 className="font-medium">Masters in Business Administration</h3>
                <p className="text-sm">BI Norwegian Business School</p>
                <p className="text-xs text-muted-foreground">2016 - 2018</p>
                <p className="text-sm mt-2">Specialized in Marketing and Product Management. Thesis on Digital Transformation in Norwegian Industries.</p>
              </div>
              
              <div className="border-l-2 border-primary/30 pl-4 ml-2 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5"></div>
                <h3 className="font-medium">Bachelor in Business Administration</h3>
                <p className="text-sm">BI Norwegian Business School</p>
                <p className="text-xs text-muted-foreground">2013 - 2016</p>
                <p className="text-sm mt-2">Focus on Marketing and Digital Business. Active member of BISO during studies.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent contributions and interactions with the alumni community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-2 border-primary/20 pl-4 ml-2 relative">
                <div className="absolute w-2 h-2 bg-primary/50 rounded-full -left-[5px] top-1.5"></div>
                <p className="text-sm text-muted-foreground">2 weeks ago</p>
                <h3 className="font-medium mt-1">Spoke at BISO Alumni Career Development Webinar</h3>
                <p className="text-sm mt-1">Shared insights on career navigation in the tech industry</p>
              </div>
              
              <div className="border-l-2 border-primary/20 pl-4 ml-2 relative">
                <div className="absolute w-2 h-2 bg-primary/50 rounded-full -left-[5px] top-1.5"></div>
                <p className="text-sm text-muted-foreground">1 month ago</p>
                <h3 className="font-medium mt-1">Joined Alumni Mentoring Program</h3>
                <p className="text-sm mt-1">Became a mentor for current BISO students</p>
              </div>
              
              <div className="border-l-2 border-primary/20 pl-4 ml-2 relative">
                <div className="absolute w-2 h-2 bg-primary/50 rounded-full -left-[5px] top-1.5"></div>
                <p className="text-sm text-muted-foreground">3 months ago</p>
                <h3 className="font-medium mt-1">Attended Annual Alumni Reunion</h3>
                <p className="text-sm mt-1">Participated in networking and discussions about future alumni initiatives</p>
              </div>
              
              <div className="border-l-2 border-primary/20 pl-4 ml-2 relative">
                <div className="absolute w-2 h-2 bg-primary/50 rounded-full -left-[5px] top-1.5"></div>
                <p className="text-sm text-muted-foreground">6 months ago</p>
                <h3 className="font-medium mt-1">Posted Job Opportunity</h3>
                <p className="text-sm mt-1">Shared a senior product manager position at {profile.company}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events where {profile.name.split(' ')[0]} will be participating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex flex-col items-center justify-center rounded-md bg-primary/10 text-primary font-medium">
                  <span className="text-xs">JUN</span>
                  <span className="text-lg">15</span>
                </div>
                <div>
                  <h3 className="font-medium">Product Management Workshop</h3>
                  <p className="text-sm text-muted-foreground">Leading a workshop for current students on product management fundamentals</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex flex-col items-center justify-center rounded-md bg-primary/10 text-primary font-medium">
                  <span className="text-xs">SEP</span>
                  <span className="text-lg">08</span>
                </div>
                <div>
                  <h3 className="font-medium">Alumni Industry Panel</h3>
                  <p className="text-sm text-muted-foreground">Participating in a panel discussion about career paths in tech</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 