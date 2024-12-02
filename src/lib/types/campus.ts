import { User } from "./user";
import { Models } from "node-appwrite";
export interface Campus extends Models.Document {
    name: string
    users: User[]
}