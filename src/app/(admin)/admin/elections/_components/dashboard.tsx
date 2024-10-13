'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Models } from 'node-appwrite'
import { StatCard } from './stat-card'
import { Election } from '../actions'

type ElectionStats = {
  totalVotes: number
  averageVotingTime: number
  participationRate: number
  votingSessionsCompleted: number
}

type VotingSessionResult = {
  name: string
  items: {
    name: string
    votes: { optionName: string; count: number }[]
  }[]
}

type ParticipationTrendItem = {
  date: string
  participation: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ElectionDashboard({
  election,
  electionStats,
  recentResults,
  participationTrend
}: {
  election: Election
  electionStats: ElectionStats
  recentResults: VotingSessionResult[]
  participationTrend: ParticipationTrendItem[]
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{election.name} Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Votes" value={electionStats.totalVotes} />
        <StatCard title="Avg. Voting Time" value={`${electionStats.averageVotingTime.toFixed(2)}s`} />
        <StatCard title="Participation Rate" value={`${(electionStats.participationRate * 100).toFixed(2)}%`} />
        <StatCard title="Sessions Completed" value={electionStats.votingSessionsCompleted} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Participation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="participation" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Voting Session Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResults?.map((result, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2">{result.name}</h4>
                  {result?.items?.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h5 className="text-sm font-medium mb-1">{item.name}</h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={item.votes}
                            dataKey="count"
                            nameKey="optionName"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {item.votes.map((entry, voteIndex) => (
                              <Cell key={`cell-${voteIndex}`} fill={COLORS[voteIndex % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Voting Session Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentResults?.map((result, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2">{result.name}</h4>
                {result?.items?.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <h5 className="text-sm font-medium mb-1">{item.name}</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={item.votes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="optionName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {item?.votes?.map((entry, voteIndex) => (
                            <Cell key={`cell-${voteIndex}`} fill={COLORS[voteIndex % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}