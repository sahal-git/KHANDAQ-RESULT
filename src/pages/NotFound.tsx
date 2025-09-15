import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-9xl font-black text-primary/20">404</h1>
        <p className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page Not Found
        </p>
        <p className="mt-4 text-base text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Button asChild className="mt-6">
            <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go back home
            </Link>
        </Button>
    </div>
  );
};

export default NotFound;
