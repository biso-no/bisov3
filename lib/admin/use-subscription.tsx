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
            console.log("User authenticated:", user.$id);
            console.log("Subscribing to real-time events...");
            console.log("Subscribing to channel:", channel);

            const unsubscribe = clientSideClient.subscribe([channel], (response: RealtimeResponseEvent<Payload>) => {
                console.log("Received response: ", response);

                // Optionally, log all events to understand which ones are being received
                if (response.events.includes('databases.app.collections.election_vote.documents.create')) {
                    console.log("Matched event:", response.events);

                    // Update state with the new document payload
                    setData(response.payload);
                    console.log("Updated data with payload:", response.payload);
                }
            });

            // Cleanup the subscription on component unmount
            return () => {
                unsubscribe();
                console.log("Unsubscribed from real-time events.");
            };
        }
    }, [electionId, user]);

    return data;
};
