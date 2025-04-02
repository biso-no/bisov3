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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-8">
      {stats.map((stat, index) => (
        <Card 
          key={stat.name} 
          className={cn(
            "relative overflow-hidden glass-dark border-0 transition-all duration-300 group hover:shadow-card-hover",
            index === 0 && "from-primary-100 to-primary-80",
            index === 1 && "from-blue-default to-blue-accent",
            index === 2 && "from-secondary-100 to-secondary-80",
            index === 3 && "from-gold-strong to-gold-default",
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: index === 0 ? 'linear-gradient(135deg, #001731 0%, #002753 100%)' :
                        index === 1 ? 'linear-gradient(135deg, #01417B 0%, #1A77E9 100%)' :
                        index === 2 ? 'linear-gradient(135deg, #3DA9E0 0%, #65bce6 100%)' :
                        'linear-gradient(135deg, #BD9E16 0%, #F7D64A 100%)'
            }}
          />
          
          {/* Decorative elements */}
          <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-opacity-20 blur-xl"
            style={{
              backgroundColor: index === 0 ? '#001731' :
                              index === 1 ? '#1A77E9' :
                              index === 2 ? '#3DA9E0' :
                              '#F7D64A'
            }}
          />
          <div className="absolute right-10 bottom-10 w-32 h-32 rounded-full bg-opacity-10 blur-3xl"
            style={{
              backgroundColor: index === 0 ? '#001731' :
                              index === 1 ? '#1A77E9' :
                              index === 2 ? '#3DA9E0' :
                              '#F7D64A'
            }}
          />
          
          <CardContent className="p-6 z-10 relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300 mb-1">
                  {stat.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className={cn(
                    "text-4xl font-bold tracking-tight transition-all duration-300 group-hover:translate-y-[-2px]",
                    index === 0 ? "text-white" :
                    index === 1 ? "text-blue-accent" :
                    index === 2 ? "text-secondary-100" :
                    "gradient-text-gold"
                  )}>
                    {stat.value}
                  </p>
                  <span className="text-xs text-gray-400 font-medium">
                    {stat.description}
                  </span>
                </div>
                <p className={cn(
                  "mt-3 text-xs font-medium flex items-center gap-1",
                  stat.positive ? "text-green-400" : "text-red-400"
                )}>
                  <span className="inline-block">
                    {stat.positive ? "↑" : "↓"}
                  </span>
                  {stat.change}
                </p>
              </div>
              <div className={cn(
                "p-3 rounded-lg transition-all duration-300 group-hover:scale-110",
                index === 0 ? "bg-primary-80/30" :
                index === 1 ? "bg-blue-accent/30" :
                index === 2 ? "bg-secondary-80/30" :
                "bg-gold-default/30"
              )}>
                <stat.icon className={cn(
                  "h-6 w-6",
                  index === 0 ? "text-white" :
                  index === 1 ? "text-blue-accent" :
                  index === 2 ? "text-secondary-100" :
                  "text-gold-default"
                )} />
              </div>
            </div>
            
            {/* Progress bar with animation */}
            <div className="mt-4 bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out animate-pulse",
                  index === 0 ? "bg-white" :
                  index === 1 ? "bg-blue-accent" :
                  index === 2 ? "bg-secondary-100" :
                  "bg-gold-default"
                )}
                style={{ width: `${(index + 1) * 25}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 