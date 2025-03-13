
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // This page just redirects to the earn page
  return <Navigate to="/earn" replace />;
};

export default Index;
