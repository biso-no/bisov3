"use client"

import { UsersRound, GraduationCap, Calendar, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const stats = [
  {
    name: "Active alumni",
    value: "2,481",
    description: "Registered users",
    icon: UsersRound,
    change: "+12% from last month",
    positive: true,
  },
  {
    name: "Alumni events",
    value: "24",
    description: "This year",
    icon: Calendar,
    change: "+8 new this month",
    positive: true,
  },
  {
    name: "Mentorship connections",
    value: "153",
    description: "Active mentorships",
    icon: GraduationCap,
    change: "+35% from last month",
    positive: true,
  },
  {
    name: "Job opportunities",
    value: "47",
    description: "Active postings",
    icon: Briefcase,
    change: "+15 new this month",
    positive: true,
  },
]

export function AlumniStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={stat.name} className="relative overflow-hidden backdrop-blur-sm bg-background/50 border-primary/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
                <p className={cn(
                  "mt-2 text-xs font-medium",
                  stat.positive ? "text-green-500" : "text-red-500"
                )}>
                  {stat.change}
                </p>
              </div>
              <div className="p-2 rounded-md bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 h-1 transition-all",
                `w-[${(index + 1) * 25}%]`,
                index === 0 && "bg-blue-500",
                index === 1 && "bg-indigo-500",
                index === 2 && "bg-purple-500",
                index === 3 && "bg-pink-500"
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 