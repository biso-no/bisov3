import { Card, CardContent } from "@/components/ui/card"
import { UserProfile } from "@/lib/types/alumni"

interface AlumniMapProps {
  alumni: UserProfile[];
}

export function AlumniMap({ alumni }: AlumniMapProps) {
  return (
    <Card>
      <CardContent className="p-0 aspect-[16/9] bg-muted relative flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>Map view is coming soon!</p>
          <p>This would display {alumni.length} alumni on a map based on their locations.</p>
        </div>
      </CardContent>
    </Card>
  )
}