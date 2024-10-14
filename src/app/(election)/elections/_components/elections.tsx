"use client";
import { Clock, Calendar, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Models } from "node-appwrite";
import { useRouter } from "next/navigation";

export default function ElectionsPage({ elections }: { elections: Models.Document[] }) {
  const upcomingElections = elections.filter(election => election.status === 'upcoming');
  const ongoingElections = elections.filter(election => election.status === 'ongoing');

  const router = useRouter();

  const handleViewElection = (electionId: string) => {
    router.push(`/elections/${electionId}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-6">Elections</h1>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Ongoing Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingElections.map((election) => (
                <Card key={election.$id} className="mb-6">
                  <CardHeader>
                    <CardTitle>{election.name}</CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{election.date.split('T')[0]}</div>
                    <div className="text-sm text-muted-foreground">Ongoing</div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="ml-2 capitalize">Ongoing</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-sm" onClick={() => handleViewElection(election.$id)}>
                      <ArrowDown className="h-3.5 w-3.5" />
                      <span className="ml-2 capitalize">View</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingElections.map((election) => (
                <Card key={election.$id} className="mb-6">
                  <CardHeader>
                    <CardTitle>{election.name}</CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{election.date.split('T')[0]}</div>
                    <div className="text-sm text-muted-foreground">Upcoming</div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="ml-2 capitalize">Upcoming</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-sm" onClick={() => handleViewElection(election.$id)}>
                      <ArrowDown className="h-3.5 w-3.5" />
                      <span className="ml-2 capitalize">View</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
