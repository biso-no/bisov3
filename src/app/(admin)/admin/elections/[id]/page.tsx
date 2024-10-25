import ElectionDashboard from '../_components/election-dashboard'
import { getElection, getElectionSessions, getVotingItems, getVotingOptions, getVoters } from '@/app/(admin)/admin/elections/actions'
import {
  addElectionSession,
  addVotingItem,
  addVotingOption,
  removeVotingOption,
  addOrRemoveAbstain,
  fetchDetailedResults,
  fetchVoterParticipation,
  startSession,
  stopSession,
  deleteSession,
  deleteVotingItem,
  fetchNonVoters
} from '../actions'

export default async function ElectionPage({ params }: { params: { id: string } }) {
  const election = await getElection(params.id)

  if (!election) {
    return <div>No elections found. Please create an election first.</div>
  }

  const sessions = await getElectionSessions(election.$id)
  const voters = await getVoters(election.$id)

  const sessionsWithItems = await Promise.all(sessions.map(async (session) => {
    const votingItems = await getVotingItems(session.$id)
    const votingItemsWithOptions = await Promise.all(votingItems.map(async (item) => {
      const options = await getVotingOptions(item.$id)
      return { ...item, options }
    }))
    return { ...session, votingItems: votingItemsWithOptions }
  }))

  return <ElectionDashboard 
            initialElection={{ ...election, sessions: sessionsWithItems, voters }} 
            addElectionSession={addElectionSession}
            addVotingItem={addVotingItem}
            addVotingOption={addVotingOption}
            removeVotingOption={removeVotingOption}
            addOrRemoveAbstain={addOrRemoveAbstain}
            fetchDetailedResults={fetchDetailedResults}
            fetchVoterParticipation={fetchVoterParticipation}
            startSession={startSession}
            stopSession={stopSession}
            deleteSession={deleteSession}
            deleteVotingItem={deleteVotingItem}
            fetchNonVoters={fetchNonVoters}
          />
}