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
  BookOpen,
  Shield,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getUserProfile, getUserExperiences, getUserEducation, getUserActivities, getUserUpcomingEvents, Activity, fetchPrivacySettings } from "../../actions"
import { useEffect, useState } from "react"
import { UserProfile, Experience, Education, Event } from "@/lib/types/alumni"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

// Add interfaces for the missing properties we need
interface UserProfileExtended extends UserProfile {
  position?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  availabilityDetails?: {
    mentoring: boolean;
    jobOpportunities: boolean;
    speaking: boolean;
    networking: boolean;
  };
}

export default function AlumniProfilePage() {
  const { id } = useParams()

  const [profile, setProfile] = useState<UserProfileExtended | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [currentUserSettings, setCurrentUserSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Find profile by ID
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      
      try {
        // Get current user's privacy settings
        const currentUserPrivacy = await fetchPrivacySettings()
        setCurrentUserSettings(currentUserPrivacy)
        
        const profile = await getUserProfile(id as string)
        // We need to transform the profile to match our extended type
        if (profile) {
          // Get profile privacy settings
          const privacySettings = profile.privacySettings || {
            profileVisibility: 'all_alumni',
            showEmail: true,
            showPhone: false,
            showEducation: true,
            showWork: true,
            showLocation: true,
            showSocial: true,
            allowMessages: true,
            allowConnections: true,
            allowMentoring: true
          }
          
          const extendedProfile: UserProfileExtended = {
            ...profile,
            position: profile.title, // Map title to position
            social: {
              linkedin: privacySettings.showSocial ? profile.socialLinks?.find(link => link.platform === 'linkedin')?.url : undefined,
              twitter: privacySettings.showSocial ? profile.socialLinks?.find(link => link.platform === 'twitter')?.url : undefined,
              website: privacySettings.showSocial ? profile.socialLinks?.find(link => link.platform === 'website')?.url : undefined,
            },
            availabilityDetails: {
              mentoring: privacySettings.allowMentoring || false,
              jobOpportunities: false, // Default values
              speaking: false,
              networking: profile.available || false
            }
          }
          setProfile(extendedProfile)
          
          // Fetch experiences and education
          if (privacySettings.showWork) {
            const experienceData = await getUserExperiences(profile.userId)
            setExperiences(experienceData)
          }
          
          if (privacySettings.showEducation) {
            const educationData = await getUserEducation(profile.userId)
            setEducation(educationData)
          }
          
          // Fetch activities and upcoming events
          const activitiesData = await getUserActivities(profile.userId)
          setActivities(activitiesData)
          
          const eventsData = await getUserUpcomingEvents(profile.userId)
          setUpcomingEvents(eventsData)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Failed to load profile",
          description: "There was an error loading this alumni profile",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfile()
  }, [id])
  
  if (!profile) {
    return (
      <div className="relative min-h-screen pb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
          <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-gold-default/5 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-140 h-140 rounded-full bg-secondary-100/5 blur-3xl" />
        </div>
        
        <div className="container max-w-4xl pt-8 pb-8">
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
    
  // Helper functions for formatting dates
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        month: format(date, 'MMM').toUpperCase(),
        day: format(date, 'd')
      };
    } catch (error) {
      return { month: 'TBD', day: '--' };
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 1) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch (error) {
      return 'Recently';
    }
  };
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-140 h-140 rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <div className="container max-w-4xl pt-8 pb-8 space-y-6">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <Button variant="glass" asChild className="gap-2 border border-secondary-100/10">
              <Link href="/alumni/network">
                <ArrowLeft className="h-4 w-4" />
                Back to Network
              </Link>
            </Button>
            {profile.privacySettings?.allowMessages !== false && (
              <Button variant="gradient">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            )}
          </div>
          
          {/* Profile Header */}
          <div className="relative">
            <div className="absolute inset-0 h-48 bg-linear-to-r from-blue-accent/20 via-secondary-100/10 to-primary-90/5 rounded-xl"></div>
            
            <div className="relative pt-12 px-6 pb-6 md:pt-16 md:px-12 md:pb-8 flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary-90 shadow-lg">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-xl bg-linear-to-br from-blue-accent to-secondary-100 text-white">{initials}</AvatarFallback>
                </Avatar>
                
                {profile.privacySettings?.profileVisibility === 'limited' && (
                  <div className="absolute -top-2 -right-2 bg-primary-90 rounded-full p-1 border border-secondary-100/20" title="Limited Profile">
                    <Lock className="h-4 w-4 text-secondary-100" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      {profile.name}
                      {profile.privacySettings?.profileVisibility !== 'all_alumni' && (
                        <Badge variant="glass-dark" className="text-xs font-normal">
                          {profile.privacySettings?.profileVisibility === 'connections' ? 'Connections Only' : 'Limited Profile'}
                        </Badge>
                      )}
                    </h1>
                    <p className="text-gray-300 mt-1">{profile.position} {profile.company ? `at ${profile.company}` : ''}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.graduationYear && (
                        <Badge variant="gradient" className="text-xs border border-blue-accent/20">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          <span>Class of {profile.graduationYear}</span>
                        </Badge>
                      )}
                      {profile.location && profile.privacySettings?.showLocation !== false && (
                        <Badge variant="outline" className="text-xs bg-secondary-100/5 border-secondary-100/20 text-secondary-100">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{profile.location}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {profile.privacySettings?.allowMentoring && (
                    <div className="hidden md:block">
                      <Button variant="gradient" size="sm" className="gap-1">
                        <Award className="h-4 w-4" />
                        Request Mentoring
                      </Button>
                    </div>
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
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="experience"
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Bio</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-300">{profile.bio || "No bio available."}</p>
                
                <h3 className="font-medium text-lg mt-6 mb-3 text-white">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-secondary-100/5 border-secondary-100/20 text-secondary-100 text-xs">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills listed</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
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
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
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
          
          <TabsContent value="experience" className="animate-in fade-in-50 duration-300">
            {/* Work Experience */}
            {(!profile.privacySettings?.showWork || experiences.length === 0) ? (
              <Card variant="glass-dark" className="border-0 overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-lg text-white">Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    {!profile.privacySettings?.showWork ? (
                      <>
                        <Lock className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-300">This user&apos;s work experience is private</p>
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-300">No work experience added yet</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card variant="glass-dark" className="border-0 overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-lg text-white">Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  {experiences.map((exp) => (
                    <div key={exp.$id} className="relative pl-7 pb-1">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-blue-accent/80 to-secondary-100/50 z-0" />
                      <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-blue-accent/30 border-2 border-blue-accent z-10" />
                      
                      <div className="flex flex-wrap justify-between gap-2 mb-1">
                        <h3 className="text-white font-medium">{exp.title}</h3>
                        {exp.current ? (
                          <Badge variant="gradient" className="text-xs font-normal">Current</Badge>
                        ) : (
                          exp.endDate && (
                            <span className="text-xs text-gray-400">
                              {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}
                            </span>
                          )
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm">{exp.company}</p>
                      {exp.location && (
                        <p className="text-gray-400 text-xs flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {exp.location}
                        </p>
                      )}
                      
                      {exp.description && (
                        <p className="text-gray-300 text-sm mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {/* Education */}
            {(!profile.privacySettings?.showEducation || education.length === 0) ? (
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-lg text-white">Education</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    {!profile.privacySettings?.showEducation ? (
                      <>
                        <Lock className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-300">This user&apos;s education information is private</p>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-300">No education information added yet</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-lg text-white">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  {education.map((edu) => (
                    <div key={edu.$id} className="relative pl-7 pb-1">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-gold-default/80 to-gold-strong/50 z-0" />
                      <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-gold-default/30 border-2 border-gold-default z-10" />
                      
                      <div className="flex flex-wrap justify-between gap-2 mb-1">
                        <h3 className="text-white font-medium">{edu.degree}</h3>
                        <span className="text-xs text-gray-400">
                          {edu.startYear} - {edu.endYear}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-gray-400 text-xs flex items-center mt-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {edu.fieldOfStudy}
                        </p>
                      )}
                      
                      {edu.description && (
                        <p className="text-gray-300 text-sm mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                <CardDescription>Recent contributions and interactions with the alumni community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={activity.$id} className="relative pl-6">
                      <div className="absolute top-1.5 left-0 w-3 h-3 rounded-full bg-blue-accent/70"></div>
                      <div className={`${index < activities.length - 1 ? 'border-l border-blue-accent/20 ml-1.5 pb-6 pl-4' : 'ml-1.5 pl-4'}`}>
                        <p className="text-sm text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                        <h3 className="font-medium text-white mt-1">{activity.description}</h3>
                        {activity.type === 'event_joined' && activity.relatedData && (
                          <p className="text-sm mt-1 text-gray-300">
                            {activity.relatedData.eventDate && `Event date: ${new Date(activity.relatedData.eventDate).toLocaleDateString()}`}
                          </p>
                        )}
                        {activity.type === 'job_posted' && activity.relatedData && (
                          <p className="text-sm mt-1 text-gray-300">
                            {activity.relatedData.company && `at ${activity.relatedData.company}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="p-3 rounded-full bg-primary-80/30 mb-4">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-white">No recent activity</h3>
                    <p className="text-sm text-gray-400 max-w-md">
                      {profile.name.split(' ')[0]} hasn&apos;t logged any activity in the system yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-white">Upcoming Events</CardTitle>
                <CardDescription>Events where {profile.name.split(' ')[0]} will be participating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const eventDate = formatEventDate(event.date);
                    return (
                      <div key={event.$id} className="flex items-start gap-4 p-3 glass rounded-md border border-secondary-100/10 hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 flex flex-col items-center justify-center rounded-md bg-blue-accent/10 text-blue-accent font-medium">
                          <span className="text-xs">{eventDate.month}</span>
                          <span className="text-lg">{eventDate.day}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{event.title}</h3>
                          <p className="text-sm text-gray-400">{event.description}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-3 rounded-full bg-primary-80/30 mb-4">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-white">No upcoming events</h3>
                    <p className="text-sm text-gray-400 max-w-md">
                      {profile.name.split(' ')[0]} isn&apos;t scheduled to participate in any upcoming events.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 