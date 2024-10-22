"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Vote as VoteIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/lib/hooks/use-toast"
import type { Election, ElectionSession, VotingItem, VotingOption, Voter, Vote } from "@/lib/types/election"
import { castVote, getVotes } from "../elections/actions"
import { Models } from "node-appwrite"


export default function VoterComponent({ initialElection, initialHasVoted, initialSession, getActiveSession }: { initialElection: Election, initialHasVoted: boolean, initialSession: ElectionSession, getActiveSession: (electionId: string) => Promise<Models.Document> }) {
  const [activeSession, setActiveSession] = useState<Models.Document | null>(initialSession)
  const [votes, setVotes] = useState<{ [itemId: string]: string[] }>({})
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [progress, setProgress] = useState(0)
  const [election, setElection] = useState(initialElection)
  const [isRefreshing, setIsRefreshing] = useState(false)



  const handleVote = (itemId: string, optionId: string) => {
    setVotes(prevVotes => ({
      ...prevVotes,
      [itemId]: [optionId]
    }))
  }

  const refreshSession = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const latestSession = await getActiveSession(election.$id)
      console.log("Latest session:", latestSession)
      if (latestSession && latestSession.$id !== activeSession?.$id) {
        setActiveSession(latestSession)
        setHasVoted(false)
        setVotes({})
        toast({
          title: "New session available",
          description: "A new voting session has started.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
      toast({
        title: "Error refreshing session",
        description: "There was a problem checking for new sessions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [getActiveSession, election.$id, activeSession?.$id])

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshSession()
    }, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
  }, [refreshSession])
  
  const handleMultiVote = (item: VotingItem, optionId: string) => {
    setVotes(prevVotes => {
      const currentVotes = prevVotes[item.$id] || []
      let updatedVotes: string[]
  
      if (optionId === 'abstain') {
        updatedVotes = currentVotes.includes('abstain') 
          ? currentVotes.filter(id => id !== 'abstain')
          : ['abstain']
      } else {
        updatedVotes = currentVotes.includes(optionId)
          ? currentVotes.filter(id => id !== optionId)
          : [...currentVotes.filter(id => id !== 'abstain'), optionId]
  
        if (updatedVotes.length > item.maxSelections) {
          toast({
            title: "Maximum selections reached",
            description: `You can only select up to ${item.maxSelections} options for this item.`,
            variant: "destructive",
          })
          return prevVotes
        }
      }
  
      return {
        ...prevVotes,
        [item.$id]: updatedVotes
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
    const itemVotes = votes[item.$id] || []
    return itemVotes.includes('abstain') || itemVotes.length === item.maxSelections
  }

  const submitVotes = async () => {
    if (activeSession) {
      const incompleteItems = activeSession.votingItems.filter(item => !isVoteComplete(item))
      if (incompleteItems.length > 0) {
        toast({
          title: "Incomplete votes",
          description: "Please complete all voting items before submitting.",
          variant: "destructive",
        })
      } else {
        try {
          for (const item of activeSession.votingItems) {
            const itemVotes = votes[item.$id] || []
            for (const optionId of itemVotes) {
              await castVote(
                election.$id,
                optionId,
                activeSession.$id,
                item.$id
              )
            }
          }
          toast({
            title: "Votes submitted successfully",
            description: "Thank you for participating in this election.",
            variant: "default",
          })
          setHasVoted(true)
        } catch (error) {
          console.error("Error submitting vote:", error)
          toast({
            title: "Error submitting vote",
            description: "There was a problem submitting your vote. Please try again.",
            variant: "destructive",
          })
        }
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
            <div key={item.$id} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              {item.type === "position" ? (
               <RadioGroup 
               onValueChange={(value) => handleVote(item.$id, value)}
               value={votes[item.$id]?.[0] || ''}
             >
                  {item.votingOptions?.map((option) => (
                    <div key={option.$id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option.$id} id={option.$id} />
                      <Label htmlFor={option.$id}>{option.value} - {option.description}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {item.votingOptions?.map((option) => (
                    <div key={option.$id} className="flex items-center space-x-2">
                        <Checkbox
                        id={option.$id}
                        checked={(votes[item.$id] || []).includes(option.$id)}
                        onCheckedChange={() => handleMultiVote(item, option.$id)}
                        />
                      <Label htmlFor={option.$id}>{option.value} - {option.description}</Label>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {isVoteComplete(item) 
                  ? "✅ Vote complete" 
                  : `Select ${(votes[item.$id] || []).includes('abstain') ? 'at least 1' : item.maxSelections} option${item.maxSelections > 1 ? 's' : ''} or abstain`}
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
          <VoteIcon className="h-24 w-24 text-primary animate-pulse" />
          <Progress value={progress} className="w-[60%]" />
          <p className="text-muted-foreground">
            {hasVoted 
              ? "Thank you for voting. The control committee is preparing the next session."
              : "The control committee is preparing the next session. This is a great time to review any relevant materials or discussions."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={refreshSession} 
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check for New Session
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
  
  if (!election) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{election?.name}</CardTitle>
            <Badge variant="outline" className="text-sm">
              {getStatusIcon(election?.status)}
              <span className="ml-2 capitalize">{election?.status}</span>
            </Badge>
          </div>
          <CardDescription>{election?.description}</CardDescription>
        </CardHeader>
      </Card>

      {activeSession && !hasVoted ? <VotingInterface /> : <WaitingScreen />}
    </div>
  )
}