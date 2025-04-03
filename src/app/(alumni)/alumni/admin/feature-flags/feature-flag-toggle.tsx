"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { updateFeatureFlag } from "../actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface FeatureFlag {
  $id: string
  key: string
  title: string
  description: string
  enabled: boolean
  category: "core" | "networking" | "content" | "communication"
}

export function FeatureFlagToggle({ flag }: { flag: FeatureFlag }) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(flag.enabled)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const handleToggle = async () => {
    try {
      setIsUpdating(true)
      // Toggle the local state first for immediate feedback
      const newEnabledState = !enabled
      setEnabled(newEnabledState)
      
      // Update in the database
      await updateFeatureFlag(flag.$id, newEnabledState)
      
      // Show success toast
      toast({
        title: `${flag.title} ${newEnabledState ? 'enabled' : 'disabled'}`,
        description: `The feature has been successfully ${newEnabledState ? 'enabled' : 'disabled'}.`,
        duration: 3000
      })
      
      // Force a hard refresh of all routes
      router.refresh()
      
      // For a more aggressive refresh, we can use a small timeout and then redirect
      // This ensures the server re-fetches data when rendering the page
      setTimeout(() => {
        // Use router.push to the current URL to force a full re-render
        window.location.reload()
      }, 300)
    } catch (error) {
      console.error(`Error updating feature flag ${flag.$id}:`, error)
      
      // Revert the local state
      setEnabled(flag.enabled)
      
      // Show error toast
      toast({
        title: "Error updating feature flag",
        description: "There was a problem updating the feature flag. Please try again.",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsUpdating(false)
    }
  }
  
  return (
    <Switch
      checked={enabled}
      onCheckedChange={handleToggle}
      disabled={isUpdating}
      className={isUpdating ? "opacity-50" : ""}
    />
  )
} 