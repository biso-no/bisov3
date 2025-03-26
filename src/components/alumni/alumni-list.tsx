"use client"

import Link from "next/link"
import { format } from "date-fns"
import { MapPin, Briefcase, GraduationCap, Calendar, Mail, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlumniProfile } from "./alumni-card"
import { alumniProfiles } from "./alumni-data"
import { cn } from "@/lib/utils"

// Helper function to format last active date in a stable way
function formatLastActive(date: Date): string {
  return `Active ${format(date, "MMM d, yyyy")}`;
}

export function AlumniList() {
  return (
    <div className="space-y-4">
      {alumniProfiles.map((profile) => (
        <AlumniListItem key={profile.id} profile={profile} />
      ))}
    </div>
  )
}

interface AlumniListItemProps {
  profile: AlumniProfile
}

function AlumniListItem({ profile }: AlumniListItemProps) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <Link href={`/alumni/profile/${profile.id}`}>
              <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex gap-2">
              <Button size="sm" className="w-full">
                <Mail className="h-3.5 w-3.5 mr-1" />
                Connect
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <Link 
                  href={`/alumni/profile/${profile.id}`}
                  className="font-medium text-lg inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                  {profile.name}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {profile.position} at {profile.company}
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {formatLastActive(profile.lastActive)}
              </p>
            </div>
            
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
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
            
            <p className="text-sm mt-3 text-muted-foreground">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs py-0 h-5">
                  {skill}
                </Badge>
              ))}
              {profile.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs py-0 h-5">
                  +{profile.skills.length - 4} more
                </Badge>
              )}
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex flex-wrap gap-1.5">
              {profile.available.mentoring && (
                <Badge variant="outline" className="text-xs py-0 h-5 border-blue-500/40 text-blue-500 bg-blue-500/10">
                  Available for mentoring
                </Badge>
              )}
              
              {profile.available.jobOpportunities && (
                <Badge variant="outline" className="text-xs py-0 h-5 border-green-500/40 text-green-500 bg-green-500/10">
                  Has job opportunities
                </Badge>
              )}
              
              {profile.available.speaking && (
                <Badge variant="outline" className="text-xs py-0 h-5 border-purple-500/40 text-purple-500 bg-purple-500/10">
                  Available for speaking
                </Badge>
              )}
              
              {profile.available.networking && (
                <Badge variant="outline" className="text-xs py-0 h-5 border-orange-500/40 text-orange-500 bg-orange-500/10">
                  Open to networking
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 