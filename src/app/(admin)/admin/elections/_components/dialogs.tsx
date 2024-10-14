"use client"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusIcon, Table, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react"
import { Models } from "node-appwrite"
import React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateActiveSession, updateVotingItem, updateVotingOption } from "@/app/actions/elections"
import { ElectionSession } from "../actions"

export function EditSessionDialog({
    initialSession
}: {
    initialSession: ElectionSession
}) {
    const [session, setSession] = React.useState<Models.Document>(initialSession)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updateActiveSession({
            sessionId: session.$id,
            title: session.name,
            startTime: session.startTime,
            endTime: session.endTime,
            status: session.status,
        })
    
    }


    
    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Session</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={session.name || ''}
                                onChange={(e) => setSession({ ...session, name: e.target.value })}
                                className="col-span-3"
                            />
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <Select
                                value={session.status || ''}
                                onValueChange={(value) => setSession({ ...session, status: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <DialogFooter className="justify-center border-t p-4">
                            <Button variant="primary" size="sm" type="submit">
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function EditPositionsDialog({
    initialPosition
}: {
    initialPosition: Models.Document
}) {
    const [position, setPosition] = React.useState<Models.Document>(initialPosition)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const response = await updateVotingItem(position.$id, formData)
    
    }


    
    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Positions</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={position.title || ''}
                                onChange={(e) => setPosition({ ...position, name: e.target.value })}
                                className="col-span-3"
                            />
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <Select
                                value={position.type || ''}
                                onValueChange={(value) => setPosition({ ...position, type: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="statute">Statute Change/Local law</SelectItem>
                                    <SelectItem value="position">Position</SelectItem>
                                </SelectContent>
                            </Select>
                            <DialogFooter className="justify-center border-t p-4">
                            <Button variant="primary" size="sm" type="submit">
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function EditCandidateDialog({
    initialCandidate,
    isPosition
}: {
    initialCandidate: Models.Document,
    isPosition: boolean
}) {

    const [candidate, setCandidate] = React.useState<Models.Document>(initialCandidate)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updateVotingOption(candidate.$id, new FormData(e.target))
    
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Candidate</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={candidate.value || ''}
                                onChange={(e) => setCandidate({ ...candidate, value: e.target.value })}
                                className="col-span-3"
                            />
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input
                                id="description"
                                value={candidate.description || ''}
                                onChange={(e) => setCandidate({ ...candidate, description: e.target.value })}
                                className="col-span-3"
                            />
                            <DialogFooter className="justify-center border-t p-4">
                            <Button variant="primary" size="sm" type="submit">
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}