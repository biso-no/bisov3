export type Event = {
  $id?: string;
  title: string;
  description: string;
  units?: string[]; // relationship IDs to departments
  price?: number | null;
  ticket_url?: string | null;
  image?: string | null; // URL or storage file ID
  status: 'draft' | 'publish' | string;
  start_time?: string | null; // HH:mm or ISO
  end_time?: string | null; // HH:mm or ISO
  start_date: string; // ISO date
  end_date: string; // ISO date
  campus: string; // campus_id
  totalAttemdees?: number | null; // note original spelling
  departmentId?: string | null; // primary department
}

export type EventWithRefs = Event & {
  campus_ref?: { $id: string; name: string };
  units_ref?: { $id: string; Name: string }[];
}


