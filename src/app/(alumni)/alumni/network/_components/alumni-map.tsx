"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { UserProfile } from "@/lib/types/alumni"
import { MapPin, Globe, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('./map-component').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full backdrop-blur-sm bg-primary-100/50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full blur-lg bg-blue-accent/30 animate-pulse"></div>
          <Globe className="w-10 h-10 text-blue-accent absolute inset-0 m-auto" />
        </div>
        <p className="text-white">Loading map...</p>
      </div>
    </div>
  )
})

interface AlumniMapProps {
  alumni: UserProfile[];
}

// Helper function to get coordinates from location string
const getCoordinates = async (location: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
};

export function AlumniMap({ alumni }: AlumniMapProps) {
  const [positions, setPositions] = useState<Array<[UserProfile, [number, number]]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadGeocodedPositions = async () => {
      setIsLoading(true);
      const results: Array<[UserProfile, [number, number]]> = [];
      
      // Process alumni with locations in batches to avoid rate limiting
      const alumniWithLocation = alumni.filter(profile => profile.location);
      
      for (const profile of alumniWithLocation) {
        if (profile.location) {
          // Add a small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const coords = await getCoordinates(profile.location);
          if (coords) {
            results.push([profile, coords]);
          }
        }
      }
      
      setPositions(results);
      setIsLoading(false);
    };
    
    loadGeocodedPositions();
  }, [alumni]);
  
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 relative">
      <CardContent className="p-0 aspect-video relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-primary-100/50">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full blur-lg bg-blue-accent/30 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <Globe className="w-10 h-10 text-blue-accent absolute inset-0 m-auto" />
              </div>
              <p className="text-white">Loading alumni locations...</p>
            </div>
          </div>
        )}
        
        {/* Map container */}
        {!alumni.some(profile => profile.location) ? (
          <div className="absolute inset-0 bg-linear-to-br from-primary-80 to-primary-60 flex items-center justify-center">
            <div className="glass p-8 rounded-2xl backdrop-blur-lg text-center max-w-md">
              <div className="bg-blue-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Locations Available</h3>
              <p className="text-gray-200">
                Alumni profiles don&apos;t have location information yet. 
                As more alumni update their profiles with locations, they&apos;ll appear on this map.
              </p>
            </div>
          </div>
        ) : (
          <Map alumni={positions} totalCount={alumni.length} />
        )}
      </CardContent>
    </Card>
  );
}