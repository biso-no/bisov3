"use client";

import { Event } from "@/lib/types/event";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Grid,
  List,
  Edit,
  PlusCircle,
  Trash,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock3
} from "lucide-react";
import { getDepartments } from "@/app/actions/admin";
import { deleteEvent, updateEventStatus } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/lib/hooks/use-toast";

export function EventsTable({ events }: { events: Event[] }) {
  const [uniqueUnits, setUniqueUnits] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [viewType, setViewType] = useState<"list" | "grid">("list");

  // Search filters
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("all");
  const [status, setStatus] = useState("all");

  // Form
  const [formData, setFormData] = useState({
    search: "",
    unit: "all",
    status: "all",
  });

  const router = useRouter();

  // Extract unique units when the component loads
  useEffect(() => {
    async function fetchUnits() {
      try {
        const departments = await getDepartments();
        setUniqueUnits(departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    
    fetchUnits();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        (search === "" ||
          event.title.toLowerCase().includes(search.toLowerCase())) &&
        (unit === "all" ||
          (event.units && event.units.some(u => u.$id === unit))) &&
        (status === "all" || event.status === status)
    );
  }, [events, search, unit, status]);

  // Pagination
  const ITEMS_PER_PAGE = 5;
  const paginatedEvents = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, page]);
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  // Form handlers
  const handleChange = (eOrField) => {
    if (typeof eOrField === "string") {
      // This is for the Select components
      return (value) => {
        setFormData({
          ...formData,
          [eOrField]: value,
        });
      };
    } else {
      // This is for the Input fields
      const { name, value } = eOrField.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(formData.search);
    setUnit(formData.unit);
    setStatus(formData.status);
    setPage(1); // Reset to first page when searching
  };

  // View type toggle
  const toggleViewType = () => {
    setViewType(viewType === "list" ? "grid" : "list");
  };

  // Row actions
  const handleRowClick = (eventId: string) => {
    router.push(`/admin/events/${eventId}`);
  };

  const handleDelete = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted",
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the event",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: "pending" | "approved" | "rejected", e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateEventStatus(eventId, newStatus);
      toast({
        title: "Status updated",
        description: `Event ${newStatus === "approved" ? "approved" : newStatus === "rejected" ? "rejected" : "marked as pending"}`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      });
    }
  };

  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending Approval</Badge>;
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleViewType}
                className="h-8 w-8"
              >
                {viewType === "list" ? (
                  <Grid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
              <CardTitle>Events</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                type="text"
                name="search"
                placeholder="Search by name..."
                value={formData.search}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={formData.unit}
                onValueChange={handleChange("unit")}
                name="unit"
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  {uniqueUnits.map((unit) => (
                    <SelectItem key={unit.$id} value={unit.$id}>
                      {unit.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={formData.status}
                onValueChange={handleChange("status")}
                name="status"
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-primary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {viewType === "list" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.length > 0 ? (
                    paginatedEvents.map((event) => (
                      <TableRow
                        key={event.$id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(event.$id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {event.image && (
                              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold">{event.title}</div>
                              {event.ticket_url && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <span className="truncate max-w-[200px]">
                                    {event.ticket_url}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {format(parseISO(event.start_date), "MMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{event.start_time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {event.units && event.units.length > 0 ? (
                              event.units.slice(0, 2).map((unit) => (
                                <Badge key={unit.$id} variant="outline" className="whitespace-nowrap">
                                  {unit.Name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No units</span>
                            )}
                            {event.units && event.units.length > 2 && (
                              <Badge variant="outline">+{event.units.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span>{event.price > 0 ? `${event.price} kr` : "Free"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/admin/events/${event.$id}`);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit event</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            {event.status === "pending" && (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-green-500 border-green-500 hover:bg-green-50"
                                        onClick={(e) => handleStatusChange(event.$id, "approved", e)}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Approve event</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 border-red-500 hover:bg-red-50"
                                        onClick={(e) => handleStatusChange(event.$id, "rejected", e)}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Reject event</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
                            
                            {(event.status === "approved" || event.status === "rejected") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-yellow-500 border-yellow-500 hover:bg-yellow-50"
                                      onClick={(e) => handleStatusChange(event.$id, "pending", e)}
                                    >
                                      <Clock3 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reset to pending</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 border-red-500 hover:bg-red-50"
                                    onClick={(e) => handleDelete(event.$id, e)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete event</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Calendar className="h-10 w-10 mb-2" />
                          <h3 className="font-semibold text-lg">No events found</h3>
                          <p className="text-sm">Try adjusting your search filters or create a new event.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => router.push("/admin/events/new")}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Event
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => (
                  <Card
                    key={event.$id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRowClick(event.$id)}
                  >
                    <div className="relative w-full h-40 bg-muted">
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(parseISO(event.start_date), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {event.start_time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {event.price > 0 ? `${event.price} kr` : "Free"}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {event.units && event.units.slice(0, 2).map((unit) => (
                            <Badge key={unit.$id} variant="outline" className="whitespace-nowrap">
                              {unit.Name}
                            </Badge>
                          ))}
                          {event.units && event.units.length > 2 && (
                            <Badge variant="outline">+{event.units.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/events/${event.$id}`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 border-red-500 hover:bg-red-50"
                        onClick={(e) => handleDelete(event.$id, e)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full py-10">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Calendar className="h-10 w-10 mb-2" />
                    <h3 className="font-semibold text-lg">No events found</h3>
                    <p className="text-sm">Try adjusting your search filters or create a new event.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => router.push("/admin/events/new")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 px-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 