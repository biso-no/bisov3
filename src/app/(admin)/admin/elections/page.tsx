import { getElections,  } from "@/app/(admin)/admin/elections/actions";
import AdminDashboard from "./_components/admin-dashboard";
import { getElectionResults } from '@/app/(admin)/admin/elections/actions'
import { createElection } from '@/app/actions/elections'

export default async function ElectionsPage() {
  
    const elections = await getElections()
    console.log(elections)
  return (
    <AdminDashboard
      isAdmin={true}
      elections={elections}
      votingSessions={[]}
      selectedElection={null}
      votingResults={[]}
      getElectionResults={getElectionResults}
      createElection={createElection}
    />
  )
}