'use server'

import { Client, Databases, Permission, Query, Role } from 'node-appwrite'
import { revalidatePath } from 'next/cache'
import { Models } from 'node-appwrite'
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import type { NonVoter } from '@/lib/types/election';
import { headers } from 'next/headers';

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
  userId: string;
  voter_id: string;
  canVote: boolean;
  electionId: string;
  voteWeight: number;
  user: string; // This will be the ID of the related user document
  election: string; // This will be the ID of the related election document
  name: string;
  email: string;
  electionVote: string; // This will be the ID of the related electionVote document, if any
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

export async function getElection(electionId: string): Promise<Election> {
  const { db: databases } = await createSessionClient();
  const response = await databases.getDocument(databaseId, 'elections', electionId)
  return response as Election
}

export async function startSession(session: ElectionSession): Promise<ElectionSession> {
  const { db: databases } = await createSessionClient();
  console.log("Election ID", session.electionId)
  
  //Update the session to ongoing, and give read access to all voters for the session, voting items and voting options.
  const response = await databases.updateDocument(databaseId, 'election_sessions', session.$id, { 
    startTime: new Date().toISOString(), 
    status: 'ongoing',
    election: {
      $id: session.electionId,
      status: 'ongoing'
    },
    votingItems: session.votingItems.map(item => ({
      $id: item.$id,
      $permissions: [
        Permission.read(Role.team(session.electionId, 'owner')),
        Permission.update(Role.team(session.electionId, 'owner')),
        Permission.delete(Role.team(session.electionId, 'owner')),
        Permission.read(Role.team(session.electionId, 'voter')),
      ],
      votingOptions: item.votingOptions.map(option => ({
        $id: option.$id,
        votingItemId: item.$id,
        $permissions: [
          Permission.read(Role.team(session.electionId, 'owner')),
          Permission.update(Role.team(session.electionId, 'owner')),
          Permission.delete(Role.team(session.electionId, 'owner')),
          Permission.read(Role.team(session.electionId, 'voter')),
        ],
      }))
    })),
   }, [
    Permission.read(Role.team(session.electionId, 'owner')),
    Permission.update(Role.team(session.electionId, 'owner')),
    Permission.delete(Role.team(session.electionId, 'owner')),
    Permission.read(Role.team(session.electionId, 'voter')),
  ])
  revalidatePath('/admin/elections')
  return response as ElectionSession
}

export async function deleteSession(sessionId: string): Promise<ElectionSession> {
  const { db: databases } = await createSessionClient();
  const response = await databases.deleteDocument(databaseId, 'election_sessions', sessionId)
  revalidatePath('/admin/elections')
  return response as ElectionSession
}

export async function stopSession(session: ElectionSession): Promise<ElectionSession> {
  const { db: databases } = await createSessionClient();
  const response = await databases.updateDocument(databaseId, 'election_sessions', session.$id, { 
    endTime: new Date().toISOString(), 
    status: 'past',
    votingItems: session.votingItems.map(item => ({
      $id: item.$id,
      $permissions: [
        Permission.read(Role.team(session.electionId, 'owner')),
        Permission.update(Role.team(session.electionId, 'owner')),
        Permission.delete(Role.team(session.electionId, 'owner')),
      ],
      votingOptions: item.votingOptions.map(option => ({
        $id: option.$id,
        votingItem: item.$id,
        $permissions: [
          Permission.read(Role.team(session.electionId, 'owner')),
          Permission.update(Role.team(session.electionId, 'owner')),
          Permission.delete(Role.team(session.electionId, 'owner')),
        ],
      }))
    })),
   },[
    //No read access for voters
    Permission.read(Role.team(session.electionId, 'owner')),
    Permission.update(Role.team(session.electionId, 'owner')),
    Permission.delete(Role.team(session.electionId, 'owner')),
  ])
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

export async function deleteVotingItem(itemId: string): Promise<void> {
  const { db: databases } = await createSessionClient();
  await databases.deleteDocument(databaseId, 'voting_item', itemId)
  revalidatePath('/admin/elections')
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
  
  // Ensure we're only updating fields that exist in the database
  const updateData: Partial<Voter> = {
    voter_id: voter.voter_id,
    canVote: voter.canVote,
    voteWeight: voter.voteWeight,
    name: voter.name,
    email: voter.email,
  };

  // Remove any undefined fields
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  const response = await databases.updateDocument(databaseId, 'election_users', id, updateData);
  return response as Voter;
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
  const response = await databases.createDocument(databaseId, 'election_sessions', 'unique()', {
    ...session,
    status: 'upcoming',
  }, [
    Permission.read(Role.team(session.electionId, 'owner')),
    Permission.update(Role.team(session.electionId, 'owner')),
    Permission.delete(Role.team(session.electionId, 'owner')),
  ])
  revalidatePath('/admin/elections')
  return response as ElectionSession
}

export async function addVotingItem(electionId: string, votingItem: Omit<VotingItem, '$id'>): Promise<VotingItem> {
  const { db: databases } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'voting_item', 'unique()', {
      ...votingItem,
  }, [
      Permission.read(Role.team(electionId, 'owner')),
      Permission.update(Role.team(electionId, 'owner')),
      Permission.delete(Role.team(electionId, 'owner')),
  ])

  let options = []
  if (votingItem.allowAbstain) {
      const abstainOption = await addVotingOption(electionId, {
          value: 'Abstain',
          description: '',
          votingItemId: response.$id,
          votingItem: response.$id
      })
      options.push(abstainOption)
  }
  
  if (votingItem.type === 'statute') {
      const yesOption = await addVotingOption(electionId, {
          value: 'Yes',
          description: '',
          votingItemId: response.$id,
          votingItem: response.$id
      })
      const noOption = await addVotingOption(electionId, {
          value: 'No',
          description: '',
          votingItemId: response.$id,
          votingItem: response.$id
      })
      options.push(yesOption, noOption)
  }

  // Return the complete item with its options
  const completeItem = {
      ...response,
      options
  } as unknown as VotingItem

  revalidatePath('/admin/elections')
  return completeItem
}

