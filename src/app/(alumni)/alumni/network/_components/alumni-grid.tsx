import { UserProfile } from "@/lib/types/alumni"
import { AlumniCard } from "./alumni-card"

interface AlumniGridProps {
  alumni: UserProfile[];
}

export function AlumniGrid({ alumni }: AlumniGridProps) {
  if (alumni.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No alumni found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {alumni.map((profile) => (
        <AlumniCard key={profile.$id} profile={profile} />
      ))}
    </div>
  )
}