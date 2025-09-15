import { MapPin, Briefcase, GraduationCap, ArrowRight, MessageCircle, SearchX, Lock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { UserProfile } from "@/lib/types/alumni"
import { cn } from "@/lib/utils"

interface AlumniListProps {
  alumni: UserProfile[];
}

export function AlumniList({ alumni }: AlumniListProps) {
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a gradient based on the user's name (for consistent colors per user)
  const getGradient = (name: string) => {
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % 4;
    
    switch(index) {
      case 0:
        return "from-blue-accent/30 via-transparent to-transparent";
      case 1: 
        return "from-secondary-100/30 via-transparent to-transparent";
      case 2:
        return "from-gold-default/30 via-transparent to-transparent";
      default:
        return "from-blue-strong/30 via-transparent to-transparent";
    }
  };
  
  if (alumni.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
          <div className="relative z-10 p-5 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
            <SearchX className="h-12 w-12 text-blue-accent" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No alumni found</h2>
        <p className="text-gray-300 max-w-md">
          No alumni match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {alumni.map((profile) => (
        <Card 
          key={profile.$id}
          variant="glass-dark" 
          className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group border-0"
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-accent/10 to-secondary-100/10 opacity-30" />
          <CardContent className="p-4 z-10 relative">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-secondary-100/20 shadow-glow-blue transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
                  <AvatarFallback className="bg-linear-to-br from-blue-accent to-secondary-100 text-white font-bold">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                
                {profile.privacySettings?.profileVisibility === 'limited' && (
                  <div className="absolute -top-1 -right-1 bg-primary-90 rounded-full p-1 border border-secondary-100/20" title="Limited Profile">
                    <Lock className="h-3 w-3 text-secondary-100" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-white group-hover:text-secondary-100 transition-colors duration-300 flex items-center gap-2">
                      {profile.name}
                      {profile.privacySettings?.profileVisibility === 'connections' && (
                        <Badge variant="glass-dark" className="text-xs font-normal">
                          Connections
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-300">{profile.title || "Alumni"}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="glass" size="sm" asChild className="transition-all duration-300">
                      <Link href={`/alumni/profile/${profile.$id}`} className="flex items-center gap-1">
                        View Profile
                        <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                    {profile.privacySettings?.allowMessages !== false && (
                      <Button variant="gradient" size="sm" className="transition-all duration-300 gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {profile.location && profile.privacySettings?.showLocation !== false && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gold-default" />
                      <span className="text-gray-300">{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.company && profile.privacySettings?.showWork !== false && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-blue-accent" />
                      <span className="text-gray-300">{profile.company}</span>
                    </div>
                  )}
                  
                  {profile.graduationYear && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-secondary-100" />
                      <span className="text-gray-300">Class of {profile.graduationYear}</span>
                    </div>
                  )}
                </div>
                
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 5).map((skill, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="bg-blue-accent/10 text-blue-accent border-blue-accent/20 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 5 && (
                      <Badge variant="outline" className="bg-primary-80/30 text-gray-300 border-white/10 text-xs">
                        +{profile.skills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}