"use client"

import { useEffect } from "react"
import { UserProfile } from "@/lib/types/alumni"
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from "react-leaflet"
import { Info, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import L from 'leaflet';
import { useRouter } from "next/navigation";
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

// Create a custom marker icon to match the theme
const createCustomIcon = (profile: UserProfile) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="w-8 h-8 rounded-full bg-linear-to-br from-blue-accent to-secondary-100 flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 relative">
        <div class="absolute inset-0 rounded-full bg-blue-accent opacity-30 animate-ping"></div>
        <span class="text-xs font-semibold">${profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function MapComponent({ alumni, totalCount }: MapComponentProps) {
  const defaultCenter: [number, number] = [40, -95]; // Default center (US)
  const defaultZoom = 3;
  
  // Extract just the coordinates for the bounds
  const coordinates = alumni.map(([_, pos]) => pos);
  const router = useRouter();
  // Fix for Leaflet's icons with Next.js
  useEffect(() => {
    // Import on the client side only
    if (typeof window !== 'undefined') {
      // Only import on the client side
      require("leaflet-defaulticon-compatibility");
      
      // Add custom CSS for the map components
      const style = document.createElement('style');
      style.textContent = `
        .leaflet-container {
          background: #0a101d;
          font-family: inherit;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(20, 30, 50, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(61, 169, 224, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          color: #fff;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: rgba(61, 169, 224, 0.8);
        }
        
        .leaflet-control-zoom {
          border: none !important;
          margin: 15px !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(20, 30, 50, 0.8) !important;
          backdrop-filter: blur(4px);
          color: #fff !important;
          border: 1px solid rgba(61, 169, 224, 0.3) !important;
          transition: all 0.2s ease;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(61, 169, 224, 0.8) !important;
        }
        
        /* Make map features more subtle */
        .map-tiles {
          filter: saturate(0.5) brightness(0.9);
        }
        
        /* Make attribution nearly invisible */
        .leaflet-control-attribution {
          background-color: transparent !important;
          color: rgba(255, 255, 255, 0.1) !important;
          font-size: 6px !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .leaflet-control-attribution a {
          color: rgba(255, 255, 255, 0.1) !important;
        }
      `;
      document.head.appendChild(style);
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
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='OSM'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          className="map-tiles"
          /* Alternative map styles you can use:
          
          // Light minimal style:
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          
          // Voyager (minimal with some color accents):
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          
          // Stamen Toner Light (very minimal):
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          
          */
        />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary-100/10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-br from-blue-accent/5 to-secondary-100/5"></div>
        </div>
        
        {/* Add custom attribution with styled position */}
        <AttributionControl 
          position="bottomright" 
          prefix="" 
        />
        
        {coordinates.length > 0 && <MapRecenter coordinates={coordinates} />}
        
        {alumni.map(([profile, position], index) => (
          <Marker 
            key={profile.$id || index} 
            position={position}
            icon={createCustomIcon(profile)}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-10 w-10 border-2 border-secondary-100/20">
                    {profile.avatarUrl ? (
                      <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    ) : (
                      <AvatarFallback className="bg-linear-to-br from-blue-accent to-secondary-100 text-white">
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
                
                <Button variant="glass-dark" className="w-full mt-2 text-xs h-7 bg-blue-accent/10 hover:bg-blue-accent/20" onClick={() => router.push(`/alumni/profile/${profile.$id}`)}>
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