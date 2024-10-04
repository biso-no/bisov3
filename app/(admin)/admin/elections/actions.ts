'use server'

import { Client, Databases, Query } from 'node-appwrite'
import { revalidatePath } from 'next/cache'
import { Models } from 'node-appwrite'
import { createSessionClient } from "@/lib/appwrite";

const databaseId = 'app'

export type VotingItemType = 'statute' | 'position'

export interface Election extends Models.Document {
  description: string
  date: string;
  campus: string;
  name: string;
  status: 'upcoming' | 'ongoing' | 'past';
  sessions: ElectionSession[];
  electionUsers: Voter[];
}

export interface ElectionSession extends Models.Document {
  electionId: string
  name: string
  description: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'ongoing' | 'past';
  votingItems: VotingItem[]
  election: Election
}

export interface VotingItem extends Models.Document {
  votingSessionId: string
  title: string
  type: VotingItemType
  allowAbstain: boolean
  votingOptions: VotingOption[]
  session: ElectionSession
  maxSelections: number
}

export interface VotingOption extends Models.Document {
  votingItemId: string
  value: string
  description: string
  votingItem: VotingItem
}

export interface Voter extends Models.Document {
  electionId: string
  name: string
  email: string
  studentId: string
}
export interface Vote extends Models.Document {
  optionId: string
  voterId: string
  electionid: string
  votingSessionId: string
  votingItemId: string
}

export interface DetailedVoteResult {
    votingItemId: string
    optionId: string
    voteCount: number
  }
  
  export interface VoterParticipation {
    electionId: string
    totalVoters: number
    participatedVoters: number
  }



export async function getElections(): Promise<Election[]> {
    const { db: databases } = await createSessionClient();
  const response = await databases.listDocuments(databaseId, 'elections')
  return response.documents as Election[]
}

export async function startSession(sessionId: string): Promise<ElectionSession> {
    const { db: databases } = await createSessionClient();
    const response = await databases.updateDocument(databaseId, 'election_sessions', sessionId, { startTime: new Date().toISOString(), status: 'ongoing' })
      await databases.updateDocument(databaseId, 'elections', response.electionId, { status: 'ongoing' })
    revalidatePath('/admin/elections')
    return response as ElectionSession
}

export async function stopSession(sessionId: string): Promise<ElectionSession> {
    const { db: databases } = await createSessionClient();
    const response = await databases.updateDocument(databaseId, 'election_sessions', sessionId, { endTime: new Date().toISOString(), status: 'past' })
    revalidatePath('/admin/elections')
    return response as ElectionSession
}

export async function getElectionSessions(electionId: string): Promise<ElectionSession[]> {
    const { db: databases } = await createSessionClient();
  const response = await databases.listDocuments(databaseId, 'election_sessions', [
    Query.equal('electionId', electionId)
  ])
  return response.documents as ElectionSession[]
}

export async function getVotingItems(sessionId: string): Promise<VotingItem[]> {
    const { db: databases } = await createSessionClient();
  const response = await databases.listDocuments(databaseId, 'voting_item', [
    Query.equal('votingSessionId', sessionId)
  ])
  return response.documents as VotingItem[]
}

export async function getVotingOptions(votingItemId: string): Promise<VotingOption[]> {
    const { db: databases } = await createSessionClient();
  const response = await databases.listDocuments(databaseId, 'voting_option', [
    Query.equal('votingItemId', votingItemId)
  ])
  return response.documents as VotingOption[]
}

export async function getVoters(electionId: string): Promise<Voter[]> {
    const { db: databases } = await createSessionClient();
  const response = await databases.listDocuments(databaseId, 'election_users', [
    Query.equal('electionId', electionId)
  ])
  return response.documents as Voter[]
}

export async function getElectionResults(electionId: string): Promise<Vote[]> {
  const { db: databases } = await createSessionClient();
  const response = await databases.listDocuments(databaseId, 'election_vote', [
    Query.equal('electionId', electionId)
  ])
  return response.documents as Vote[]
}

export async function toggleVoterStatus(id: string, status: boolean) {
  const { db: databases } = await createSessionClient();
  const response = await databases.updateDocument(databaseId, 'election_users', id, {
    canVote: status
  })
  return response as Voter
}

export async function updateVoter(id: string, voter: Partial<Voter>): Promise<Voter> {
  const { db: databases } = await createSessionClient();
  const response = await databases.updateDocument(databaseId, 'election_users', id, voter)
  return response as Voter
}

export async function addElection(election: Omit<Election, '$id'>): Promise<Election> {
    const { db: databases, teams } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'elections', 'unique()', election)

  if (response.$id) {
    const team = await teams.create(response.$id, election.name)
  }
  revalidatePath('/admin/elections')
  return response as Election
}

export async function addElectionSession(session: Omit<ElectionSession, '$id'>): Promise<ElectionSession> {
    const { db: databases } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'election_sessions', 'unique()', session)
  revalidatePath('/admin/elections')
  return response as ElectionSession
}

