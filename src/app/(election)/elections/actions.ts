"use server"
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VotingItemType, Vote } from "@/lib/types/election";
import { ID, Permission, Query, Role } from "node-appwrite";

export async function getElection(electionId: string) {
    const { db } = await createSessionClient();
    try {
        const election = await db.getDocument(
            'app',
            'elections',
            electionId
        );
        revalidatePath('/admin/elections');
        return election;
    } catch (error) {
        console.error('Error fetching election:', error);
        return null;
    }
}

export async function getElections() {
    const { db } = await createSessionClient();
    try {
        const elections = await db.listDocuments(
            'app',
            'elections'
        );
        revalidatePath('/admin/elections');
        return elections.documents;
    } catch (error) {
        console.error('Error fetching elections:', error);
        return [];
    }
}

export async function getActiveSession(electionId: string) {
    const { db } = await createSessionClient();
    try {
        const sessions = await db.listDocuments(
            'app',
            'election_sessions',
            [
                Query.equal('electionId', electionId),
                Query.equal('status', 'ongoing')
            ]
        )
        return sessions.documents[0]
    } catch (error) {
        console.error('Error fetching active session:', error);
        return null;
    }
}


export async function castVote(electionId: string, optionId: string, votingSessionId: string, votingItemId: string) {
    const { db, account } = await createSessionClient();
    const { db: adminDb } = await createAdminClient();
    try {
        const user = await account.get();
        const voter = await db.listDocuments(
            'app',
            'election_users',
            [
                Query.equal('electionId', electionId),
                Query.equal('userId', user.$id)
            ]
        );
        if (!voter) {
            return new Error('Voter not found');
        }
        const vote = await adminDb.createDocument(
            'app',
            'election_vote',
            ID.unique(),
            {
                voterId: voter.documents[0].$id,
                optionId,
                votingSessionId,
                votingItemId,
                electionId,
                voter: voter.documents[0].$id,
                weight: voter.documents[0].voteWeight,
                electionSession: votingSessionId,
                votingOption: optionId,
            },
            [
                Permission.read(Role.member(voter.documents[0].$id)),
                Permission.read(Role.team(electionId, 'owner')),
                Permission.delete(Role.member(voter.documents[0].$id)),
            ]
        ) as Vote;
        revalidatePath('/elections/' + electionId);
        return vote;
    } catch (error) {
        console.error('Error casting vote:', error);
        return null;
    }
}

export async function getVotes(electionId: string) {
    const { db, account } = await createSessionClient();
    try {
        //Find the active session, and check if the user has already voted
        const activeSession = await db.listDocuments(
            'app',
            'election_sessions',
            [
                Query.equal('electionId', electionId),
                Query.equal('status', 'ongoing'),
            ]
        );

        const user = await account.get();
        const voter = await db.listDocuments(
            'app',
            'election_users',
            [
                Query.equal('electionId', electionId),
                Query.equal('userId', user.$id)
            ]
        );
        const votes = await db.listDocuments(
            'app',
            'election_vote',
            [
                Query.equal('voterId', voter.documents[0].$id),
                Query.equal('votingSessionId', activeSession.documents[0].$id),
            ]
        );
        return votes.total > 0;
    } catch (error) {
        console.error('Error checking if user has already voted:', error);
        return false;
    }
}