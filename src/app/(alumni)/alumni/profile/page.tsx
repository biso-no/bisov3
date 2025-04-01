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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground">Could not load your profile information</p>
        <Button asChild>
          <Link href="/alumni/profile/edit">Create Profile</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative">
        <div className="absolute inset-0 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-t-xl"></div>
        
        <div className="relative pt-16 px-6 pb-6 flex flex-col md:flex-row md:items-end gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground mt-1">{userProfile.title} {userProfile.company ? `at ${userProfile.company}` : ''}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userProfile.graduationYear && (
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      <span>Class of {userProfile.graduationYear}</span>
                    </Badge>
                  )}
                  {userProfile.location && (
                    <Badge variant="outline" className="bg-muted/50 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{userProfile.location}</span>
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/alumni/profile/edit">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Link>
                </Button>
                <LinkedInConnect userId={userProfile.userId} />
                <Button size="sm">
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
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completion</span>
                  <span className="text-sm font-medium">{userProfile.profileCompletion || 0}%</span>
                </div>
                <Progress value={userProfile.profileCompletion || 0} className="h-2" />
                
                <div className="bg-muted/30 rounded-md p-3 text-sm space-y-2">
                  <p className="font-medium">Complete your profile</p>
                  <ul className="space-y-1 text-muted-foreground">
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
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {(!userProfile.privacySettings || userProfile.privacySettings.showEmail) && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.email}</span>
                </div>
              )}
              
              {userProfile.privacySettings?.showPhone && userProfile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              
              {userProfile.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.location}</span>
                </div>
              )}
              
              {(!userProfile.privacySettings || userProfile.privacySettings.showSocial) && social && (
                <div className="pt-2 space-y-3">
                  <Separator />
                  
                  {social.linkedin && (
                    <a 
                      href={social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  
                  {social.twitter && (
                    <a 
                      href={social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter Profile</span>
                    </a>
                  )}
                  
                  {social.website && (
                    <a 
                      href={social.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Personal Website</span>
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Skills Card */}
          {userProfile.skills && userProfile.skills.length > 0 && (
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {userProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Languages Card */}
          {userProfile.languages && userProfile.languages.length > 0 && (
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userProfile.languages.map((lang, index) => (
                    <div key={lang.$id || index} className="flex justify-between items-center text-sm">
                      <span>{lang.language}</span>
                      <Badge variant="outline" className="bg-muted/30">
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
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            
            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile.bio ? (
                    <p className="text-muted-foreground">{userProfile.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No bio information added yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {userProfile.interests && userProfile.interests.length > 0 && (
                <Card className="border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {userProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="bg-muted/30">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>Show Email</span>
                      </div>
                      <Badge 
                        variant={!userProfile.privacySettings || userProfile.privacySettings.showEmail ? "default" : "outline"} 
                        className={!userProfile.privacySettings || userProfile.privacySettings.showEmail ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none" : ""}
                      >
                        {!userProfile.privacySettings || userProfile.privacySettings.showEmail ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Show Phone</span>
                      </div>
                      <Badge 
                        variant={userProfile.privacySettings?.showPhone ? "default" : "outline"} 
                        className={userProfile.privacySettings?.showPhone ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none" : ""}
                      >
                        {userProfile.privacySettings?.showPhone ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>Allow Messages</span>
                      </div>
                      <Badge 
                        variant={userProfile.privacySettings?.allowMessages ? "default" : "outline"} 
                        className={userProfile.privacySettings?.allowMessages ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none" : ""}
                      >
                        {userProfile.privacySettings?.allowMessages ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Available as Mentor</span>
                      </div>
                      <Badge 
                        variant={userProfile.privacySettings?.allowMentoring ? "default" : "outline"} 
                        className={userProfile.privacySettings?.allowMentoring ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none" : ""}
                      >
                        {userProfile.privacySettings?.allowMentoring ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild className="w-full">
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
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userProfile.experiences && userProfile.experiences.length > 0 ? (
                    userProfile.experiences.map((experience, index) => (
                      <div key={experience.$id} className={cn("relative pl-6", index !== userProfile.experiences!.length - 1 && "pb-6 border-l border-muted-foreground/20 ml-2")}>
                        <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                        <div>
                          <h3 className="font-medium">{experience.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Building className="h-3.5 w-3.5" />
                            <span>{experience.company}</span>
                            {experience.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{experience.location}</span>
                              </>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5 inline-block mr-1" />
                            <span>
                              {new Date(experience.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - 
                              {experience.current 
                                ? " Present" 
                                : experience.endDate ? " " + new Date(experience.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : " Present"}
                            </span>
                          </p>
                          {experience.description && (
                            <p className="text-sm mt-2">{experience.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No work experience added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/alumni/profile/experience/add">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Experience
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.certifications && userProfile.certifications.length > 0 ? (
                    userProfile.certifications.map((cert) => (
                      <div key={cert.$id} className="p-3 bg-muted/20 rounded-md">
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cert.issuer}
                          <span className="mx-1">•</span>
                          Issued {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          {cert.expiryDate && ` • Expires ${new Date(cert.expiryDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                        </p>
                        {cert.description && (
                          <p className="text-sm mt-1">{cert.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No certifications added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/alumni/profile/certification/add">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Certification
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userProfile.education && userProfile.education.length > 0 ? (
                    userProfile.education.map((edu, index) => (
                      <div key={edu.$id} className={cn("relative pl-6", index !== userProfile.education!.length - 1 && "pb-6 border-l border-muted-foreground/20 ml-2")}>
                        <div className="absolute top-1 left-0 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>{edu.institution}</span>
                            {edu.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{edu.location}</span>
                              </>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5 inline-block mr-1" />
                            <span>{edu.startYear} - {edu.endYear}</span>
                          </p>
                          {edu.description && (
                            <p className="text-sm mt-2">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No education history added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/alumni/profile/education/add">
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
  )
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-t-xl"></div>
        <div className="relative pt-16 px-6 pb-6 flex flex-col md:flex-row md:items-end gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
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
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}