import { createSessionClient } from "../appwrite";

export async function getAccount() {
  const { account } = await createSessionClient();

  return account.get();
}

