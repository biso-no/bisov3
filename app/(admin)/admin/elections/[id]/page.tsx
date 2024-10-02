import ElectionDashboard from '../_components/election-dashboard'
import { getElections, getElectionSessions, getVotingItems, getVotingOptions, getVoters } from '@/app/(admin)/admin/elections/actions'

export default async function ElectionPage() {
  const elections = await getElections()
  const initialElection = elections[0] // Assuming we're working with the first election

  if (!initialElection) {
    return <div>No elections found. Please create an election first.</div>
  }

  const sessions = await getElectionSessions(initialElection.$id)
  const voters = await getVoters(initialElection.$id)

  const sessionsWithItems = await Promise.all(sessions.map(async (session) => {
    const votingItems = await getVotingItems(session.$id)
    const votingItemsWithOptions = await Promise.all(votingItems.map(async (item) => {
      const options = await getVotingOptions(item.$id)
      return { ...item, options }
    }))
    return { ...session, votingItems: votingItemsWithOptions }
  }))

  return <ElectionDashboard initialElection={{ ...initialElection, sessions: sessionsWithItems, voters }} />
}