import VoterComponent from "../../_components/vote";
import { getElection, getActiveSession } from "../actions";
import type { Election, ElectionSession } from "@/lib/types/election";

export default async function ElectionPage({ params }: { params: { id: string } }) {
  const election = await getElection(params.id) as Election;
  const session = await getActiveSession(election.$id) as ElectionSession;
  console.log("Election: ", JSON.stringify(session))

  const hasVoted = session?.electionVotes.length > 0 ? true : false
  console.log("hasVoted: ", hasVoted)

  return (
    <VoterComponent initialElection={election} initialHasVoted={hasVoted} initialSession={session} />
  );
}