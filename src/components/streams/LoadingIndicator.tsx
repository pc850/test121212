
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingIndicator = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="w-12 h-12 border-4 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
