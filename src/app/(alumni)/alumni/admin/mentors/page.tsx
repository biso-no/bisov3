"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, BadgeInfo, User, Loader2, Settings } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  getPendingMentorApplications, 
  updateMentorStatus,
  isAutoAcceptMentorsEnabled,
  updateAutoAcceptMentorsFlag,
  getMentors
} from "@/app/(alumni)/alumni/actions"
import { Mentor } from "@/lib/types/alumni"
import { Query } from "node-appwrite"

export default function MentorApprovalPage() {
  const [pendingMentors, setPendingMentors] = useState<Mentor[]>([])
  const [approvedMentors, setApprovedMentors] = useState<Mentor[]>([])
  const [rejectedMentors, setRejectedMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(false)
  const [isAutoAcceptLoading, setIsAutoAcceptLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch mentor applications and auto-accept status when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch all types of mentors
        const [pending, isAutoAccept] = await Promise.all([
          getPendingMentorApplications(),
          isAutoAcceptMentorsEnabled()
        ])
        
        const approved = await getMentors([Query.equal("status", "approved")])
        const rejected = await getMentors([Query.equal("status", "rejected")])
        
        setPendingMentors(pending)
        setApprovedMentors(approved)
        setRejectedMentors(rejected)
        setAutoAcceptEnabled(isAutoAccept)
      } catch (error) {
        console.error("Error fetching mentor applications:", error)
        alert("Failed to load mentor applications")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Handle approval action
  const handleApprove = async (mentorId: string) => {
    try {
      setProcessingId(mentorId)
      await updateMentorStatus(mentorId, "approved")
      
      // Update local state
      const updatedMentor = pendingMentors.find(m => m.$id === mentorId)
      if (updatedMentor) {
        setPendingMentors(prev => prev.filter(m => m.$id !== mentorId))
        setApprovedMentors(prev => [...prev, {...updatedMentor, status: "approved"}])
      }
      
      alert("Mentor application approved successfully")
    } catch (error) {
      console.error("Error approving mentor:", error)
      alert("Failed to approve mentor application")
    } finally {
      setProcessingId(null)
    }
  }

  // Handle rejection action
  const handleReject = async (mentorId: string) => {
    try {
      setProcessingId(mentorId)
      await updateMentorStatus(mentorId, "rejected")
      
      // Update local state
      const updatedMentor = pendingMentors.find(m => m.$id === mentorId)
      if (updatedMentor) {
        setPendingMentors(prev => prev.filter(m => m.$id !== mentorId))
        setRejectedMentors(prev => [...prev, {...updatedMentor, status: "rejected"}])
      }
      
      alert("Mentor application rejected")
    } catch (error) {
      console.error("Error rejecting mentor:", error)
      alert("Failed to reject mentor application")
    } finally {
      setProcessingId(null)
    }
  }

  // Handle auto-accept toggle
  const handleAutoAcceptToggle = async () => {
    try {
      setIsAutoAcceptLoading(true)
      
      // Update the feature flag in the database
      const success = await updateAutoAcceptMentorsFlag(!autoAcceptEnabled)
      
      if (success) {
        setAutoAcceptEnabled(!autoAcceptEnabled)
      } else {
        throw new Error("Failed to update auto-accept setting")
      }
    } catch (error) {
      console.error("Error toggling auto-accept:", error)
    } finally {
      setIsAutoAcceptLoading(false)
    }
  }

  // Open mentor details dialog
  const openMentorDetails = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mentor Applications</h1>
          <p className="text-muted-foreground">Review and manage mentor applications</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Auto-approve applications</span>
          <Switch
            checked={autoAcceptEnabled}
            onCheckedChange={handleAutoAcceptToggle}
            disabled={isAutoAcceptLoading}
          />
          {isAutoAcceptLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending
            {pendingMentors.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingMentors.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedMentors.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedMentors.length})</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="pending" className="m-0">
              {pendingMentors.length === 0 ? (
                <div className="bg-muted p-8 rounded-lg text-center">
                  <BadgeInfo className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No pending applications</h3>
                  <p className="text-muted-foreground">All mentor applications have been processed.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.$id}
                      mentor={mentor}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onViewDetails={() => openMentorDetails(mentor)}
                      processing={processingId === mentor.$id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="m-0">
              {approvedMentors.length === 0 ? (
                <div className="bg-muted p-8 rounded-lg text-center">
                  <BadgeInfo className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No approved mentors</h3>
                  <p className="text-muted-foreground">No mentor applications have been approved yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.$id}
                      mentor={mentor}
                      status="approved"
                      onViewDetails={() => openMentorDetails(mentor)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected" className="m-0">
              {rejectedMentors.length === 0 ? (
                <div className="bg-muted p-8 rounded-lg text-center">
                  <BadgeInfo className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No rejected mentors</h3>
                  <p className="text-muted-foreground">No mentor applications have been rejected.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.$id}
                      mentor={mentor}
                      status="rejected"
                      onViewDetails={() => openMentorDetails(mentor)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {/* Mentor Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedMentor && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Mentor Application Details</DialogTitle>
              <DialogDescription>
                Submitted on {new Date(selectedMentor.applicationDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-24 w-24 mb-3">
                    {selectedMentor.avatarUrl ? (
                      <AvatarImage src={selectedMentor.avatarUrl} alt={selectedMentor.name} />
                    ) : (
                      <AvatarFallback className="text-lg bg-blue-600">
                        {selectedMentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="text-lg font-medium">{selectedMentor.name}</h3>
                  <p className="text-muted-foreground text-sm">{selectedMentor.title} at {selectedMentor.company}</p>
                  
                  <div className="mt-4 w-full space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Industry</p>
                      <p>{selectedMentor.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{selectedMentor.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p>{selectedMentor.experience} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Graduation Year</p>
                      <p>{selectedMentor.graduationYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Availability</p>
                      <p>{selectedMentor.availability}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
                    <p className="text-sm">{selectedMentor.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Education</h4>
                    <p className="text-sm">{selectedMentor.education}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.expertise.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedMentor.languages && selectedMentor.languages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentor.languages.map((language, i) => (
                          <Badge key={i} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMentor.meetingPreference && selectedMentor.meetingPreference.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Meeting Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentor.meetingPreference.map((pref, i) => (
                          <Badge key={i} variant="outline">{pref}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              {selectedMentor.status === "pending" && (
                <>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={() => {
                    handleReject(selectedMentor.$id);
                    setDialogOpen(false);
                  }}>
                    Reject
                  </Button>
                  <Button onClick={() => {
                    handleApprove(selectedMentor.$id);
                    setDialogOpen(false);
                  }}>
                    Approve
                  </Button>
                </>
              )}
              
              {selectedMentor.status !== "pending" && (
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

// Mentor card component for displaying mentor information
function MentorCard({ 
  mentor, 
  onApprove, 
  onReject, 
  onViewDetails,
  processing = false,
  status = "pending"
}: { 
  mentor: Mentor, 
  onApprove?: (id: string) => void, 
  onReject?: (id: string) => void,
  onViewDetails: () => void,
  processing?: boolean,
  status?: "pending" | "approved" | "rejected"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {mentor.avatarUrl ? (
                <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
              ) : (
                <AvatarFallback>
                  {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-base">{mentor.name}</CardTitle>
              <CardDescription>{mentor.title} at {mentor.company}</CardDescription>
            </div>
          </div>
          {status !== "pending" && (
            <Badge variant={status === "approved" ? "secondary" : "destructive"}>
              {status === "approved" ? "Approved" : "Rejected"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-muted-foreground">Location</p>
            <p>{mentor.location}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Experience</p>
            <p>{mentor.experience} years</p>
          </div>
          <div>
            <p className="text-muted-foreground">Industry</p>
            <p>{mentor.industry}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Grad Year</p>
            <p>{mentor.graduationYear}</p>
          </div>
        </div>
        
        <div className="line-clamp-2 text-sm mb-2">
          <span className="text-muted-foreground">Bio: </span>
          {mentor.bio}
        </div>
        
        <div className="mt-2">
          <span className="text-xs text-muted-foreground block mb-1">Expertise:</span>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      +{mentor.expertise.length - 3} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-1">
                      {mentor.expertise.slice(3).map((skill, i) => (
                        <span key={i}>{skill}</span>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
        
        {status === "pending" && onApprove && onReject && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onReject(mentor.$id)}
              disabled={processing}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
              Reject
            </Button>
            <Button 
              size="sm" 
              onClick={() => onApprove(mentor.$id)}
              disabled={processing}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
              Approve
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
} 