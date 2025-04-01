"use client"

import { useState, useEffect } from "react"
import { LinkedinIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { connectLinkedIn, syncLinkedInProfile } from "./actions"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"

interface LinkedInConnectProps {
  userId: string
}

export default function LinkedInConnect({ userId }: LinkedInConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showSyncPrompt, setShowSyncPrompt] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  
  // Check if redirected from LinkedIn OAuth
  useEffect(() => {
    const linkedInParam = searchParams.get('linkedin')
    if (linkedInParam === 'true') {
      setIsConnected(true)
      setShowSyncPrompt(true)
      toast({
        title: "LinkedIn Connected",
        description: "Your LinkedIn account has been connected successfully.",
      })
    } else if (linkedInParam === 'false') {
      toast({
        title: "Connection Failed",
        description: "There was a problem connecting your LinkedIn account.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleConnectLinkedIn = async () => {
    try {
      setIsConnecting(true)
      // Get the redirect URL from the server action
      const result = await connectLinkedIn(userId)
      
      if (result.success && result.redirectUrl) {
        // Redirect to LinkedIn OAuth
        window.location.href = result.redirectUrl
      } else {
        throw new Error("Failed to get LinkedIn authentication URL")
      }
    } catch (error) {
      console.error("Error connecting LinkedIn:", error)
      toast({
        title: "Connection Failed",
        description: "There was a problem connecting your LinkedIn account.",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const handleSyncProfile = async () => {
    try {
      const result = await syncLinkedInProfile(userId)
      
      if (result.success) {
        toast({
          title: "Profile Synced",
          description: "Your profile has been updated with LinkedIn data.",
        })
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        toast({
          title: "Sync Failed",
          description: result.message || "There was a problem syncing your profile.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error syncing profile:", error)
      toast({
        title: "Sync Failed",
        description: "There was a problem syncing your profile.",
        variant: "destructive",
      })
    } finally {
      setShowSyncPrompt(false)
    }
  }

  if (showSyncPrompt) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-linkedin text-linkedin hover:bg-linkedin hover:text-white"
          onClick={handleSyncProfile}
        >
          <LinkedinIcon className="h-4 w-4 mr-1" />
          Sync Profile
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="border-linkedin text-linkedin hover:bg-linkedin hover:text-white"
      onClick={handleConnectLinkedIn}
      disabled={isConnecting || isConnected}
    >
      <LinkedinIcon className="h-4 w-4 mr-1" />
      {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Connect LinkedIn"}
    </Button>
  )
} 