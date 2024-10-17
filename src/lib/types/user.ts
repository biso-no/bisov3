import { Models } from "node-appwrite";

export interface Campus extends Models.Document {
    name: string
    users: User[]
}

export interface User extends Models.Document {
    email: string
    name: string
    campus: Campus
    isActive: boolean
    roles: string[]
}