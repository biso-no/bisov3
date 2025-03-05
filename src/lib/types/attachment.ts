
import { Models } from "node-appwrite";
export interface Attachment extends Models.Document {
    amount: number;
    date: Date;
    description: string;
    image: File | null;
    url: string
    $id: string
}