
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Set page title
    document.title = "FIPT - Not Found";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-fipt-blue/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-fipt-blue" />
      </div>
      
      <h1 className="text-2xl font-bold text-fipt-dark mb-2">Page Not Found</h1>
      <p className="text-fipt-muted text-center mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link
        to="/earn"
        className="flex items-center gap-2 text-fipt-blue font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
