import { MapPin, Briefcase, GraduationCap, ArrowRight, MessageCircle, SearchX } from "lucide-react"
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
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
          <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
            <SearchX className="h-10 w-10 text-secondary-100" />
          </div>
        </div>
        <h3 className="text-xl font-medium mb-3 text-white">No alumni found</h3>
        <p className="text-gray-300 max-w-md mb-6">Try adjusting your search criteria or filters to find alumni members in our network.</p>
        <Button variant="gradient">Clear Filters</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      {alumni.map((profile) => (
        <Card 
          key={profile.$id} 
          variant="glass-dark" 
          className="group hover:shadow-card-hover transition-all duration-300 overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b opacity-80 transition-all duration-300 group-hover:w-2.5"
            style={{
              background: profile.company?.includes("Gold") 
                ? "linear-gradient(to bottom, #F7D64A, #BD9E16)" 
                : profile.location?.includes("York") 
                ? "linear-gradient(to bottom, #3DA9E0, #1A77E9)" 
                : "linear-gradient(to bottom, #1A77E9, #01417B)"
            }}
          />
          
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-5 group-hover:opacity-10 transition-opacity duration-300",
            getGradient(profile.name)
          )} />

          <CardContent className="p-4 z-10 relative">
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar className="h-16 w-16 border-2 border-secondary-100/20 shadow-glow-blue transition-all duration-300 group-hover:scale-105">
                <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-accent to-secondary-100 text-white font-bold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-white group-hover:text-secondary-100 transition-colors duration-300">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-gray-300">{profile.title || "Alumni"}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="glass" size="sm" asChild className="transition-all duration-300">
                      <Link href={`/alumni/${profile.$id}`} className="flex items-center gap-1">
                        View Profile
                        <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                    <Button variant="gradient" size="sm" className="transition-all duration-300 gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {profile.company && (
                    <div className="flex items-center gap-2 group/item">
                      <div className="p-1.5 rounded-md bg-blue-accent/20 group-hover/item:bg-blue-accent/30 transition-colors">
                        <Briefcase className="h-3.5 w-3.5 text-blue-accent" />
                      </div>
                      <span className="text-gray-200">{profile.company}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 group/item">
                      <div className="p-1.5 rounded-md bg-gold-default/20 group-hover/item:bg-gold-default/30 transition-colors">
                        <MapPin className="h-3.5 w-3.5 text-gold-default" />
                      </div>
                      <span className="text-gray-200">{profile.location}</span>
                    </div>
                  )}
                  {profile.graduationYear && (
                    <div className="flex items-center gap-2 group/item">
                      <div className="p-1.5 rounded-md bg-secondary-100/20 group-hover/item:bg-secondary-100/30 transition-colors">
                        <GraduationCap className="h-3.5 w-3.5 text-secondary-100" />
                      </div>
                      <span className="text-gray-200">Class of {profile.graduationYear}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {profile.skills && profile.skills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant={i % 3 === 0 ? "gradient" : i % 3 === 1 ? "glass-dark" : "gold"} 
                      className="text-xs font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}