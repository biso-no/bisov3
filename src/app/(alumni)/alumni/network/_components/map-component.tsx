"use client"

import { useEffect } from "react"
import { UserProfile } from "@/lib/types/alumni"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Info, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

// MapRecenter component to center the map on our markers
function MapRecenter({ coordinates }: { coordinates: Array<[number, number]> }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      // Create bounds from the array of coordinates
      if (coordinates.length === 1) {
        // If only one point, center on it
        map.setView(coordinates[0], 10);
      } else {
        try {
          // With multiple points, fit bounds
          const boundsArray = coordinates.map(coord => [coord[0], coord[1]]);
          map.fitBounds(boundsArray as any);
        } catch (error) {
          console.error("Error fitting bounds:", error);
          // Fallback to default view
          map.setView([40, -95], 3);
        }
      }
    }
  }, [coordinates, map]);
  
  return null;
}

interface MapComponentProps {
  alumni: Array<[UserProfile, [number, number]]>;
  totalCount: number;
}

export default function MapComponent({ alumni, totalCount }: MapComponentProps) {
  const defaultCenter: [number, number] = [40, -95]; // Default center (US)
  const defaultZoom = 3;
  
  // Extract just the coordinates for the bounds
  const coordinates = alumni.map(([_, pos]) => pos);
  
  // Fix for Leaflet's icons with Next.js
  useEffect(() => {
    // Import on the client side only
    if (typeof window !== 'undefined') {
      // Only import on the client side
      require("leaflet-defaulticon-compatibility");
    }
  }, []);
  
  return (
    <div className="h-full w-full" id="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {coordinates.length > 0 && <MapRecenter coordinates={coordinates} />}
        
        {alumni.map(([profile, position], index) => (
          <Marker key={profile.$id || index} position={position}>
            <Popup className="leaflet-popup">
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-10 w-10 border-2 border-secondary-100/20">
                    {profile.avatarUrl ? (
                      <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-accent to-secondary-100 text-white">
                        {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{profile.name}</h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="h-5 px-1 text-xs bg-secondary-100/10 text-secondary-100 border-secondary-100/20">
                        {profile.graduationYear || 'Alumni'}
                      </Badge>
                      {profile.department && (
                        <Badge variant="outline" className="h-5 px-1 text-xs bg-blue-accent/10 text-blue-accent border-blue-accent/20">
                          {profile.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {profile.title && profile.company && (
                  <div className="text-xs mb-2">
                    <span className="text-gray-600">{profile.title}</span> at <span className="font-medium">{profile.company}</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                <Button variant="glass-dark" className="w-full mt-2 text-xs h-7 bg-blue-accent/10 hover:bg-blue-accent/20">
                  View Profile
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <div className="leaflet-bottom leaflet-right p-3">
          <div className="glass-dark p-2 rounded-md shadow-lg text-xs text-white">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Info className="h-3 w-3 text-blue-accent" />
                  <span>Showing {alumni.length} of {totalCount} alumni</span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Only alumni with location data are shown on the map</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </MapContainer>
    </div>
  );
} 