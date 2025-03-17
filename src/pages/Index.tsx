
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to the auth page
  return <Navigate to="/" replace />;
};

export default Index;
