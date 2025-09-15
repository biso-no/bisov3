"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  BarChart,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Simple analytics card component
function AnalyticsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  change, 
  changeType = "neutral" 
}: { 
  title: string
  value: string
  description: string
  icon: any
  change?: string
  changeType?: "positive" | "negative" | "neutral" 
}) {
  return (
    <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-secondary-100/5 opacity-20" />
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
          <div className="p-1.5 rounded-md bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
            <Icon className="h-4 w-4 text-purple-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center mt-1 text-xs">
          <p className="text-gray-300">{description}</p>
          {change && (
            <div className={`flex items-center ml-auto text-xs font-medium ${
              changeType === "positive" ? "text-green-500" : 
              changeType === "negative" ? "text-red-500" : 
              "text-gray-300"
            }`}>
              {changeType === "positive" ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : changeType === "negative" ? (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              ) : null}
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Admin shortcut component
function AdminAction({ title, href, icon: Icon, description }: { 
  title: string
  href: string
  icon: any
  description: string
}) {
  return (
    <Button variant="ghost" asChild className="h-auto p-3 justify-start w-full hover:bg-purple-500/10">
      <Link href={href} className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-purple-500/20">
          <Icon className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-xs text-gray-300 mt-0.5">{description}</div>
        </div>
      </Link>
    </Button>
  )
}

export default function AdminDashboard() {
  // For this example, we'll use dummy data
  // In a real app, you would fetch this data from your backend
  
  const stats = [
    { 
      title: "Total Users", 
      value: "1,294", 
      description: "Active alumni members", 
      icon: Users,
      change: "+12%",
      changeType: "positive" as "positive"
    },
    { 
      title: "Event Registrations", 
      value: "582", 
      description: "Across all events", 
      icon: Calendar,
      change: "+8%",
      changeType: "positive" as "positive"
    },
    { 
      title: "Mentoring Sessions", 
      value: "76", 
      description: "Past 30 days", 
      icon: BookOpen,
      change: "-5%",
      changeType: "negative" as "negative"
    },
    { 
      title: "Job Applications", 
      value: "249", 
      description: "Current quarter", 
      icon: Briefcase,
      change: "+24%",
      changeType: "positive" as "positive"
    }
  ]
  
  const quickActions = [
    { 
      title: "Manage Users", 
      href: "/alumni/admin/users", 
      icon: Users,
      description: "View and manage alumni network users" 
    },
    { 
      title: "Feature Flags", 
      href: "/alumni/admin/feature-flags", 
      icon: Settings,
      description: "Enable or disable features in the alumni portal" 
    },
    { 
      title: "Create Event", 
      href: "/alumni/admin/events/new", 
      icon: Calendar,
      description: "Add a new event to the alumni calendar" 
    },
    { 
      title: "Manage Mentoring", 
      href: "/alumni/admin/mentoring", 
      icon: BookOpen,
      description: "Oversee mentoring programs and applications" 
    },
    { 
      title: "Manage Mentors", 
      href: "/alumni/admin/mentors", 
      icon: BookOpen,
      description: "Oversee mentoring programs and applications" 
    },
    { 
      title: "Post Job", 
      href: "/alumni/admin/jobs/new", 
      icon: Briefcase,
      description: "Add a new job posting to the job board" 
    }
  ]
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <AnalyticsCard 
            key={i}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card variant="glass-dark" className="border-0 overflow-hidden md:col-span-1 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-secondary-100/5 opacity-20" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-300">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-1">
            {quickActions.map((action, i) => (
              <AdminAction 
                key={i}
                title={action.title}
                href={action.href}
                icon={action.icon}
                description={action.description}
              />
            ))}
          </CardContent>
        </Card>
        
        {/* Recent activity */}
        <Card variant="glass-dark" className="border-0 overflow-hidden md:col-span-2 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-secondary-100/5 opacity-20" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-300">Latest actions in the alumni portal</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {/* Placeholder for activity feed - in a real app, fetch this data */}
              <div className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-md transition-colors">
                <div className="p-1.5 rounded-full bg-blue-accent/20">
                  <Users className="h-4 w-4 text-blue-accent" />
                </div>
                <div>
                  <p className="text-sm text-white">New user registration</p>
                  <p className="text-xs text-gray-400">John Smith joined the network</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-md transition-colors">
                <div className="p-1.5 rounded-full bg-gold-default/20">
                  <Calendar className="h-4 w-4 text-gold-default" />
                </div>
                <div>
                  <p className="text-sm text-white">Event registration</p>
                  <p className="text-xs text-gray-400">15 people registered for &quot;Annual Alumni Networking&quot;</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-md transition-colors">
                <div className="p-1.5 rounded-full bg-green-500/20">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-white">New discussion</p>
                  <p className="text-xs text-gray-400">Discussion started in Mentoring forum</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 