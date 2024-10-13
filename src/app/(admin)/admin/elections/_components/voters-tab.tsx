'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Models } from 'node-appwrite'


export function VotersTab({
    voters,
    newVoter,
    setNewVoter,
    handleCreateVoter,
    handleDeleteVoter
  }: {
    voters: Models.Document[]
    newVoter: Partial<Models.Document>
    setNewVoter: (voter: Partial<Models.Document>) => void
    handleCreateVoter: () => Promise<void>
    handleDeleteVoter: (id: string) => Promise<void>
  }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Voters</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Voter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Voter</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="voterName" className="text-right">Name</Label>
                  <Input
                    id="voterName"
                    value={newVoter.name || ''}
                    onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleCreateVoter}>Create Voter</Button>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Has Voted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voters?.map((voter) => (
              <TableRow key={voter.$id}>
                <TableCell>{voter.name}</TableCell>
                <TableCell>{voter.hasVoted ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteVoter(voter.$id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }