import { Models } from "node-appwrite";
import { Campus } from "./campus";
export interface Department extends Models.Document {
    Name: string,
    campus: Campus
}
