'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Models } from 'node-appwrite'
import React from 'react'
import { EditSessionDialog } from './dialogs'

export function SessionsTab({
    sessions,
    voters,
    newSession,
    setNewSession,
    handleCreateSession,
    handleDeleteSession,
    expandedSession,
    toggleSessionExpand
  }: {
    sessions: Models.Document[]
    voters: Models.Document[]
    newSession: Partial<Models.Document>
    setNewSession: (session: Partial<Models.Document>) => void
    handleCreateSession: () => Promise<void>
    handleDeleteSession: (id: string) => Promise<void>
    expandedSession: string | null
    toggleSessionExpand: (id: string) => void
  }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Voting Sessions</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Voting Session</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newSession.name || ''}
                    onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleCreateSession}>Create Session</Button>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions?.map((session) => (
              <React.Fragment key={session.$id}>
                <TableRow>
                  <TableCell>{session.name}</TableCell>
                  <TableCell>{session.startTime}</TableCell>
                  <TableCell>{session.endTime}</TableCell>
                  <TableCell>{session.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleSessionExpand(session.$id)}>
                        {expandedSession === session.$id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <EditSessionDialog initialSession={session} />
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSession(session.$id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedSession === session.$id && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-semibold mb-2">Voters Who Haven&apos;t Cast a Vote</h4>
                        <ul>
                          {voters?.filter(voter => !voter.hasVoted)?.map((voter) => (
                            <li key={voter.$id}>{voter.name}</li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }