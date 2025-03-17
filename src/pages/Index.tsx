
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to the auth page instead of earn page
  return <Navigate to="/" replace />;
};

export default Index;
