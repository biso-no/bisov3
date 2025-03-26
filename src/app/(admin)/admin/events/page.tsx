import { getEvents } from "@/app/actions/admin";
import { EventsTable } from "./events-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-end items-center pr-4">
        <Link href="/admin/events/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>
      <EventsTable events={events} />
    </div>
  );
} 