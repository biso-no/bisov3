import { Models } from "node-appwrite";
import {Campus} from "./campus"


export interface User extends Models.Document {
    email: string
    name: string
    campus: Campus
    isActive: boolean
    roles: string[]
}