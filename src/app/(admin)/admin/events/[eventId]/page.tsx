import { notFound } from "next/navigation";
import { getEvent, getDepartments, getCampuses } from "@/app/actions/admin";
import { EventForm } from "../event-form";

export default async function AdminEventPage({ params }: { params: { eventId: string } }) {
  const departments = await getDepartments();
  const campuses = await getCampuses();
  
  let event = null;
  if (params.eventId !== "new") {
    event = await getEvent(params.eventId);
    if (!event) {
      notFound();
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        {event ? "Edit Event" : "Create New Event"}
      </h1>
      <EventForm 
        event={event} 
        departments={departments} 
        campuses={campuses} 
      />
    </div>
  );
} 