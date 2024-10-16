import { getElections } from "./actions";
import ElectionsPage from "./_components/elections";
import { createSessionClient } from "@/lib/appwrite";

export default async function ElectionPage() {
  const elections = await getElections();

  const { account } = await createSessionClient();
  const user = await account.get();
  console.log(user)

  console.log(elections)
  return (
    <ElectionsPage elections={elections} />
  );
}