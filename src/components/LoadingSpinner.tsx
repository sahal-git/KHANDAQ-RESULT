import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">Fetching Latest Results</h3>
        <p className="text-muted-foreground">Loading data from Google Sheets...</p>
      </div>
    </div>
  );
};
