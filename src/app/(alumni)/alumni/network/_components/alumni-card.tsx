import { MapPin, Briefcase, GraduationCap, MessageCircle, Lock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/lib/types/alumni"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AlumniCardProps {
  profile: UserProfile;
}

export function AlumniCard({ profile }: AlumniCardProps) {
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
        return "from-blue-accent/20 to-secondary-100/30";
      case 1: 
        return "from-secondary-100/20 to-blue-accent/30";
      case 2:
        return "from-gold-default/20 to-gold-strong/30";
      default:
        return "from-blue-strong/20 to-blue-accent/30";
    }
  };

  // Get privacy settings with defaults
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
  };

  // Check if profile has limited visibility
  const hasLimitedVisibility = privacySettings.profileVisibility === 'limited';

  return (
    <Card 
      variant="glass-dark" 
      className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group"
    >
      <div className={cn(
        "h-24 bg-gradient-to-r transition-opacity duration-300 group-hover:opacity-80",
        getGradient(profile.name)
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)] opacity-70" />
      </div>
      
      <CardContent className="p-6 pt-0 -mt-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary-90 shadow-glow-blue transition-all duration-300 group-hover:scale-105">
              <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-accent to-secondary-100 text-white font-bold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            
            {hasLimitedVisibility && (
              <div className="absolute -top-2 -right-2 bg-primary-90 rounded-full p-1 border border-secondary-100/20" title="Limited Profile">
                <Lock className="h-4 w-4 text-secondary-100" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mt-4 text-white group-hover:text-secondary-100 transition-colors">
            {profile.name}
            {privacySettings.profileVisibility === 'connections' && (
              <Badge variant="glass-dark" className="ml-2 text-xs font-normal">
                Connections
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-300">{profile.title || "Alumni"}</p>
          
          <div className="w-full space-y-3 mt-5">
            {profile.company && privacySettings.showWork && (
              <div className="flex items-center gap-2 text-sm group/item">
                <div className="p-1.5 rounded-md bg-blue-accent/20 group-hover/item:bg-blue-accent/30 transition-colors">
                  <Briefcase className="h-3.5 w-3.5 text-blue-accent" />
                </div>
                <span className="text-gray-200 group-hover/item:text-white transition-colors">
                  {profile.company}
                </span>
              </div>
            )}
            {profile.location && privacySettings.showLocation && (
              <div className="flex items-center gap-2 text-sm group/item">
                <div className="p-1.5 rounded-md bg-gold-default/20 group-hover/item:bg-gold-default/30 transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-gold-default" />
                </div>
                <span className="text-gray-200 group-hover/item:text-white transition-colors">
                  {profile.location}
                </span>
              </div>
            )}
            {profile.graduationYear && (
              <div className="flex items-center gap-2 text-sm group/item">
                <div className="p-1.5 rounded-md bg-secondary-100/20 group-hover/item:bg-secondary-100/30 transition-colors">
                  <GraduationCap className="h-3.5 w-3.5 text-secondary-100" />
                </div>
                <span className="text-gray-200 group-hover/item:text-white transition-colors">
                  Class of {profile.graduationYear}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
            {profile.skills && profile.skills.slice(0, 3).map((skill, i) => (
              <Badge 
                key={i} 
                variant={i === 0 ? "gradient" : i === 1 ? "glass-dark" : "gold"} 
                className="text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
            {profile.skills && profile.skills.length > 3 && (
              <Badge variant="glass-dark" className="text-xs font-normal">
                +{profile.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button variant="glass" size="sm" asChild className="flex-1">
          <Link href={`/alumni/profile/${profile.$id}`}>View Profile</Link>
        </Button>
        {privacySettings.allowMessages && (
          <Button variant="gradient" size="sm" className="flex-1 gap-1">
            <MessageCircle className="h-4 w-4" />
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}