import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Separate Skeleton component for reusability
export const NonVotersDisplaySkeleton = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-2"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Main component with loading state handling
const NonVotersDisplay = ({
  sessionName,
  nonVoters,
  isLoading = false
}: {
  sessionName: string;
  nonVoters: Array<{ voterId: string; name: string; }>;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <NonVotersDisplaySkeleton />;
  }

  if (!nonVoters?.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Everyone has voted in this session!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Non-Voters for {sessionName}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {nonVoters.length} haven&apos;t voted
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-2">
            {nonVoters.map((voter, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 hover:bg-accent rounded-lg px-2"
              >
                <span className="font-medium">{voter.voterId}</span>
                <span className="text-sm text-muted-foreground">{voter.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NonVotersDisplay;