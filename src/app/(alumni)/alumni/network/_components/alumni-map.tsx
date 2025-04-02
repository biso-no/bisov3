import { Card, CardContent } from "@/components/ui/card"
import { UserProfile } from "@/lib/types/alumni"
import { MapPin, Globe, Map } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlumniMapProps {
  alumni: UserProfile[];
}

export function AlumniMap({ alumni }: AlumniMapProps) {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0">
      <CardContent className="p-0 aspect-[16/9] relative">
        {/* Map background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-80 to-primary-60 opacity-40" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Glow points representing alumni locations */}
        <div className="absolute inset-0">
          {Array.from({ length: Math.min(alumni.length, 20) }).map((_, index) => {
            // Random positions for the dots
            const x = Math.floor(Math.random() * 85) + 5; // 5% to 90%
            const y = Math.floor(Math.random() * 85) + 5; // 5% to 90%
            const size = Math.floor(Math.random() * 12) + 8; // 8px to 20px
            const delay = Math.random() * 5; // 0 to 5s delay
            
            return (
              <div 
                key={index}
                className="absolute rounded-full bg-secondary-100 opacity-60 animate-pulse"
                style={{
                  left: `${x}%`, 
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  boxShadow: '0 0 15px rgba(61, 169, 224, 0.7)',
                  animationDelay: `${delay}s`,
                  animationDuration: '3s'
                }}
              />
            );
          })}
        </div>
        
        {/* Map pin icons */}
        <div className="absolute inset-0">
          {Array.from({ length: Math.min(alumni.length / 2, 10) }).map((_, index) => {
            // Random positions for the pins
            const x = Math.floor(Math.random() * 90) + 5; // 5% to 95%
            const y = Math.floor(Math.random() * 90) + 5; // 5% to 95%
            const size = 24; // pin size
            
            return (
              <div 
                key={index}
                className="absolute animate-float"
                style={{
                  left: `${x}%`, 
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${index * 0.5}s`,
                }}
              >
                <MapPin className="w-full h-full text-blue-accent drop-shadow-md" />
              </div>
            );
          })}
        </div>
        
        {/* Central content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass p-8 rounded-2xl backdrop-blur-lg text-center max-w-md">
            <div className="bg-blue-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-blue-accent animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Map View Coming Soon</h3>
            <p className="text-gray-200 mb-4">
              Soon you&apos;ll be able to explore {alumni.length} alumni visually across the globe based on their locations.
            </p>
            <Button variant="gradient" className="mx-auto">
              <Map className="h-4 w-4 mr-2" />
              Get Notified When Available
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}