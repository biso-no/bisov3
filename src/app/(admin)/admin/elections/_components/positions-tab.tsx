'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, Pencil, Trash2  } from 'lucide-react'
import { Models } from 'node-appwrite'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditPositionsDialog } from './dialogs'


export function PositionsTab({
    positions,
    sessions,
    newPosition,
    setNewPosition,
    handleCreatePosition,
    handleDeletePosition
  }: {
    positions: Models.Document[]
    sessions: Models.Document[]
    newPosition: Partial<Models.Document>
    setNewPosition: (position: Partial<Models.Document>) => void
    handleCreatePosition: () => Promise<void>
    handleDeletePosition: (id: string) => Promise<void>
  }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Positions</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Position
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Position</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="positionName" className="text-right">Name</Label>
                  <Input
                    id="positionName"
                    value={newPosition.name || ''}
                    onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="positionSession" className="text-right">Session</Label>
                  <Select
                    value={newPosition.sessionId || ''}
                    onValueChange={(value) => setNewPosition({ ...newPosition, sessionId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions?.map((session) => (
                        <SelectItem key={session.$id} value={session.$id}>{session.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreatePosition}>Create Position</Button>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions?.map((position) => (
              <TableRow key={position.$id}>
                <TableCell>{position.title}</TableCell>
                <TableCell>test</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditPositionsDialog initialPosition={position} />
                    <Button variant="outline" size="sm" onClick={() => handleDeletePosition(position.$id)}>
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