"use client"

import { AlumniCard } from "./alumni-card"
import { alumniProfiles } from "./alumni-data"

export function AlumniGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alumniProfiles.map((profile) => (
        <AlumniCard key={profile.id} profile={profile} />
      ))}
    </div>
  )
} 