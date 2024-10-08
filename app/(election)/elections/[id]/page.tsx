import VoterComponent from "../../_components/vote";
import { getElection, getVotes } from "../actions";
import type { Election } from "@/app/(admin)/admin/elections/actions";

export default async function ElectionPage({ params }: { params: { id: string } }) {
  console.log("ElectionPage params:", params);
  const election = await getElection(params.id) as Election;

  const hasVotedForActiveSession = await getVotes(params.id);
  console.log("hasVotedForActiveSession:", hasVotedForActiveSession);

  return (
    <VoterComponent initialElection={election} initialVotes={hasVotedForActiveSession} />
  );
}