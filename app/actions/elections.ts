"use server"
import { createSessionClient } from "@/lib/appwrite";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getElections({
    limit = 100,
    offset = 0,
    search = '',
    path = '/admin/elections',
  }: {
    limit?: number;
    offset?: number;
    search?: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        let query = [Query.limit(limit), Query.offset(offset)];
        if (search) {
            query.push(Query.search('name', search));
        }
        query.push(Query.orderDesc('$createdAt'));
        const elections = await db.listDocuments(
            'app',
            'elections',
            query
        );
        revalidatePath(path);
        return elections.documents;
    } catch (error) {
        console.error('Error fetching elections:', error);
        return [];
    }
}

export async function getElection({
    electionId,
    path = '/admin/elections',
  }: {
    electionId: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const election = await db.getDocument(
            'app',
            'elections',
            electionId
        );
        revalidatePath(path);
        return election;
    } catch (error) {
        console.error('Error fetching election:', error);
        return null;
    }
}

export async function createElection({
    name,
    description,
    date,
    campus,
    path = '/admin/elections',
  }: {
    name: string;
    description: string;
    date: string;
    campus: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const election = await db.createDocument(
            'app',
            'elections',
            ID.unique(),
            {
                name,
                description,
                date,
                campus: campus
            },
            []
        );
        revalidatePath(path);
        return election;
    } catch (error) {
        console.error('Error creating election:', error);
        return null;
    }
}

export async function updateElection({
    electionId,
    name,
    description,
    date,
    path = '/admin/elections',
  }: {
    electionId: string;
    name: string;
    description: string;
    date: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const election = await db.updateDocument(
            'app',
            'elections',
            electionId,
            {
                name,
                description,
                date,
            },
            []
        );
        revalidatePath(path);
        return election;
    } catch (error) {
        console.error('Error updating election:', error);
        return null;
    }
}

export async function deleteElection({
    electionId,
    path = '/admin/elections',
  }: {
    electionId: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const election = await db.deleteDocument(
            'app',
            'elections',
            electionId
        );
        revalidatePath(path);
        return election;
    } catch (error) {
        console.error('Error deleting election:', error);
        return null;
    }
}

export async function getActiveSessions({
    limit = 100,
    offset = 0,
    search = '',
    path = '/admin/elections/active-sessions',
  }: {
    limit?: number;
    offset?: number;
    search?: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        let query = [Query.limit(limit), Query.offset(offset)];
        if (search) {
            query.push(Query.search('name', search));
        }
        query.push(Query.orderDesc('$createdAt'));
        const sessions = await db.listDocuments(
            'app',
            'election_sessions',
            query
        );
        revalidatePath(path);
        return sessions.documents;
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        return [];
    }
}

