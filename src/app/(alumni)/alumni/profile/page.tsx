"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  GraduationCap, 
  Briefcase,
  LinkedinIcon,
  Twitter,
  Globe,
  Edit,
  Shield,
  Plus,
  Check,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { UserProfile } from "@/lib/types/alumni"
import { getCurrentUserProfile } from "../actions"
import { Skeleton } from "@/components/ui/skeleton"
import LinkedInConnect from "@/components/linkedin/LinkedInConnect"


// Define an interface for the social object
interface SocialObject {
  linkedin?: string;
  twitter?: string;
  website?: string;
  [key: string]: string | undefined;
}

// Helper function to get social information from socialLinks
function getSocialFromLinks(socialLinks?: any[]): SocialObject | null {
  if (!socialLinks || !Array.isArray(socialLinks) || socialLinks.length === 0) {
    return null;
  }
  
  const social: SocialObject = {};
  
  for (const link of socialLinks) {
    const platform = link.platform?.toLowerCase();
    if (platform === 'linkedin') {
      social.linkedin = link.url;
    } else if (platform === 'twitter') {
      social.twitter = link.url;
    } else if (platform === 'website') {
      social.website = link.url;
    }
  }
  
  return Object.keys(social).length > 0 ? social : null;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Set document title
    document.title = "Alumni Profile | BISO";
    
    async function loadProfile() {
      try {
        const profile = await getCurrentUserProfile()
        setUserProfile(profile)
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProfile()
  }, [])
  
  // Get social info from socialLinks
  const social = userProfile ? getSocialFromLinks(userProfile.socialLinks) : null;
  
  // Calculate initials from name
  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AL" // Default initials for Alumni
  
  if (loading) {
    return <ProfileSkeleton />
  }
  
  if (!userProfile) {
    return (
      <div className="relative min-h-screen pb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
          <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
        </div>
        
        <div className="container pt-8 pb-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
              <div className="relative z-10 p-5 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                <User className="h-12 w-12 text-blue-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
            <p className="text-gray-300 max-w-md mb-6 text-center">Could not load your profile information. Create a new profile to get started.</p>
            <Button variant="gradient" asChild>
              <Link href="/alumni/profile/edit">Create Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container pt-8 pb-8 space-y-6">
        {/* Profile Header */}
        <div className="relative">
          <div className="absolute inset-0 h-48 bg-gradient-to-r from-blue-accent/20 via-secondary-100/10 to-primary-90/5 rounded-xl"></div>
          
          <div className="relative pt-16 px-6 pb-6 flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-accent/50 to-secondary-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <Avatar className="h-24 w-24 border-4 border-primary-90 relative shadow-lg group-hover:shadow-glow-blue transition-all duration-300">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                <AvatarFallback className="text-xl bg-primary-80 text-white">{initials}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
                  <p className="text-gray-300 mt-1">{userProfile.title} {userProfile.company ? `at ${userProfile.company}` : ''}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.graduationYear && (
                      <Badge variant="gradient" className="border border-blue-accent/20 text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        <span>Class of {userProfile.graduationYear}</span>
                      </Badge>
                    )}
                    {userProfile.location && (
                      <Badge variant="outline" className="bg-secondary-100/5 border-secondary-100/20 text-xs text-secondary-100">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{userProfile.location}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="glass" className="border border-secondary-100/20 hover:border-secondary-100/40 transition-colors" asChild>
                    <Link href="/alumni/profile/edit" className="flex items-center">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Link>
                  </Button>
                  <LinkedInConnect userId={userProfile.userId} />
                  <Button size="sm" variant="gradient">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg text-white">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Completion</span>
                    <span className="text-sm font-medium text-white">{userProfile.profileCompletion || 0}%</span>
                  </div>
                  <Progress 
                    value={userProfile.profileCompletion || 0} 
                    className="h-2 bg-primary-80/50" 
                  />
                  
                  <style jsx global>{`
                    .h-2 > div {
                      background: linear-gradient(to right, var(--blue-accent), var(--secondary-100));
                    }
                  `}</style>
                  
                  <div className="glass rounded-md p-4 text-sm space-y-2 border border-secondary-100/10">
                    <p className="font-medium text-white">Complete your profile</p>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex items-center gap-1.5">
                        {userProfile.avatarUrl ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span>Add profile picture</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        {userProfile.experiences && userProfile.experiences.length > 0 ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span>Add work experience</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        {userProfile.certifications && userProfile.certifications.length > 0 ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span>Add certifications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Card */}
            <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm relative z-10">
                {(!userProfile.privacySettings || userProfile.privacySettings.showEmail) && (
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                      <Mail className="h-4 w-4 text-blue-accent" />
                    </div>
                    <span className="text-gray-300">{userProfile.email}</span>
                  </div>
                )}
                
                {userProfile.privacySettings?.showPhone && userProfile.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                      <Phone className="h-4 w-4 text-secondary-100" />
                    </div>
                    <span className="text-gray-300">{userProfile.phone}</span>
                  </div>
                )}
                
                {userProfile.location && (
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                      <MapPin className="h-4 w-4 text-gold-default" />
                    </div>
                    <span className="text-gray-300">{userProfile.location}</span>
                  </div>
                )}
                
                {(!userProfile.privacySettings || userProfile.privacySettings.showSocial) && social && (
                  <div className="pt-2 space-y-3">
                    <Separator className="bg-secondary-100/10" />
                    
                    {social.linkedin && (
                      <a 
                        href={social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="p-1.5 rounded-md bg-blue-accent/10 hover:bg-blue-accent/20 transition-colors">
                          <LinkedinIcon className="h-4 w-4 text-blue-accent" />
                        </div>
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                    
                    {social.twitter && (
                      <a 
                        href={social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="p-1.5 rounded-md bg-blue-accent/10 hover:bg-blue-accent/20 transition-colors">
                          <Twitter className="h-4 w-4 text-blue-accent" />
                        </div>
                        <span>Twitter Profile</span>
                      </a>
                    )}
                    
                    {social.website && (
                      <a 
                        href={social.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="p-1.5 rounded-md bg-secondary-100/10 hover:bg-secondary-100/20 transition-colors">
                          <Globe className="h-4 w-4 text-secondary-100" />
                        </div>
                        <span>Personal Website</span>
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Skills Card */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-lg text-white">Skills</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-secondary-100/5 border-secondary-100/20 text-secondary-100 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Languages Card */}
            {userProfile.languages && userProfile.languages.length > 0 && (
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-lg text-white">Languages</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-2">
                    {userProfile.languages.map((lang, index) => (
                      <div key={lang.$id || index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{lang.language}</span>
                        <Badge variant="outline" className="bg-blue-accent/5 border-blue-accent/20 text-blue-accent text-xs">
                          {lang.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 glass-dark backdrop-blur-md border border-secondary-100/20 p-1 h-12">
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
                  value="education"
                  className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
                >
                  Education
                </TabsTrigger>
              </TabsList>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-lg text-white">About Me</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {userProfile.bio ? (
                      <p className="text-gray-300">{userProfile.bio}</p>
                    ) : (
                      <p className="text-gray-400 italic">No bio information added yet.</p>
                    )}
                  </CardContent>
                </Card>
                
                {userProfile.interests && userProfile.interests.length > 0 && (
                  <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-lg text-white">Interests</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex flex-wrap gap-1.5">
                        {userProfile.interests.map((interest, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-accent/5 border-blue-accent/20 text-blue-accent text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-lg text-white">Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center justify-between p-3 glass rounded-md border border-secondary-100/10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                            <Mail className="h-4 w-4 text-blue-accent" />
                          </div>
                          <span className="text-gray-300">Show Email</span>
                        </div>
                        <Badge 
                          variant={!userProfile.privacySettings || userProfile.privacySettings.showEmail ? "gradient" : "outline"} 
                          className={!userProfile.privacySettings || userProfile.privacySettings.showEmail ? "" : "border-blue-accent/20 text-blue-accent"}
                        >
                          {!userProfile.privacySettings || userProfile.privacySettings.showEmail ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 glass rounded-md border border-secondary-100/10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                            <Phone className="h-4 w-4 text-secondary-100" />
                          </div>
                          <span className="text-gray-300">Show Phone</span>
                        </div>
                        <Badge 
                          variant={userProfile.privacySettings?.showPhone ? "gradient" : "outline"} 
                          className={userProfile.privacySettings?.showPhone ? "" : "border-blue-accent/20 text-blue-accent"}
                        >
                          {userProfile.privacySettings?.showPhone ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 glass rounded-md border border-secondary-100/10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                            <MessageSquare className="h-4 w-4 text-gold-default" />
                          </div>
                          <span className="text-gray-300">Allow Messages</span>
                        </div>
                        <Badge 
                          variant={userProfile.privacySettings?.allowMessages ? "gradient" : "outline"} 
                          className={userProfile.privacySettings?.allowMessages ? "" : "border-blue-accent/20 text-blue-accent"}
                        >
                          {userProfile.privacySettings?.allowMessages ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 glass rounded-md border border-secondary-100/10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                            <Shield className="h-4 w-4 text-blue-accent" />
                          </div>
                          <span className="text-gray-300">Available as Mentor</span>
                        </div>
                        <Badge 
                          variant={userProfile.privacySettings?.allowMentoring ? "gradient" : "outline"} 
                          className={userProfile.privacySettings?.allowMentoring ? "" : "border-blue-accent/20 text-blue-accent"}
                        >
                          {userProfile.privacySettings?.allowMentoring ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="gradient" size="sm" asChild className="w-full">
                        <Link href="/alumni/profile/privacy">
                          Manage Privacy Settings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-lg text-white">Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    {userProfile.experiences && userProfile.experiences.length > 0 ? (
                      userProfile.experiences.map((experience, index) => (
                        <div key={experience.$id} className={cn("relative pl-6", index !== userProfile.experiences!.length - 1 && "pb-6 border-l border-secondary-100/20 ml-2")}>
                          <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-blue-accent bg-primary-90"></div>
                          <div>
                            <h3 className="font-medium text-white">{experience.title}</h3>
                            <p className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                              <div className="p-1 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                                <Building className="h-3.5 w-3.5 text-secondary-100" />
                              </div>
                              <span>{experience.company}</span>
                              {experience.location && (
                                <>
                                  <span className="mx-1 text-gray-500">•</span>
                                  <div className="p-1 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                                    <MapPin className="h-3.5 w-3.5 text-gold-default" />
                                  </div>
                                  <span>{experience.location}</span>
                                </>
                              )}
                            </p>
                            <p className="text-sm text-gray-300 mt-1 flex items-center">
                              <div className="p-1 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors mr-1">
                                <Calendar className="h-3.5 w-3.5 text-blue-accent" />
                              </div>
                              <span>
                                {new Date(experience.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - 
                                {experience.current 
                                  ? " Present" 
                                  : experience.endDate ? " " + new Date(experience.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : " Present"}
                              </span>
                            </p>
                            {experience.description && (
                              <p className="text-sm mt-2 text-gray-300">{experience.description}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">No work experience added yet.</p>
                    )}
                  </CardContent>
                  <CardFooter className="relative z-10 border-t border-secondary-100/10">
                    <Button variant="gradient" size="sm" asChild className="w-full gap-1 group">
                      <Link href="/alumni/profile/experience/add" className="flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Experience
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-lg text-white">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    {userProfile.certifications && userProfile.certifications.length > 0 ? (
                      userProfile.certifications.map((cert) => (
                        <div key={cert.$id} className="glass p-4 rounded-md border border-secondary-100/10">
                          <h3 className="font-medium text-white">{cert.name}</h3>
                          <p className="text-sm text-gray-300 mt-1">
                            {cert.issuer}
                            <span className="mx-1 text-gray-500">•</span>
                            Issued {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            {cert.expiryDate && ` • Expires ${new Date(cert.expiryDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                          </p>
                          {cert.description && (
                            <p className="text-sm mt-1 text-gray-300">{cert.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">No certifications added yet.</p>
                    )}
                  </CardContent>
                  <CardFooter className="relative z-10 border-t border-secondary-100/10">
                    <Button variant="gradient" size="sm" asChild className="w-full gap-1 group">
                      <Link href="/alumni/profile/certification/add" className="flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Certification
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-lg text-white">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    {userProfile.education && userProfile.education.length > 0 ? (
                      userProfile.education.map((edu, index) => (
                        <div key={edu.$id} className={cn("relative pl-6", index !== userProfile.education!.length - 1 && "pb-6 border-l border-secondary-100/20 ml-2")}>
                          <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-blue-accent bg-primary-90"></div>
                          <div>
                            <h3 className="font-medium text-white">{edu.degree}</h3>
                            <p className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                              <div className="p-1 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
                                <GraduationCap className="h-3.5 w-3.5 text-blue-accent" />
                              </div>
                              <span>{edu.institution}</span>
                              {edu.location && (
                                <>
                                  <span className="mx-1 text-gray-500">•</span>
                                  <div className="p-1 rounded-md bg-gold-default/10 group-hover:bg-gold-default/20 transition-colors">
                                    <MapPin className="h-3.5 w-3.5 text-gold-default" />
                                  </div>
                                  <span>{edu.location}</span>
                                </>
                              )}
                            </p>
                            <p className="text-sm text-gray-300 mt-1 flex items-center">
                              <div className="p-1 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors mr-1">
                                <Calendar className="h-3.5 w-3.5 text-secondary-100" />
                              </div>
                              <span>{edu.startYear} - {edu.endYear}</span>
                            </p>
                            {edu.description && (
                              <p className="text-sm mt-2 text-gray-300">{edu.description}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">No education history added yet.</p>
                    )}
                  </CardContent>
                  <CardFooter className="relative z-10 border-t border-secondary-100/10">
                    <Button variant="gradient" size="sm" asChild className="w-full gap-1 group">
                      <Link href="/alumni/profile/education/add" className="flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Education
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container pt-8 pb-8 space-y-6">
        {/* Header Skeleton */}
        <div className="relative">
          <div className="absolute inset-0 h-40 bg-gradient-to-r from-blue-accent/20 via-secondary-100/10 to-primary-90/10 rounded-t-xl"></div>
          <div className="relative pt-16 px-6 pb-6 flex flex-col md:flex-row md:items-end gap-6">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-primary-90" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card variant="glass-dark" className="border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
            
            <Card variant="glass-dark" className="border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card variant="glass-dark" className="border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
              <CardHeader className="relative z-10">
                <Skeleton className="h-10 w-full" />
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}