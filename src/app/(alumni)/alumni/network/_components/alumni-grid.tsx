import { UserProfile } from "@/lib/types/alumni"
import { AlumniCard } from "./alumni-card"
import { UsersRound, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlumniGridProps {
  alumni: UserProfile[];
}

export function AlumniGrid({ alumni }: AlumniGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {alumni.map((profile, index) => (
        <AlumniCard 
          key={profile.$id} 
          profile={profile} 
        />
      ))}
    </div>
  )
}