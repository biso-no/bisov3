import { Models } from "node-appwrite";



export interface ExpenseAttachment extends Models.Document {
    date:Date,
    url:string,
    amount:number,
    description:string,
    type:string
}