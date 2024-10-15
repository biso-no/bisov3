"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Pencil, Trash, UserPlus, Upload, Plus, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { addVoter, getVoters, updateVoter, removeVoter, toggleVoterStatus, Voter } from "@/app/(admin)/admin/elections/actions"


export default function VoterTable({ electionId }: { electionId: string }) {
  const [voters, setVoters] = useState<Voter[]>()
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null)
  const [isMultiUserInput, setIsMultiUserInput] = useState(false)
  const [multiUserInputs, setMultiUserInputs] = useState<Omit<Voter, '$id' | 'canVote'>[]>([{ name: '', email: '', voterId: '', voteWeight: 1 }])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchVoters = async () => {
      const voters = await getVoters(electionId)
      setVoters(voters)
    }
    fetchVoters()
  }, [electionId])

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await toggleVoterStatus(id, newStatus)
      setVoters(voters.map(voter => 
        voter.$id === id ? { ...voter, canVote: newStatus } : voter
      ))
    } catch (error) {
      console.error("Error updating voter status:", error)
    }
  }

  const handleEdit = (voter: Voter) => {
    setEditingVoter(voter)
  }

  const handleDelete = async (id: string) => {
    try {
      await removeVoter(id)
      setVoters(voters.filter(voter => voter.$id !== id))
    } catch (error) {
      console.error("Error deleting voter:", error)
    }
  }

  const handleSaveEdit = async (updatedVoter: Voter) => {
    try {
      await updateVoter(updatedVoter.$id, {
        ...updatedVoter,
        canVote: updatedVoter.canVote,
        voteWeight: updatedVoter.voteWeight,
      });
      setVoters(voters.map(voter => 
        voter.$id === updatedVoter.$id ? updatedVoter : voter
      ))
      setEditingVoter(null)
    } catch (error) {
      console.error("Error updating voter:", error)
    }
  }

  const handleInvite = async (newVoters: Omit<Voter, 'id'>[]) => {
    try {
      const createdVoters = await Promise.all(newVoters.map(async (voter) => {
        const response = await addVoter(electionId, voter)
        return response as Voter
      }))
      setVoters([...voters, ...createdVoters])
      setMultiUserInputs([{ name: '', email: '', voterId: '', voteWeight: 1 }])
    } catch (error) {
      console.error("Error inviting voters:", error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split('\n')
        const newVoters = lines.slice(1).map(line => {
          const [name, email, voterId, voteWeight] = line.split(',')
          return {
            name: name.trim(),
            email: email.trim(),
            voterId: voterId.trim(),
            voteWeight: parseInt(voteWeight.trim()),
            canVote: true
          }
        })
        handleInvite(newVoters)
      }
      reader.readAsText(file)
    }
  }

  const addMultiUserInput = () => {
    setMultiUserInputs([...multiUserInputs, { name: '', email: '', voterId: '', voteWeight: 1 }])
  }

  const removeMultiUserInput = (index: number) => {
    setMultiUserInputs(multiUserInputs.filter((_, i) => i !== index))
  }

  const updateMultiUserInput = (index: number, field: keyof Omit<Voter, '$id' | 'canVote'>, value: string | number) => {
    const updatedInputs = multiUserInputs.map((input, i) => 
      i === index ? { ...input, [field]: value } : input
    )
    setMultiUserInputs(updatedInputs)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Voter Table</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Invite Voters</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Invite Voters</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="multi-user-mode"
                checked={isMultiUserInput}
                onCheckedChange={setIsMultiUserInput}
              />
              <Label htmlFor="multi-user-mode">Multi-user input mode</Label>
            </div>
            {isMultiUserInput ? (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleInvite(multiUserInputs.map(input => ({ ...input, canVote: true })))
              }}>
                {multiUserInputs.map((input, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 mb-4 items-center">
                    <Input
                      placeholder="Name"
                      value={input.name}
                      onChange={(e) => updateMultiUserInput(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={input.email}
                      onChange={(e) => updateMultiUserInput(index, 'email', e.target.value)}
                    />
                    <Input
                      placeholder="Voter ID"
                      value={input.voterId}
                      onChange={(e) => updateMultiUserInput(index, 'voterId', e.target.value)}
                    />
                    <Input
                      placeholder="Vote Weight"
                      type="number"
                      value={input.voteWeight}
                      onChange={(e) => updateMultiUserInput(index, 'voteWeight', parseInt(e.target.value))}
                    />
                    <Button type="button" variant="ghost" onClick={() => removeMultiUserInput(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addMultiUserInput} className="mb-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Another Voter
                </Button>
                <DialogFooter>
                  <Button type="submit">Invite Multiple Voters</Button>
                </DialogFooter>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleInvite([{
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  voterId: formData.get('voterId') as string,
                  voteWeight: parseInt(formData.get('voteWeight') as string),
                  canVote: true
                }])
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" name="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="voterId" className="text-right">Voter ID</Label>
                    <Input id="voterId" name="voterId" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="voteWeight" className="text-right">Vote Weight</Label>
                    <Input id="voteWeight" name="voteWeight" type="number" defaultValue="1" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Invite</Button>
                </DialogFooter>
              </form>
            )}
            <div className="mt-4">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span className="font-medium text-gray-600">
                      Drop Excel/CSV file or click to upload
                    </span>
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </div>
              </Label>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Voter ID</TableHead>
            <TableHead>Vote Weight</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voters?.map((voter) => (
            <TableRow key={voter.$id}>
              <TableCell>{voter.name}</TableCell>
              <TableCell>{voter.email}</TableCell>
              <TableCell>{voter.voter_id}</TableCell>
              <TableCell>{voter.voteWeight}</TableCell>
              <TableCell>
                <Switch
                  checked={voter.canVote}
                  onCheckedChange={(newStatus) => handleStatusChange(voter.$id, newStatus)}
                />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(voter)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(voter.$id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editingVoter} onOpenChange={() => setEditingVoter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Voter</DialogTitle>
          </DialogHeader>
          {editingVoter && (
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSaveEdit({
                ...editingVoter,
                name: formData.get('edit-name') as string || editingVoter.name,
                email: formData.get('edit-email') as string || editingVoter.email,
                voterId: formData.get('edit-voterId') as string || editingVoter.voterId,
                voteWeight: parseInt(formData.get('edit-voteWeight') as string) || editingVoter.voteWeight,
              })
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input id="edit-name" name="name" disabled defaultValue={editingVoter.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">Email</Label>
                  <Input id="edit-email" name="email" type="email" disabled defaultValue={editingVoter.email} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-voterId" className="text-right">Voter ID</Label>
                  <Input id="edit-voterId" name="voterId" defaultValue={editingVoter.voter_id} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-voteWeight" className="text-right">Vote Weight</Label>
                  <Input id="edit-voteWeight" name="voteWeight" type="number" defaultValue={editingVoter.voteWeight} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}