export async function getActiveSession({
    sessionId,
    path = '/admin/elections/active-sessions',
  }: {
    sessionId: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.getDocument(
            'app',
            'election_sessions',
            sessionId
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error fetching active session:', error);
        return null;
    }
}

export async function createActiveSession({
    electionId,
    type,
    title,
    description,
    allowAbstain,
    startTime,
    endTime,
    path = '/admin/elections/active-sessions',
  }: {
    electionId: string;
    type: 'statute' | 'board';
    title: string;
    description: string;
    allowAbstain: boolean;
    startTime: string;
    endTime: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.createDocument(
            'app',
            'election_sessions',
            ID.unique(),
            {
                electionId,
                type,
                title,
                description,
                allowAbstain,
                startTime,
                endTime,
            },
            []
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error creating active session:', error);
        return null;
    } 
}

export async function updateActiveSession({
    sessionId,
    electionId,
    status,
    title,
    description,
    allowAbstain,
    startTime,
    endTime,
    path = '/admin/elections/active-sessions',
  }: {
    sessionId: string;
    electionId?: string;
    status?: 'upcoming' | 'completed';
    title?: string;
    description?: string;
    allowAbstain?: boolean;
    startTime?: string;
    endTime?: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.updateDocument(
            'app',
            'election_sessions',
            sessionId,
            {
                electionId,
                name: title,
                status,
                description,
                allowAbstain,
                startTime,
                endTime,
            },
            []
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error updating active session:', error);
        return null;
    } 
}

export async function deleteActiveSession({
    sessionId,
    path = '/admin/elections/active-sessions',
  }: {
    sessionId: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.deleteDocument(
            'app',
            'election_sessions',
            sessionId
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error deleting active session:', error);
        return null;
    } 
}

export async function getVotingSessions({
    limit = 100,
    offset = 0,
    electionId,
    search = '',
    path = '/admin/elections/voting-sessions',
  }: {
    limit?: number;
    offset?: number;
    electionId?: string;
    search?: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        let query = [];
        if (search) {
            query.push(Query.search('name', search));
        } else if (electionId) {
            query.push(Query.equal('electionId', electionId));
        }
        query.push(Query.orderDesc('$createdAt'));
        const sessions = await db.listDocuments(
            'app',
            'election_sessions',
            query
        );
        console.log("Sessions: ", sessions.documents)
        revalidatePath(path);
        return sessions.documents;
    } catch (error) {
        console.error('Error fetching voting sessions:', error);
        return [];
    }
}

export async function getVotingSession({
    sessionId,
    path = '/admin/elections/voting-sessions',
  }: {
    sessionId: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.getDocument(
            'app',
            'voting-sessions',
            sessionId
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error fetching voting session:', error);
        return null;
    }
}

export async function createVotingSession({
    electionId,
    type,
    title,
    description,
    allowAbstain,
    startTime,
    endTime,
    path = '/admin/elections/voting-sessions',
  }: {
    electionId: string;
    type: 'statute' | 'board';
    title: string;
    description: string;
    allowAbstain: boolean;
    startTime: string;
    endTime: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.createDocument(
            'app',
            'voting-sessions',
            ID.unique(),
            {
                electionId,
                type,
                title,
                description,
                allowAbstain,
                startTime,
                endTime,
            },
            []
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error creating voting session:', error);
        return null;
    } 
}

export async function updateVotingSession({
    sessionId,
    electionId,
    type,
    title,
    description,
    allowAbstain,
    startTime,
    endTime,
    path = '/admin/elections/' + electionId,
  }: {
    sessionId: string;
    electionId: string;
    type: 'statute' | 'board';
    title: string;
    description: string;
    allowAbstain: boolean;
    startTime: string;
    endTime: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.updateDocument(
            'app',
            'voting-sessions',
            sessionId,
            {
                electionId,
                type,
                title,
                description,
                allowAbstain,
                startTime,
                endTime,
            },
            []
        );
        return session;
    } catch (error) {
        console.error('Error updating voting session:', error);
        return null;
    } 
}

export async function deleteVotingSession({
    sessionId,
    path = '/admin/elections/voting-sessions',
  }: {
    sessionId: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        const session = await db.deleteDocument(
            'app',
            'voting-sessions',
            sessionId
        );
        revalidatePath(path);
        return session;
    } catch (error) {
        console.error('Error deleting voting session:', error);
        return null;
    } 
}

export async function getElectionStats(electionId: string) {

    const { db } = await createSessionClient();
    try {
        const votingSessions = await db.listDocuments('app', 'election_sessions', [
            Query.equal('electionId', electionId)
        ]);

        const votes = await db.listDocuments('app', 'election_vote', [
            Query.equal('electionId', electionId)
        ]);

        const users = await db.listDocuments('app', 'election_users', []);
        const userWeights = users.documents.reduce((acc, user) => {
            acc[user.$id] = user.voteWeight || 1;
            return acc;
        }, {});

        const uniqueVoters = new Set(votes.documents.map(vote => vote.userId));
        const weightedTotalVotes = votes.documents.reduce((total, vote) => total + (userWeights[vote.userId] || 1), 0);

        const stats = {
            totalVotes: weightedTotalVotes,
            averageVotingTime: calculateAverageVotingTime(votes.documents),
            participationRate: uniqueVoters.size / await getTotalEligibleVoters(electionId),
            votingSessionsCompleted: votingSessions.documents.filter(session => session.status === 'completed').length
        };

        return stats;
    } catch (error) {
        console.error('Error fetching election stats:', error);
        throw error;
    }
}


export async function getRecentResults(electionId: string) {
    const { db } = await createSessionClient();
    try {
        const votingSessions = await db.listDocuments('app', 'election_sessions', [
            Query.equal('electionId', electionId),
            Query.equal('status', 'completed'),
            Query.orderDesc('endTime'),
            Query.limit(5)
        ]);

        const users = await db.listDocuments('app', 'election_users', []);
        const userWeights = users.documents.reduce((acc, user) => {
            acc[user.$id] = user.voteWeight || 1;
            return acc;
        }, {});

        const results = await Promise.all(votingSessions.documents.map(async (session) => {
            const votingItems = await db.listDocuments('app', 'voting_item', [
                Query.equal('votingSessionId', session.$id)
            ]);

            const itemResults = await Promise.all(votingItems.documents.map(async (item) => {
                const votes = await db.listDocuments('app', 'votes', [
                    Query.equal('votingItemId', item.$id)
                ]);

                const optionCounts = votes.documents.reduce((acc, vote) => {
                    const weight = userWeights[vote.userId] || 1;
                    acc[vote.optionId] = (acc[vote.optionId] || 0) + weight;
                    return acc;
                }, {});

                const options = await db.listDocuments('app', 'options', [
                    Query.equal('votingItemId', item.$id)
                ]);

                return {
                    name: item.title,
                    votes: options.documents.map(option => ({
                        optionName: option.value,
                        count: optionCounts[option.$id] || 0
                    }))
                };
            }));

            return {
                name: session.name,
                items: itemResults
            };
        }));

        return results;
    } catch (error) {
        console.error('Error fetching recent results:', error);
        throw error;
    }
}

export async function getParticipationTrend(electionId: string) {
    const { db } = await createSessionClient();
    try {
        const votingSessions = await db.listDocuments('app', 'election_sessions', [
            Query.equal('electionId', electionId),
            Query.orderAsc('startTime')
        ]);

        const users = await db.listDocuments('app', 'election_users', []);
        const totalWeightedVoters = users.documents.reduce((total, user) => total + (user.voteWeight || 1), 0);

        const trend = await Promise.all(votingSessions.documents.map(async (session) => {
            const votes = await db.listDocuments('app', 'election_vote', [
                Query.equal('votingSessionId', session.$id)
            ]);

            const uniqueVoters = new Set(votes.documents.map(vote => vote.userId));
            const weightedParticipation = Array.from(uniqueVoters).reduce((total, userId) => {
                const user = users.documents.find(u => u.$id === userId);
                return total + (user ? user.voteWeight || 1 : 1);
            }, 0);

            return {
                date: new Date(session.startTime).toLocaleDateString(),
                participation: weightedParticipation / totalWeightedVoters
            };
        }));

        return trend;
    } catch (error) {
        console.error('Error fetching participation trend:', error);
        throw error;
    }
}

function calculateAverageVotingTime(votes: Models.Document[]) {

    const totalTime = votes.reduce((total, vote) => total + vote.duration, 0);
    const totalVotes = votes.reduce((total, vote) => total + vote.weight, 0);

    return totalTime / totalVotes;
}

async function getTotalEligibleVoters(electionId: string) {
    const { db } = await createSessionClient();

    try {
        const users = await db.listDocuments('app', 'election_users', []);
        return users.documents.reduce((total, user) => total + (user.voteWeight || 1), 0);
    } catch (error) {
        console.error('Error fetching total eligible voters:', error);
        throw error;
    }
}

export async function getVoters(electionId: string) {
    const { db } = await createSessionClient();

    try {
        const users = await db.listDocuments('app', 'election_users', []);
        return users.documents.filter(user => user.electionId === electionId);
    } catch (error) {
        console.error('Error fetching voters:', error);
        throw error;
    }
}

export async function getVotingOptions(votingItem: string) {
    const { db } = await createSessionClient();

    try {
        const options = await db.listDocuments('app', 'voting_option', [
            Query.equal('votingItemId', votingItem)
            ]);
            return options.documents;
    } catch (error) {
        console.error('Error fetching voting options:', error);
        throw error;
    }
}

export async function createVotingOption({
    votingItemId,
    value,
    description,
    path = '/admin/elections/voting-options',
  }: {
    votingItemId: string;
    value: string;
    description: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();

    try {
        const newOption = await db.createDocument('app', 'voting_option', ID.unique(), {
            votingItemId,
            votingItem: votingItemId,
            value,
            description
        });
        return newOption;
    } catch (error) {
        console.error('Error creating voting option:', error);
        throw error;
    }
}

export async function updateVotingOption(optionId: string, formData: FormData) {
    const { db } = await createSessionClient();

    try {
        const option = await db.updateDocument('app', 'voting_option', optionId, formData);
        return option;
    } catch (error) {
        console.error('Error updating voting option:', error);
        throw error;
    }
}

export async function deleteVotingOption(optionId: string) {
    const { db } = await createSessionClient();

    try {
        const option = await db.deleteDocument('app', 'voting_option', optionId);
        return option;
    } catch (error) {
        console.error('Error deleting voting option:', error);
        throw error;
    }
}

export async function getVotingItems(sessionId: string) {
    const { db } = await createSessionClient();

    try {
        const votingItems = await db.listDocuments('app', 'voting_item', [
            Query.equal('votingSessionId', sessionId)
        ]);

        return votingItems.documents;
    } catch (error) {
        console.error('Error fetching voting items:', error);
        throw error;
    }
}

export async function createVotingItem({
    sessionId,
    type,
    title,
    description,
    allowAbstain,
    path = '/admin/elections/voting-items',
  }: {
    sessionId: string;
    type: 'statute' | 'position';
    title: string;
    description?: string;
    allowAbstain?: boolean;
    path?: string;
  }) {
    const { db } = await createSessionClient();

    try {
        const votingItem = await db.createDocument('app', 'voting_item', ID.unique(), {
            votingSessionId: sessionId,
            session: sessionId,
            type,
            title,
            description,
            allowAbstain,
        });
        if (allowAbstain) {
            const options = ['Abstain'];
            if (type === 'statute') {
                options.push('Yes', 'No');
            }
           for (let i = 0; i < options.length; i++) {
               const option = await db.createDocument('app', 'voting_option', ID.unique(), {
                   votingItemId: votingItem.$id,
                   value: options[i],
                   description: options[i],
                   votingItem: votingItem.$id,
               });
           }
        }
        return votingItem;
    } catch (error) {
        console.error('Error creating voting item:', error);
        throw error;
    }
}

export async function updateVotingItem(itemId: string, formData: FormData) {
    const { db } = await createSessionClient();

    try {
        const votingItem = await db.updateDocument('app', 'voting_item', itemId, formData);
        return votingItem;
    } catch (error) {
        console.error('Error updating voting item:', error);
        throw error;
    }
}

export async function deleteVotingItem(itemId: string) {
    const { db } = await createSessionClient();

    try {
        const votingItem = await db.deleteDocument('app', 'voting_item', itemId);
        return votingItem;
    } catch (error) {
        console.error('Error deleting voting item:', error);
        throw error;
    }
}

export async function createVoter(voter: Partial<Models.Document>) {
    const { db } = await createSessionClient();

    try {
        const user = await db.createDocument('app', 'election_users', ID.unique(), voter, []);
        return user;
    } catch (error) {
        console.error('Error creating voter:', error);
        throw error;
    }
}

export async function deleteVoter(voterId: string) {
    const { db } = await createSessionClient();

    try {
        const user = await db.deleteDocument('app', 'election_users', voterId);
        return user;
    } catch (error) {
        console.error('Error deleting voter:', error);
        throw error;
    }
}  

export async function createPosition({
    sessionId,
    type,
    title,
    description,
    allowAbstain,
    path = '/admin/elections/positions',
  }: {
    sessionId: string;
    type: 'statute' | 'position';
    title: string;
    description: string;
    allowAbstain: boolean;
    path?: string;
  }) {
    const { db } = await createSessionClient();

    try {
        const newPosition = await db.createDocument('app', 'voting_item', ID.unique(), {
            votingSessionId: sessionId,
            type,
            title,
            description,
            allowAbstain,
        });
        return newPosition;
    } catch (error) {
        console.error('Error creating position:', error);
        throw error;
    }
}

export async function deletePosition(positionId: string) {
    const { db } = await createSessionClient();

    try {
        const position = await db.deleteDocument('app', 'voting_item', positionId);
        return position;
    } catch (error) {
        console.error('Error deleting position:', error);
        throw error;
    }
}

export async function createCandidate({
    itemId,
    value,
    description,
    path = '/admin/elections/candidates',
  }: {
    itemId: string;
    value: string;
    description: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();

    try {
        const newCandidate = await db.createDocument('app', 'candidates', ID.unique(), {
            itemId,
            value,
            description
        });
        return newCandidate;
    } catch (error) {
        console.error('Error creating candidate:', error);
        throw error;
    }
}

export async function deleteCandidate(candidateId: string) {
    const { db } = await createSessionClient();

    try {
        const candidate = await db.deleteDocument('app', 'voting_option', candidateId);
        return candidate;
    } catch (error) {
        console.error('Error deleting candidate:', error);
        throw error;
    }
}

export async function createSession({
    electionId,
    name,
    description,
    startTime,
    endTime,
    path = '/admin/elections/sessions',
  }: {
    electionId: string;
    name: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();

    try {
        const newSession = await db.createDocument('app', 'election_sessions', ID.unique(), {
            electionId,
            election: electionId,
            name,
            description,
            startTime,
            endTime,
        });
        return newSession;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

export async function deleteSession(sessionId: string) {
    const { db } = await createSessionClient();

    try {
        const session = await db.deleteDocument('app', 'election_sessions', sessionId);
        return session;
    } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
    }
}