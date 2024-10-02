"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Clock, Vote } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/lib/hooks/use-toast"

// Interfaces (unchanged)
interface Election {
  id: string
  description: string
  date: string
  campus: string
  name: string
  status: 'upcoming' | 'ongoing' | 'past'
  sessions: ElectionSession[]
  electionUsers: Voter[]
}

interface ElectionSession {
  id: string
  electionId: string
  name: string
  description: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'ongoing' | 'past'
  votingItems: VotingItem[]
  election: Election
}

interface VotingItem {
  id: string
  votingSessionId: string
  title: string
  type: 'single' | 'multiple'
  allowAbstain: boolean
  maxSelections: number
  votingOptions: VotingOption[]
  session: ElectionSession
}

interface VotingOption {
  id: string
  votingItemId: string
  value: string
  description: string
  votingItem: VotingItem
}

interface Voter {
  id: string
  electionId: string
  name: string
  email: string
  studentId: string
}

interface Vote {
  id: string
  optionId: string
  voterId: string
  electionId: string
  votingSessionId: string
  votingItemId: string
}

// Mock data (unchanged)
const mockElection: Election = {
  id: "election-2023",
  description: "Annual Board Election for 2023",
  date: "2023-06-15",
  campus: "Main Campus",
  name: "Annual Board Election 2023",
  status: "ongoing",
  sessions: [
    {
      id: "session-1",
      electionId: "election-2023",
      name: "Board Members Selection",
      description: "Vote for new board members",
      startTime: "2023-06-15T09:00:00Z",
      endTime: "2023-06-15T17:00:00Z",
      status: "ongoing",
      votingItems: [
        {
          id: "item-1",
          votingSessionId: "session-1",
          title: "Select Board President",
          type: "single",
          allowAbstain: true,
          maxSelections: 1,
          votingOptions: [
            { id: "option-1", votingItemId: "item-1", value: "John Doe", description: "Current Vice President", votingItem: {} as VotingItem },
            { id: "option-2", votingItemId: "item-1", value: "Jane Smith", description: "Head of Finance", votingItem: {} as VotingItem },
          ],
          session: {} as ElectionSession,
        },
        {
          id: "item-2",
          votingSessionId: "session-1",
          title: "Select Board Members (Choose up to 5)",
          type: "multiple",
          allowAbstain: true,
          maxSelections: 5,
          votingOptions: [
            { id: "option-3", votingItemId: "item-2", value: "Alice Johnson", description: "HR Specialist", votingItem: {} as VotingItem },
            { id: "option-4", votingItemId: "item-2", value: "Bob Williams", description: "IT Director", votingItem: {} as VotingItem },
            { id: "option-5", votingItemId: "item-2", value: "Carol Brown", description: "Marketing Manager", votingItem: {} as VotingItem },
            { id: "option-6", votingItemId: "item-2", value: "David Lee", description: "Operations Supervisor", votingItem: {} as VotingItem },
            { id: "option-7", votingItemId: "item-2", value: "Eva Chen", description: "Financial Analyst", votingItem: {} as VotingItem },
            { id: "option-8", votingItemId: "item-2", value: "Frank Miller", description: "Legal Counsel", votingItem: {} as VotingItem },
          ],
          session: {} as ElectionSession,
        },
      ],
      election: {} as Election,
    },
  ],
  electionUsers: [],
}

export default function VoterPage() {
  const [activeSession, setActiveSession] = useState<ElectionSession | null>(null)
  const [votes, setVotes] = useState<{ [key: string]: string[] }>({})
  const [hasVoted, setHasVoted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Find the active session
    const active = mockElection.sessions.find(session => session.status === "ongoing")
    setActiveSession(active || null)

    // Simulate progress for demonstration purposes
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 10))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVote = (itemId: string, optionId: string) => {
    setVotes(prevVotes => ({
      ...prevVotes,
      [itemId]: [optionId]
    }))
  }

  const handleMultiVote = (item: VotingItem, optionId: string) => {
    setVotes(prevVotes => {
      const currentVotes = prevVotes[item.id] || []
      let updatedVotes: string[]

      if (optionId === 'abstain') {
        // If abstain is selected, toggle it
        updatedVotes = currentVotes.includes('abstain') 
          ? currentVotes.filter(id => id !== 'abstain')
          : [...currentVotes, 'abstain']
      } else {
        // Toggle the selected option
        updatedVotes = currentVotes.includes(optionId)
          ? currentVotes.filter(id => id !== optionId)
          : [...currentVotes, optionId]

        // Remove abstain if a regular option is selected
        updatedVotes = updatedVotes.filter(id => id !== 'abstain')

        // Check if the number of selections exceeds maxSelections
        if (updatedVotes.length > item.maxSelections) {
          toast({
            title: "Maximum selections reached",
            description: `You can only select up to ${item.maxSelections} options for this item.`,
            variant: "destructive",
          })
          return prevVotes // Return previous state without changes
        }
      }

      return {
        ...prevVotes,
        [item.id]: updatedVotes
      }
    })
  }

  const getStatusIcon = (status: 'upcoming' | 'ongoing' | 'past') => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "ongoing":
        return <AlertCircle className="h-4 w-4 text-green-500" />
      case "past":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
    }
  }

  const isVoteComplete = (item: VotingItem) => {
    const itemVotes = votes[item.id] || []
    return itemVotes.includes('abstain') || itemVotes.length === item.maxSelections
  }

  const submitVotes = () => {
    if (activeSession) {
      const incompleteItems = activeSession.votingItems.filter(item => !isVoteComplete(item))
      if (incompleteItems.length > 0) {
        toast({
          title: "Incomplete votes",
          description: "Please complete all voting items before submitting.",
          variant: "destructive",
        })
      } else {
        console.log("Votes submitted:", votes)
        toast({
          title: "Votes submitted successfully",
          description: "Thank you for participating in this election.",
          variant: "default",
        })
        setHasVoted(true)
        // Here you would typically send the votes to your backend
      }
    }
  }

  const VotingInterface = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{activeSession!.name}</CardTitle>
          <Badge variant="outline" className="text-sm">
            {getStatusIcon(activeSession!.status)}
            <span className="ml-2 capitalize">{activeSession!.status}</span>
          </Badge>
        </div>
        <CardDescription>{activeSession!.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {activeSession!.votingItems.map((item) => (
            <div key={item.id} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              {item.type === "single" ? (
                <RadioGroup onValueChange={(value) => handleVote(item.id, value)}>
                  {item.votingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.value} - {option.description}</Label>
                    </div>
                  ))}
                  {item.allowAbstain && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="abstain" id={`${item.id}-abstain`} />
                      <Label htmlFor={`${item.id}-abstain`}>Abstain</Label>
                    </div>
                  )}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {item.votingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={(votes[item.id] || []).includes(option.id)}
                        onCheckedChange={() => handleMultiVote(item, option.id)}
                      />
                      <Label htmlFor={option.id}>{option.value} - {option.description}</Label>
                    </div>
                  ))}
                  {item.allowAbstain && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${item.id}-abstain`}
                        checked={(votes[item.id] || []).includes('abstain')}
                        onCheckedChange={() => handleMultiVote(item, 'abstain')}
                      />
                      <Label htmlFor={`${item.id}-abstain`}>Abstain</Label>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {isVoteComplete(item) 
                  ? "✅ Vote complete" 
                  : `Select ${(votes[item.id] || []).includes('abstain') ? 'at least 1' : item.maxSelections} option${item.maxSelections > 1 ? 's' : ''} or abstain`}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={submitVotes}>Submit Votes</Button>
      </CardFooter>
    </Card>
  )

  const WaitingScreen = () => (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Waiting for Next Session</CardTitle>
        <CardDescription>Stay tuned for the upcoming voting session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Vote className="h-24 w-24 text-primary animate-pulse" />
          <Progress value={progress} className="w-[60%]" />
          <p className="text-muted-foreground">
            {hasVoted 
              ? "Thank you for voting. The control committee is preparing the next session."
              : "The control committee is preparing the next session. This is a great time to review any relevant materials or discussions."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline">View Election Information</Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{mockElection.name}</CardTitle>
            <Badge variant="outline" className="text-sm">
              {getStatusIcon(mockElection.status)}
              <span className="ml-2 capitalize">{mockElection.status}</span>
            </Badge>
          </div>
          <CardDescription>{mockElection.description}</CardDescription>
        </CardHeader>
      </Card>

      {activeSession && !hasVoted ? <VotingInterface /> : <WaitingScreen />}
    </div>
  )
}