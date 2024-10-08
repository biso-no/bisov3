"use client";
import { useEffect, useState } from 'react';
import { clientSideClient } from '../appwrite-client';
import { useAuth } from '../hooks/useAuth';
import { Payload } from 'appwrite';
import { useRouter } from 'next/navigation';
import type { RealtimeResponseEvent } from 'appwrite';

export const useVotesSubscription = (electionId: string) => {
    const [data, setData] = useState(null);
    const router = useRouter();

    const { user } = useAuth();

    useEffect(() => {
        const channel = 'databases.app.collections.election_vote.documents';
        if (user && user.$id) {


            const unsubscribe = clientSideClient.subscribe([channel], (response: RealtimeResponseEvent<Payload>) => {


                // Optionally, log all events to understand which ones are being received
                if (response.events.includes('databases.app.collections.election_vote.documents.create')) {

                    // Update state with the new document payload
                    setData(response.payload);

                }
            });

            // Cleanup the subscription on component unmount
            return () => {
                unsubscribe();

            };
        }
    }, [electionId, user]);

    return data;
};
