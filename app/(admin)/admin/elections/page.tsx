import { getElections } from "@/app/(admin)/admin/elections/actions";
import AdminDashboard from "./_components/admin-dashboard";

export default async function ElectionsPage() {
  
    const elections = await getElections()

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