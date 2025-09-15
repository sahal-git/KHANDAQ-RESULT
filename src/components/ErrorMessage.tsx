import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive" className="border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Results</AlertTitle>
            <AlertDescription className="mt-2">
              <p>There was an issue fetching the data. Please check your connection and the data source URL.</p>
              <p className="text-xs mt-2 font-mono p-2 bg-destructive/10 rounded">Details: {message}</p>
            </AlertDescription>
            {onRetry && (
              <div className="mt-4">
                <Button 
                  variant="destructive" 
                  onClick={onRetry}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
