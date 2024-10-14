import { getElections } from "./actions";
import ElectionsPage from "./_components/elections";

export default async function ElectionPage() {
  const elections = await getElections();

  return (
    <ElectionsPage elections={elections} />
  );
}