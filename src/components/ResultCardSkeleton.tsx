import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ResultCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/6" />
        </div>
        <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/6" />
        </div>
        <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/6" />
        </div>
      </CardContent>
    </Card>
  );
};
