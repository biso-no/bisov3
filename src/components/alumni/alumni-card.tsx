"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Briefcase, GraduationCap, Calendar, Link as LinkIcon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type AlumniProfile = {
  id: string
  name: string
  avatarUrl?: string
  position: string
  company: string
  location: string
  department: string
  graduationYear: string
  bio: string
  skills: string[]
  available: {
    mentoring: boolean
    jobOpportunities: boolean
    speaking: boolean
    networking: boolean
  }
  social: {
    linkedin?: string
    twitter?: string
    website?: string
  }
  lastActive: Date
}

interface AlumniCardProps {
  profile: AlumniProfile
  className?: string
  variant?: "default" | "compact"
}

export function AlumniCard({ profile, className, variant = "default" }: AlumniCardProps) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
    
  const isCompact = variant === "compact"
  
  return (
    <Card className={cn(
      "group overflow-hidden border-primary/10 hover:border-primary/20 transition-colors bg-background/50 backdrop-blur-sm",
      className
    )}>
      <CardContent className={cn(
        "p-6",
        isCompact && "p-4"
      )}>
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href={`/alumni/profile/${profile.id}`} className="block group-hover:scale-105 transition-transform duration-200">
            <Avatar className={cn(
              "h-24 w-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
              isCompact && "h-16 w-16"
            )}>
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div>
            <Link 
              href={`/alumni/profile/${profile.id}`}
              className="font-medium text-lg inline-block hover:text-primary transition-colors"
            >
              {profile.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.position} at {profile.company}
            </p>
          </div>
          
          {!isCompact && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {profile.available.mentoring && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs py-0 h-5 border-blue-500/40 text-blue-500 bg-blue-500/10">
                        Mentor
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Available for mentoring</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {profile.available.jobOpportunities && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs py-0 h-5 border-green-500/40 text-green-500 bg-green-500/10">
                        Hiring
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Has job opportunities</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {profile.available.speaking && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs py-0 h-5 border-purple-500/40 text-purple-500 bg-purple-500/10">
                        Speaker
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Available for speaking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {profile.available.networking && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs py-0 h-5 border-orange-500/40 text-orange-500 bg-orange-500/10">
                        Networking
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open to networking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
        
        {!isCompact && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{profile.department}, Class of {profile.graduationYear}</span>
            </div>
            {profile.social.linkedin && (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={profile.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "px-6 pb-6 pt-0 flex gap-2",
        isCompact && "px-4 pb-4 gap-1"
      )}>
        <Button asChild size={isCompact ? "sm" : "default"} className="flex-1" variant="outline">
          <Link href={`/alumni/profile/${profile.id}`}>View Profile</Link>
        </Button>
        <Button size={isCompact ? "sm" : "default"} className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  )
} 