import { getDepartments, getCampuses } from "@/app/actions/admin";
import { EventForm } from "../event-form";

export default async function NewEventPage() {
  const departments = await getDepartments();
  const campuses = await getCampuses();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      <EventForm 
        departments={departments} 
        campuses={campuses}
      />
    </div>
  );
} 