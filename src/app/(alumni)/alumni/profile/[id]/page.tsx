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
import { cn } from "@/lib/utils"

export default function AlumniProfilePage() {
  const { id } = useParams()
  
  // Find profile by ID
  const profile = alumniProfiles.find(p => p.id === id)
  
  if (!profile) {
    return (
      <div className="relative min-h-screen pb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
          <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
        </div>
        
        <div className="container pt-8 pb-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
              <div className="relative z-10 p-5 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                <Users className="h-12 w-12 text-blue-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
            <p className="text-gray-300 max-w-md text-center">The alumni profile you are looking for does not exist.</p>
            <Button variant="gradient" asChild className="mt-4">
              <Link href="/alumni/network">Back to Network</Link>
            </Button>
          </div>
        </div>
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
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <div className="container pt-8 pb-8 space-y-6">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <Button variant="glass" asChild className="gap-2 border border-secondary-100/10">
              <Link href="/alumni/network">
                <ArrowLeft className="h-4 w-4" />
                Back to Network
              </Link>
            </Button>
            <Button variant="gradient">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
          
          {/* Profile Header */}
          <div className="relative">
            <div className="absolute inset-0 h-48 bg-gradient-to-r from-blue-accent/20 via-secondary-100/10 to-primary-90/5 rounded-xl"></div>
            
            <div className="relative pt-16 px-6 pb-6 flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-accent/50 to-secondary-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <Avatar className="h-24 w-24 border-4 border-primary-90 relative shadow-lg group-hover:shadow-glow-blue transition-all duration-300">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-xl bg-primary-80 text-white">{initials}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                    <p className="text-gray-300 mt-1">{profile.position} at {profile.company}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="gradient" className="border border-blue-accent/20 text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        <span>Class of {profile.graduationYear}</span>
                      </Badge>
                      <Badge variant="outline" className="bg-secondary-100/5 border-secondary-100/20 text-xs text-secondary-100">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{profile.location}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.available.mentoring && (
                      <Badge variant="outline" className="border-blue-accent/40 text-blue-accent bg-blue-accent/10">
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
                      <Badge variant="outline" className="border-gold-default/40 text-gold-default bg-gold-default/10">
                        Open to networking
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                      <MapPin className="h-4 w-4 text-gold-default" />
                    </div>
                    <span className="text-gray-300">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                      <Briefcase className="h-4 w-4 text-secondary-100" />
                    </div>
                    <span className="text-gray-300">{profile.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                      <GraduationCap className="h-4 w-4 text-blue-accent" />
                    </div>
                    <span className="text-gray-300">{profile.department}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  {profile.social.linkedin && (
                    <a 
                      href={profile.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 flex items-center justify-center rounded-full bg-blue-accent/10 text-blue-accent hover:bg-blue-accent/20 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  
                  {profile.social.twitter && (
                    <a 
                      href={profile.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 flex items-center justify-center rounded-full bg-blue-accent/10 text-blue-accent hover:bg-blue-accent/20 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  
                  {profile.social.website && (
                    <a 
                      href={profile.social.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 flex items-center justify-center rounded-full bg-secondary-100/10 text-secondary-100 hover:bg-secondary-100/20 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3 glass-dark backdrop-blur-md border border-secondary-100/20 p-1">
            <TabsTrigger 
              value="about" 
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="experience"
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Bio</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-300">{profile.bio}</p>
                
                <h3 className="font-medium text-lg mt-6 mb-3 text-white">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-secondary-100/5 border-secondary-100/20 text-secondary-100 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-accent" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div>
                    <h4 className="font-medium text-white">BISO Outstanding Alumnus Award</h4>
                    <p className="text-sm text-gray-400">Received in 2022 for outstanding contributions to the community</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Industry Recognition</h4>
                    <p className="text-sm text-gray-400">Top 30 Under 30 in Tech Leadership</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary-100" />
                    BISO Involvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div>
                    <h4 className="font-medium text-white">Past Roles</h4>
                    <p className="text-sm text-gray-400">Vice President, Marketing Committee (2016-2017)</p>
                    <p className="text-sm text-gray-400">Event Coordinator (2015-2016)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Current Involvement</h4>
                    <p className="text-sm text-gray-400">Alumni Advisory Board Member</p>
                    <p className="text-sm text-gray-400">Mentorship Program Volunteer</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="experience" className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-accent" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="relative pl-6">
                  <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-blue-accent bg-primary-90"></div>
                  <div className="border-l border-secondary-100/20 ml-2 pb-6 pl-4">
                    <h3 className="font-medium text-white">{profile.position}</h3>
                    <p className="text-sm text-gray-300">{profile.company}</p>
                    <p className="text-xs text-gray-400">2020 - Present</p>
                    <p className="text-sm mt-2 text-gray-300">Leading product development for enterprise SaaS solutions with a focus on user experience and business impact.</p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-blue-accent bg-primary-90"></div>
                  <div className="border-l border-secondary-100/20 ml-2 pb-6 pl-4">
                    <h3 className="font-medium text-white">Product Manager</h3>
                    <p className="text-sm text-gray-300">Previous Company AB</p>
                    <p className="text-xs text-gray-400">2018 - 2020</p>
                    <p className="text-sm mt-2 text-gray-300">Managed product development lifecycle and collaborated with engineering teams to deliver innovative solutions.</p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-blue-accent bg-primary-90"></div>
                  <div className="ml-2 pl-4">
                    <h3 className="font-medium text-white">Associate Product Manager</h3>
                    <p className="text-sm text-gray-300">Startup Inc</p>
                    <p className="text-xs text-gray-400">2017 - 2018</p>
                    <p className="text-sm mt-2 text-gray-300">Assisted in product development and market research for early-stage startup.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary-100" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="relative pl-6">
                  <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-secondary-100 bg-primary-90"></div>
                  <div className="border-l border-secondary-100/20 ml-2 pb-6 pl-4">
                    <h3 className="font-medium text-white">Masters in Business Administration</h3>
                    <p className="text-sm text-gray-300">BI Norwegian Business School</p>
                    <p className="text-xs text-gray-400">2016 - 2018</p>
                    <p className="text-sm mt-2 text-gray-300">Specialized in Marketing and Product Management. Thesis on Digital Transformation in Norwegian Industries.</p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-secondary-100 bg-primary-90"></div>
                  <div className="ml-2 pl-4">
                    <h3 className="font-medium text-white">Bachelor in Business Administration</h3>
                    <p className="text-sm text-gray-300">BI Norwegian Business School</p>
                    <p className="text-xs text-gray-400">2013 - 2016</p>
                    <p className="text-sm mt-2 text-gray-300">Focus on Marketing and Digital Business. Active member of BISO during studies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                <CardDescription>Recent contributions and interactions with the alumni community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="relative pl-6">
                  <div className="absolute top-1.5 left-0 w-3 h-3 rounded-full bg-blue-accent/70"></div>
                  <div className="border-l border-blue-accent/20 ml-1.5 pb-6 pl-4">
                    <p className="text-sm text-gray-400">2 weeks ago</p>
                    <h3 className="font-medium text-white mt-1">Spoke at BISO Alumni Career Development Webinar</h3>
                    <p className="text-sm mt-1 text-gray-300">Shared insights on career navigation in the tech industry</p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute top-1.5 left-0 w-3 h-3 rounded-full bg-blue-accent/70"></div>
                  <div className="border-l border-blue-accent/20 ml-1.5 pb-6 pl-4">
                    <p className="text-sm text-gray-400">1 month ago</p>
                    <h3 className="font-medium text-white mt-1">Joined Alumni Mentoring Program</h3>
                    <p className="text-sm mt-1 text-gray-300">Became a mentor for current BISO students</p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute top-1.5 left-0 w-3 h-3 rounded-full bg-blue-accent/70"></div>
                  <div className="border-l border-blue-accent/20 ml-1.5 pb-6 pl-4">
                    <p className="text-sm text-gray-400">3 months ago</p>
                    <h3 className="font-medium text-white mt-1">Attended Annual Alumni Reunion</h3>
                    <p className="text-sm mt-1 text-gray-300">Participated in networking and discussions about future alumni initiatives</p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute top-1.5 left-0 w-3 h-3 rounded-full bg-blue-accent/70"></div>
                  <div className="ml-1.5 pl-4">
                    <p className="text-sm text-gray-400">6 months ago</p>
                    <h3 className="font-medium text-white mt-1">Posted Job Opportunity</h3>
                    <p className="text-sm mt-1 text-gray-300">Shared a senior product manager position at {profile.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Upcoming Events</CardTitle>
                <CardDescription>Events where {profile.name.split(' ')[0]} will be participating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex items-start gap-4 p-3 glass rounded-md border border-secondary-100/10 hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 flex flex-col items-center justify-center rounded-md bg-blue-accent/10 text-blue-accent font-medium">
                    <span className="text-xs">JUN</span>
                    <span className="text-lg">15</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Product Management Workshop</h3>
                    <p className="text-sm text-gray-400">Leading a workshop for current students on product management fundamentals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 glass rounded-md border border-secondary-100/10 hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 flex flex-col items-center justify-center rounded-md bg-blue-accent/10 text-blue-accent font-medium">
                    <span className="text-xs">SEP</span>
                    <span className="text-lg">08</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Alumni Industry Panel</h3>
                    <p className="text-sm text-gray-400">Participating in a panel discussion about career paths in tech</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 