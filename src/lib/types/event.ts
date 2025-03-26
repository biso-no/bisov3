import { Models } from "node-appwrite";
import { Department } from "./department";
import { Campus } from "./campus";

export interface Event extends Models.Document {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  campus: string;
  units: Department[];
  price: number;
  ticket_url: string;
  image: string;
  status: "draft" | "pending" | "approved" | "rejected";
  created_by: string;
  created_at: string;
  updated_at: string;
} 