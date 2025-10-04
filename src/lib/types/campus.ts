import { User } from "./user";
import { Models } from "node-appwrite";
export type Campus = Models.Document & {
    name: string
    users: User[]
}