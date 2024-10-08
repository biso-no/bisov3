'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import type { Models } from 'node-appwrite'

import { ElectionSession, Election } from '@/app/(admin)/admin/elections/actions'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import Link from 'next/link'


export default function AdminDashboard({
    isAdmin,
    elections,
    selectedElection,
    votingResults,
    getElectionResults,
    createElection
}: {
    isAdmin: boolean,
    elections: Election[],
    votingSessions: ElectionSession[],
    selectedElection: Election | null,
    votingResults: Models.Document[],
    getElectionResults: (electionId: string) => Promise<Models.Document[]>
    createElection: (election: Omit<Election, '$id'>) => Promise<Models.Document>
}) {

    const [campusValue, setCampusValue] = useState<string>('');

  const handleCreateElection = () => {
    // Implement election creation logic
    console.log('Create new election')
  }

  const handleCreateVotingSession = () => {
    // Implement voting session creation logic
    console.log('Create new voting session')
  }

  const handleViewResults = async (electionId: string) => {
    // Fetch and set voting results
    const resultsResponse = await getElectionResults(electionId)
    
  }

  const handleCreateElectionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    //Get the value of campus select
    const campus = formData.get('campus') as string
    const election = await createElection({
      name,
      description,
      date,
      campus: campusValue
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Election Admin Dashboard</h1>
      
      <Tabs defaultValue="elections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="elections">Elections</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="elections">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Elections
                <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Election
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Election</DialogTitle>
                      </DialogHeader>
                        <form onSubmit={handleCreateElectionSubmit}>
                          <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              className="block w-full p-2 border rounded"
                              placeholder="Election Name"
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
                            <textarea
                              id="description"
                              name="description"
                              className="block w-full p-2 border rounded"
                              placeholder="Election Description"
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="date" className="block mb-2 text-sm font-medium">Date</label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              className="block w-full p-2 border rounded"
                              placeholder="Election Date"
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="campus" className="block mb-2 text-sm font-medium">Campus</label>
                            <Select onValueChange={(value) => setCampusValue(value)}>
                        <SelectTrigger className="w-full p-2 border rounded">
                          <SelectValue placeholder="Select a campus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">Oslo</SelectItem>
                            <SelectItem value="2">Bergen</SelectItem>
                            <SelectItem value="3">Trondheim</SelectItem>
                            <SelectItem value="4">Stavanger</SelectItem>
                            <SelectItem value="5">National</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button type="submit" variant="primary" size="sm">
                              Create Election
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                  </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elections?.map((election) => (
                    <TableRow key={election.$id}>
                      <TableCell>
                        <Link href={`/admin/elections/${election.$id}`}>
                        {election.name}
                        </Link>
                        </TableCell>
                      <TableCell>{new Date(election.date).toLocaleDateString()}</TableCell>
                      <TableCell>{election.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Election Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <select 
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleViewResults(e.target.value)}
                >
                  <option value="">Select an election</option>
                  {elections.filter(election => election.status !== 'upcoming').map(election => (
                    <option key={election.$id} value={election.$id}>{election.name}</option>
                  ))}
                </select>
              </div>
              {selectedElection && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{selectedElection.name} Results</h3>
                  {votingResults.map((result, index) => (
                    <div key={index} className="mb-6">
                      <h4 className="text-lg font-medium mb-2">{result.itemTitle}</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={result.votes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="optionName" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}