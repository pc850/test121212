
import { useEffect } from "react";
import EarnButton from "@/components/EarnButton";

const EarnPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Earn";
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block px-3 py-1 bg-fipt-blue/10 rounded-full text-xs font-medium text-fipt-blue mb-2">
          Click to Earn
        </div>
        <h1 className="text-2xl font-bold text-fipt-dark">Earn FIPT Points</h1>
        <p className="text-sm text-fipt-muted mt-1">
          Tap the button below to earn FIPT points
        </p>
      </div>
      
      {/* Earn Button */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <EarnButton />
      </div>
      
      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Today's Earnings</h3>
          <p className="text-xl font-bold text-fipt-dark">120 FIPT</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Rank</h3>
          <p className="text-xl font-bold text-fipt-dark">#42</p>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;
