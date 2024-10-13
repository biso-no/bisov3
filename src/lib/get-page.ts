import { Data } from "@measured/puck";
import { createAdminClient } from "./appwrite";
import { Query } from "node-appwrite";

const databaseId = "webapp";
const collectionId = "page_content";

export const getPage = async (path: string): Promise<Data | null> => {
  try {
    const { db } = await createAdminClient();
    const response = await db.listDocuments(databaseId, collectionId, [
      Query.equal('path', path),
    ]);


    if (response.total > 0) {
      const document = response.documents[0];

      // Parse each string in the content array back into an object
      const content = document.content.map((item: string) => JSON.parse(item));

      const zones = JSON.parse(document.zones) ?? {};

      return {
        content,
        zones,
        root: {
          props: {
            title: document.title,
          },
        },
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};
