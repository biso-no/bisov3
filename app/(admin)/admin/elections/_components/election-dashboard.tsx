'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BarChart, Calendar, Clock, Users, FileText, Check, X, Play, LoaderIcon } from 'lucide-react'
import {
  Election,
  ElectionSession,
  VotingItem,
  VotingOption,
  addElection,
  addElectionSession,
  addVotingItem,
  addVotingOption,
  updateElection,
  updateElectionSession,
  updateVotingItem,
  updateVotingOption,
  removeVotingItem,
  removeVotingOption,
  addOrRemoveAbstain,
  fetchDetailedResults,
  fetchVoterParticipation,
  DetailedVoteResult,
  VoterParticipation,
  startSession,
  stopSession,
  getVoters
} from '../actions'
import { useVotesSubscription } from '@/lib/admin/use-subscription'
import VoterTable from './voter-table'
import { PDFDownloadLink } from '@react-pdf/renderer';
import ElectionResultsPDF from './pdf-results';
import { campusMap } from '@/lib/utils'
import PDFDownloadButton from './pdf-download'

export default function ElectionDashboard({ initialElection }: { initialElection: Election }) {
  const [election, setElection] = useState(initialElection)
  const [activeTab, setActiveTab] = useState("overview")
  const [detailedResults, setDetailedResults] = useState<DetailedVoteResult[]>([])
  const [voterParticipation, setVoterParticipation] = useState<VoterParticipation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const newVoteData = useVotesSubscription(election.$id)

  const updateResultsWithNewVote = useCallback((newVote: any) => {
    setDetailedResults(prevResults => {
      const updatedResults = [...prevResults]
      const existingResultIndex = updatedResults.findIndex(
        result => result.votingItemId === newVote.votingItemId && result.optionId === newVote.optionId
      )

      if (existingResultIndex !== -1) {
        updatedResults[existingResultIndex] = {
          ...updatedResults[existingResultIndex],
          voteCount: updatedResults[existingResultIndex].voteCount + 1
        }
      } else {
        updatedResults.push({
          votingItemId: newVote.votingItemId,
          optionId: newVote.optionId,
          voteCount: 1
        })
      }

      return updatedResults
    })

    setVoterParticipation(prevParticipation => {
      if (!prevParticipation) return null
      return {
        ...prevParticipation,
        participatedVoters: prevParticipation.participatedVoters + 1
      }
    })
  }, [])

  useEffect(() => {
    console.log("New vote data:", newVoteData)
    if (newVoteData) {
      router.refresh()
    }
  }, [newVoteData, router])

  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true)
      try {
        const [fetchedResults, fetchedParticipation] = await Promise.all([
          fetchDetailedResults(election.$id),
          fetchVoterParticipation(election.$id)
        ])
        setDetailedResults(fetchedResults)
        setVoterParticipation(fetchedParticipation)
      } catch (error) {
        console.error("Failed to fetch results:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadResults()
  }, [election.$id])

  const handleAddSession = async (newSession: Omit<ElectionSession, '$id' | 'electionId'>) => {
    const session = await addElectionSession({ ...newSession, electionId: election.$id, election: election.$id, startTime: null, endTime: null })
    setElection(prev => ({
      ...prev,
      sessions: [...prev.sessions, session]
    }))
    router.refresh()
  }

  const handleAddVotingItem = async (sessionId: string, newItem: Omit<VotingItem, '$id' | 'sessionId'>) => {
    const item = await addVotingItem({ ...newItem, votingSessionId: sessionId, session: sessionId })
    setElection(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.$id === sessionId
          ? { ...session, votingItems: [...session.votingItems, item] }
          : session
      )
    }))
    router.refresh()
  }

  const handleAddVotingOption = async (itemId: string, newOption: Omit<VotingOption, '$id' | 'votingItemId'>) => {
    const option = await addVotingOption({ ...newOption, votingItemId: itemId, votingItem: itemId })
    setElection(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => ({
        ...session,
        votingItems: session.votingItems.map(item =>
          item.$id === itemId
            ? { ...item, options: [...(item.options || []), option] }
            : item
        )
      }))
    }))
    router.refresh()
  }

  
  const handleRemoveVotingOption = async (optionId: string) => {
    await removeVotingOption(optionId)
    setElection(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => ({
        ...session,
        votingItems: session.votingItems.map(item => ({
          ...item,
          options: item.options.filter(option => option.$id !== optionId)
        }))
      }))
    }))
    router.refresh()
  }

  const handleAddOrRemoveAbstain = async (itemId: string, allowAbstain: boolean) => {
    await addOrRemoveAbstain(itemId, allowAbstain)
    setElection(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => ({
        ...session,
        votingItems: session.votingItems.map(item =>
          item.$id === itemId
            ? { ...item, allowAbstain }
            : item
        )
      }))
    }))
    router.refresh()
  }

  const getTotalVotes = (itemId: string) => {
    return detailedResults
      .filter(result => result.votingItemId === itemId)
      .reduce((sum, result) => sum + result.voteCount, 0)
  }

  const getOptionVotes = (itemId: string, optionId: string) => {
    const result = detailedResults.find(r => r.votingItemId === itemId && r.optionId === optionId)
    return result ? result.voteCount : 0
  }

  const handleSessionStatusChange = useCallback((sessionId: string, newStatus: 'upcoming' | 'ongoing' | 'past') => {
    setElection(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.$id === sessionId ? { ...session, status: newStatus } : session
      )
    }))
  }, [])

  const totalSessions = election.sessions.length
  const totalVotingItems = election.sessions.reduce((sum, session) => sum + session.votingItems.length, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{election.name}</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="voters">Voters</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalSessions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Voting Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalVotingItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Election Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{election.date.split('T')[0]}</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Election Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Description:</strong> {election.description}</p>
              <p><strong>Campus:</strong> {campusMap[election.campus]}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sessions">
          <div className="mb-4">
            <AddSessionDialog onAddSession={handleAddSession} />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {election.sessions.map((session) => (
              <AccordionItem key={session.$id} value={session.$id}>
                <AccordionTrigger>{session.name}</AccordionTrigger>
                <AccordionContent>
                  <Card className="mb-4">
                    <div className="flex items-center justify-between pr-4">
                    <div>
                    <CardHeader>
                      <CardTitle>{session.name}</CardTitle>
                      <CardDescription>{session.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {session.startTime && <p><Clock className="inline-block mr-2" /> Start: {session.startTime}</p>}
                      {session.endTime && <p><Clock className="inline-block mr-2" /> End: {session.endTime}</p>}
                    </CardContent>
                    </div>
                    <StartStopSessionButton 
                  session={session} 
                  onStatusChange={handleSessionStatusChange}
                />
                    </div>
                  </Card>
                  <div className="mb-4">
                    <AddVotingItemDialog onAddVotingItem={(item) => handleAddVotingItem(session.$id, item)} />
                  </div>
                  {session.votingItems.map((item) => (
                    <Card key={item.$id} className="mb-4">
                      <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.type === 'statute' ? 'Statute Change' : 'Position'}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <Label>
                            <Checkbox
                              checked={item.allowAbstain}
                              onCheckedChange={(checked) => handleAddOrRemoveAbstain(item.$id, checked as boolean)}
                            />
                            <span className="ml-2">Allow Abstain</span>
                          </Label>
                        </div>
                        <div className="mb-2">
                          <AddVotingOptionDialog onAddVotingOption={(option) => handleAddVotingOption(item.$id, option)} />
                        </div>
                        {item.options?.map((option) => (
                          <div key={option.$id} className="flex items-center justify-between mb-2">
                            <span>{option.value}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveVotingOption(option.$id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="results">
        <h2 className="text-2xl font-bold mb-4">Election Results</h2>
        <div className="mb-4">
          <PDFDownloadButton election={election} detailedResults={detailedResults} />
        </div>
          {isLoading ? (
            <div className="text-center">
              <p>Loading results...</p>
            </div>
          ) : (
            election.sessions.map((session) => (
              <Card key={session.$id} className="mb-6">
                <CardHeader>
                  <CardTitle>{session.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {session.votingItems.map((item) => (
                    <div key={item.$id} className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <div className="space-y-2">
                        {item.options?.map((option) => {
                          const totalVotes = getTotalVotes(item.$id)
                          const optionVotes = getOptionVotes(item.$id, option.$id)
                          const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0
                          return (
                            <div key={option.$id} className="flex items-center">
                              <div className="w-32">{option.value}</div>
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                  className="bg-blue-600 h-4 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="ml-2 w-20 text-right">
                                {optionVotes} ({percentage.toFixed(1)}%)
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Total votes: {getTotalVotes(item.$id)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="voters">
          <VoterTable electionId={election.$id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AddSessionDialog({ onAddSession }: { onAddSession: (session: Omit<ElectionSession, '$id' | 'electionId'>) => void }) {
  const [open, setOpen] = useState(false)
  const [newSession, setNewSession] = useState<Omit<ElectionSession, '$id' | 'electionId'>>({
    name: '',
    description: '',
    startTime: '',
    endTime: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddSession(newSession)
    setOpen(false)
    setNewSession({ name: '', description: '', startTime: '', endTime: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
          <DialogDescription>Create a new session for the election.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newSession.name}
                onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newSession.description}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={newSession.startTime}
                onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={newSession.endTime}
                onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Add Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddVotingItemDialog({ onAddVotingItem }: { onAddVotingItem: (item: Omit<VotingItem, '$id' | 'sessionId'>) => void }) {
  const [open, setOpen] = useState(false)
  const [newItem, setNewItem] = useState<Omit<VotingItem, '$id' | 'sessionId'>>({
    title: '',
    type: 'position',
    allowAbstain: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddVotingItem(newItem)
    setOpen(false)
    setNewItem({ title: '', type: 'position', allowAbstain: true })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Voting Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Voting Item</DialogTitle>
          <DialogDescription>Create a new voting item for the session.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'statute' | 'position' })}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="position">Position</option>
                <option value="statute">Statute Change</option>
              </select>
            </div>
            <div>
              <Label>
                <Checkbox
                  checked={newItem.allowAbstain}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, allowAbstain: checked as boolean })}
                />
                <span className="ml-2">Allow Abstain</span>
              </Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Add Voting Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddVotingOptionDialog({ onAddVotingOption }: { onAddVotingOption: (option: Omit<VotingOption, '$id' | 'votingItemId'>) => void }) {
  const [open, setOpen] = useState(false)
  const [newOption, setNewOption] = useState<Omit<VotingOption, '$id' | 'votingItemId'>>({
    value: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddVotingOption(newOption)
    setOpen(false)
    setNewOption({ value: '', description: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Option</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Voting Option</DialogTitle>
          <DialogDescription>Create a new voting option for the item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={newOption.value}
                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newOption.description}
                onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Add Option</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function StartStopSessionButton({ 
  session, 
  onStatusChange 
}: { 
  session: ElectionSession, 
  onStatusChange: (sessionId: string, newStatus: 'upcoming' | 'ongoing' | 'past') => void 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(session.status)

  const handleStartSession = async () => {
    setIsLoading(true)
    try {
      await startSession(session.$id)
      setStatus('ongoing')
      onStatusChange(session.$id, 'ongoing')
    } catch (error) {
      console.error("Failed to start session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopSession = async () => {
    setIsLoading(true)
    try {
      await stopSession(session.$id)
      setStatus('past')
      onStatusChange(session.$id, 'past')
    } catch (error) {
      console.error("Failed to stop session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {status === 'ongoing' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleStopSession}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderIcon className="animate-spin h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <span className="sr-only">Stop Session</span>
        </Button>
      )}
      {(status === 'upcoming' || status === 'past') && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartSession}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderIcon className="animate-spin h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="sr-only">Start Session</span>
        </Button>
      )}
    </div>
  )
}