export async function addVotingOption(electionId: string, votingOption: Omit<VotingOption, '$id'>): Promise<VotingOption> {
    console.log('addVotingOption', votingOption)
    const { db: databases } = await createSessionClient();
  const response = await databases.createDocument(databaseId, 'voting_option', 'unique()', {
    ...votingOption,
  }, [
    Permission.read(Role.team(electionId, 'owner')),
    Permission.update(Role.team(electionId, 'owner')),
    Permission.delete(Role.team(electionId, 'owner')),
  ])
  revalidatePath('/admin/elections')
  return response as VotingOption
}

export async function addOrRemoveAbstain(electionId: string, votingItemId: string, allowAbstain: boolean): Promise<void> {
    const { db: databases } = await createSessionClient();
    const item = await updateVotingItem(votingItemId, { allowAbstain })
    if (item.allowAbstain === true) {
        const abstainOption = await addVotingOption(electionId, { value: 'Abstain', description: '', votingItemId, votingItem: votingItemId })
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
export async function addVoter(electionId: string, voter: Omit<Voter, '$id'>): Promise<Voter> {
    const { db: databases, teams: sessionTeams } = await createSessionClient();
    const { teams, db: adminDatabases } = await createAdminClient();

    const origin = headers().get("origin");

    const team = await sessionTeams.createMembership(electionId, ['voter'], voter?.email, voter?.$id, undefined, `${origin}/auth/invite`)
    console.log("Team", team)
    const docBody = {
      userId: team.userId,
      voter_id: voter.voterId,
      canVote: true,
      electionId: team.teamId,
      election: team.teamId,
      voteWeight: voter.voteWeight,
      user: team.userId,
      name: voter.name,
      email: voter.email
    }
    console.log("Team", docBody)
  if (team.$id) {
    const response = await adminDatabases.createDocument(databaseId, 'election_users', team.$id, docBody, [
      Permission.read(Role.user(team.userId)),
      Permission.read(Role.team(team.teamId, 'owner')),
      Permission.update(Role.team(team.teamId, 'owner')),
      Permission.delete(Role.team(team.teamId, 'owner')),
    ])

  revalidatePath('/admin/elections')
  return response as Voter
} else {
  return null
  }
}

export async function removeVoter(electionId: string, voterId: string): Promise<void> {
    const { db: databases, teams } = await createSessionClient();
  const deletedDoc = await databases.deleteDocument(databaseId, 'election_users', voterId)

  if (deletedDoc) {
    const team = await teams.get(electionId)
    if (team) {
      await teams.deleteMembership(team.$id, voterId)
    }
  }
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
    const weight = vote.weight || 1 // Default to 1 if weight is not specified
    itemMap.set(vote.optionId, (itemMap.get(vote.optionId) || 0) + weight)
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

  //Fetch users who have not voted for the given session
  export async function fetchNonVoters(sessionId: string): Promise<NonVoter[]> {
    const { db } = await createSessionClient();
    
    try {
      // Get the session with all its relationships
      const session = await db.getDocument('app', 'election_sessions', sessionId);
      
      if (!session?.election?.electionUsers) {
        throw new Error('Session or election users data not found');
      }
  
      // Get all eligible voters from the election relationship
      const eligibleVoters = session.election.electionUsers;
  
      // Get voters who have already voted from the session relationship
      const votedVoterIds = new Set(
        (session.electionVotes || []).map(vote => vote.voterId)
      );
  
      // Filter out voters who have already voted
      const nonVoters = eligibleVoters.filter(voter => 
        !votedVoterIds.has(voter.$id)
      );
  
      // Map to required format
      return nonVoters.map(voter => ({
        name: voter.name,
        email: voter.email,
        voterId: voter.voter_id
      }));
  
    } catch (error) {
      console.error('Error fetching non-voters:', error);
      throw new Error('Failed to fetch non-voters');
    }
  }
  
  // Optional: Add a helper function to get voting statistics using the same data
