'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Models } from 'node-appwrite'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { VotingItem, VotingOption } from '../actions'
export function CandidatesTab({
    candidates,
    positions,
    newCandidate,
    setNewCandidate,
    handleCreateCandidate,
    handleDeleteCandidate
  }: {
    candidates: VotingOption[]
    positions: VotingItem[]
    newCandidate: Partial<VotingItem>
    setNewCandidate: (candidate: Partial<VotingItem>) => void
    handleCreateCandidate: () => Promise<void>
    handleDeleteCandidate: (id: string) => Promise<void>
  }) {


    

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Candidates</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Candidate</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="candidateName" className="text-right">Name</Label>
                  <Input
                    id="candidateName"
                    value={newCandidate.name || ''}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="candidatePosition" className="text-right">Position</Label>
                  <Select
                    value={newCandidate.positionId || ''}
                    onValueChange={(value) => setNewCandidate({ ...newCandidate, positionId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions?.map((position) => (
                        <SelectItem key={position?.$id} value={position?.$id}>{position?.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateCandidate}>Create Candidate</Button>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates?.map((candidate) => (
              <TableRow key={candidate?.$id}>
                <TableCell>{candidate?.value}</TableCell>
                <TableCell>{positions?.find(p => p.$id === candidate?.positionId)?.title}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCandidate(candidate.$id)}>
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