import type { Models } from "node-appwrite";

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
    voter_id: string
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