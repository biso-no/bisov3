import { getElections } from "@/app/actions/elections";
import AdminDashboard from "./_components/admin-dashboard";

export default async function ElectionsPage() {
  
    const elections = await getElections({})

  return (
    <AdminDashboard
      isAdmin={true}
      elections={elections}
      votingSessions={[]}
      selectedElection={null}
      votingResults={[]}
    />
  )
}