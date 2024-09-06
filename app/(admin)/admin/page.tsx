import { Dashboard } from "@/components/dashboard";
import { getAccount } from "@/lib/admin/account";

export default async function Page() {

  const account = await getAccount();

  return <Dashboard userId={account.$id} />;
}