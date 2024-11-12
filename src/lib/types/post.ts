import { Models } from "node-appwrite";

export interface Department extends Models.Document{
    Name:string
}

export interface Campus extends Models.Document{
    name:string
}

export interface Post extends Models.Document{
    title: string;
    url: string;
    content: string;
    status: string;
    image:string;
    department: Department;
    campus_id: Campus
}