export async function addVotingItem(votingItem: Omit<VotingItem, '$id'>): Promise<VotingItem> {
    const { db: databases } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'voting_item', 'unique()', votingItem)
  
  let initialOptions = []
  if (votingItem.allowAbstain) {
    initialOptions.push({ value: 'Abstain', description: '' })
  }
  if (votingItem.type === 'statute') {
    initialOptions.push({ value: 'Yes', description: '' })
    initialOptions.push({ value: 'No', description: '' })
  }
  if (initialOptions.length > 0) {
    for (let i = 0; i < initialOptions.length; i++) {
      const option = initialOptions[i]
      const options = await addVotingOption({ ...option, votingItemId: response.$id, votingItem: response.$id })
      if (response) {
        initialOptions[i] = response
      }
    }
  }

  revalidatePath('/admin/elections')
  return response as VotingItem
}

export async function addVotingOption(votingOption: Omit<VotingOption, '$id'>): Promise<VotingOption> {
    console.log('addVotingOption', votingOption)
    const { db: databases } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'voting_option', 'unique()', votingOption)
  revalidatePath('/admin/elections')
  return response as VotingOption
}

export async function addOrRemoveAbstain(votingItemId: string, allowAbstain: boolean): Promise<void> {
    const { db: databases } = await createSessionClient();
    const item = await updateVotingItem(votingItemId, { allowAbstain })
    if (item.allowAbstain === true) {
        const abstainOption = await addVotingOption({ value: 'Abstain', description: '', votingItemId, votingItem: votingItemId })
        revalidatePath('/admin/elections')
        return;
    } else {
        const abstainOption = await getVotingOptions(votingItemId).then(options => options.find(option => option.value === 'Abstain'))
        if (abstainOption) {
            await databases.deleteDocument(databaseId, 'voting_option', abstainOption.$id)
            revalidatePath('/admin/elections')
            return;
        }
    }
}

//Might want to swap order here. Create team membership first, then create document
export async function addVoter(voter: Omit<Voter, '$id'>): Promise<Voter> {
    const { db: databases, teams } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'election_users', 'unique()', voter)
  if (response.$id) {
    const team = await teams.createMembership(response.$id, ['voter'], voter?.email, voter?.$id)
  }
  revalidatePath('/admin/elections')
  return response as Voter
}

export async function removeVoter(voterId: string): Promise<void> {
    const { db: databases } = await createSessionClient();
  await databases.deleteDocument(databaseId, 'election_users', voterId)
  revalidatePath('/admin/elections')
}

export async function removeVotingItem(itemId: string): Promise<void> {
    const { db: databases } = await createSessionClient();
  await databases.deleteDocument(databaseId, 'voting_item', itemId)
  revalidatePath('/admin/elections')
}

export async function removeVotingOption(optionId: string): Promise<void> {
    const { db: databases } = await createSessionClient();
  await databases.deleteDocument(databaseId, 'voting_option', optionId)
  revalidatePath('/admin/elections')
}

export async function updateElection(electionId: string, election: Partial<Election>): Promise<Election> {
    const { db: databases } = await createSessionClient();
  const response = await databases.updateDocument(databaseId, 'elections', electionId, election)
  revalidatePath('/admin/elections')
  return response as Election
}

export async function updateElectionSession(sessionId: string, session: Partial<ElectionSession>): Promise<ElectionSession> {
    const { db: databases } = await createSessionClient();
    const response = await databases.updateDocument(databaseId, 'election_sessions', sessionId, session)
  revalidatePath('/admin/elections')
  return response as ElectionSession
}

export async function updateVotingItem(itemId: string, votingItem: Partial<VotingItem>): Promise<VotingItem> {
    const { db: databases } = await createSessionClient();
  const response = await databases.updateDocument(databaseId, 'voting_item', itemId, votingItem)
  revalidatePath('/admin/elections')
  return response as VotingItem
}

export async function updateVotingOption(optionId: string, votingOption: Partial<VotingOption>): Promise<VotingOption> {
    const { db: databases } = await createSessionClient();
    const response = await databases.updateDocument(databaseId, 'voting_option', optionId, votingOption)
  revalidatePath('/admin/elections')
  return response as VotingOption
}

export async function fetchDetailedResults(electionId: string): Promise<DetailedVoteResult[]> {
    const { db: databases } = await createSessionClient()
    const response = await databases.listDocuments(databaseId, 'election_vote', [
      Query.equal('electionId', electionId)
    ])
    
    const voteMap = new Map<string, Map<string, number>>()
    
    response.documents.forEach(vote => {
      if (!voteMap.has(vote.votingItemId)) {
        voteMap.set(vote.votingItemId, new Map())
      }
      const itemMap = voteMap.get(vote.votingItemId)!
      itemMap.set(vote.optionId, (itemMap.get(vote.optionId) || 0) + 1)
    })
    
    const results: DetailedVoteResult[] = []
    voteMap.forEach((itemMap, votingItemId) => {
      itemMap.forEach((voteCount, optionId) => {
        results.push({ votingItemId, optionId, voteCount })
      })
    })
    
    return results
  }

  export async function fetchVoterParticipation(electionId: string): Promise<VoterParticipation> {
    const { db: databases } = await createSessionClient()
    const votersResponse = await databases.listDocuments(databaseId, 'election_users', [
      Query.equal('electionId', electionId)
    ])
    const totalVoters = votersResponse.total
  
    const votesResponse = await databases.listDocuments(databaseId, 'election_vote', [
      Query.equal('electionId', electionId)
    ])
    const participatedVoters = new Set(votesResponse.documents.map(vote => vote.voterId)).size
  
    return {
      electionId,
      totalVoters,
      participatedVoters
    }
  }
