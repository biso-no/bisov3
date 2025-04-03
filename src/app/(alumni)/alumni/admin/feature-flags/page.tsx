import { Suspense } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings } from "lucide-react"
import { adminFeatureFlag } from "@/lib/flags"
import { getFeatureFlags } from "../actions"
import { redirect } from "next/navigation"
import { FeatureFlagToggle } from "./feature-flag-toggle"

interface FeatureFlag {
  $id: string
  key: string
  title: string
  description: string
  enabled: boolean
  category: "core" | "networking" | "content" | "communication"
}

export default async function FeatureFlagsPage() {
  // Check if user has admin access
  const isAdmin = await adminFeatureFlag()
  
  if (!isAdmin) {
    redirect("/alumni")
  }
  
  // Fetch feature flags from the server
  let flags: FeatureFlag[] = []
  
  try {
    const fetchedFlags = await getFeatureFlags()
    
    // If no flags found, use default structure
    if (!fetchedFlags || fetchedFlags.length === 0) {
      flags = getDefaultFlags()
    } else {
      // Convert to FeatureFlag type
      flags = fetchedFlags.map(flag => ({
        $id: flag.$id,
        key: flag.key as string,
        title: flag.title as string,
        description: flag.description as string,
        enabled: flag.enabled as boolean,
        // Ensure category is never undefined by providing a default
        category: (flag.category as "core" | "networking" | "content" | "communication") || "core"
      }))
    }
  } catch (error) {
    console.error("Error fetching feature flags:", error)
    // Use default flags as fallback
    flags = getDefaultFlags()
  }
  
  // Group flags by category
  const groupedFlags = flags.reduce((groups, flag) => {
    // Provide a default category if none exists
    const category = flag.category || "core"
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(flag)
    return groups
  }, {} as Record<string, FeatureFlag[]>)
  
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-purple-500" />
        <h1 className="text-2xl font-bold text-white">Feature Flags</h1>
      </div>
      
      <p className="text-gray-300">
        Enable or disable features in the alumni portal.
        Changes will take effect immediately for all users.
      </p>
      
      <Separator className="bg-secondary-100/10" />
      
      <div className="space-y-6">
        {Object.entries(groupedFlags).map(([category, categoryFlags]) => (
          <Card key={category} variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-secondary-100/5 opacity-20" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white capitalize">{category === "core" ? "Core" : category} Features</CardTitle>
              <CardDescription className="text-gray-300">
                Configure {category === "core" ? "core" : category} related features for the alumni portal
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {categoryFlags.map(flag => (
                  <div key={flag.$id} className="flex items-start justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{flag.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={flag.enabled 
                            ? "bg-green-500/10 text-green-500 border-green-500/20" 
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }
                        >
                          {flag.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mt-1 mb-1">{flag.description}</p>
                      <p className="text-xs text-gray-500">Flag key: <code className="bg-primary-70/40 px-1 py-0.5 rounded">{flag.key}</code></p>
                    </div>
                    <div className="pt-1">
                      <FeatureFlagToggle flag={flag} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Default flags structure if none exist in the database
function getDefaultFlags(): FeatureFlag[] {
  return [
    {
      $id: "1",
      key: "alumni-network",
      title: "Alumni Network",
      description: "Enable the networking features for alumni to connect with each other",
      enabled: true,
      category: "networking"
    },
    {
      $id: "2",
      key: "alumni-events",
      title: "Events",
      description: "Enable events calendar and registrations",
      enabled: true,
      category: "content"
    },
    {
      $id: "3",
      key: "alumni-mentoring",
      title: "Mentoring",
      description: "Enable mentoring programs and mentor matching",
      enabled: true,
      category: "networking"
    },
    {
      $id: "4",
      key: "alumni-jobs",
      title: "Job Board",
      description: "Enable job postings and career opportunities",
      enabled: true,
      category: "content"
    },
    {
      $id: "5",
      key: "alumni-resources",
      title: "Resources",
      description: "Enable resource library and document sharing",
      enabled: true,
      category: "content"
    },
    {
      $id: "6",
      key: "alumni-messages",
      title: "Messages",
      description: "Enable direct messaging between alumni",
      enabled: true,
      category: "communication"
    }
  ]
} 