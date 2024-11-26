import { Models } from "node-appwrite";
export interface Campus extends Models.Document {
    name: string
}
export interface Department extends Models.Document {
    name: string
}
export interface User extends Models.Document {
    name: string
}
export interface Expense extends Models.Document{
    campus: string,
    department: string,
    bank_account: string,
    total: string,
    status: string,
    user:User
}