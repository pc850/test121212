
import { useEffect, useState } from "react";
import EarnButton from "@/components/EarnButton";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

const EarnPage = () => {
  const [balance, setBalance] = useState(0); // Start with zero balance
  
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Earn";
  }, []);

  // Function to increase balance with each button tap
  const handleEarnPoints = (points: number) => {
    setBalance(prev => prev + points);
  };

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {/* FIPT Balance Section */}
      <div className="mb-6">
        <Card className="w-full p-4 border border-fipt-blue/20 bg-gradient-to-r from-fipt-blue/10 to-fipt-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-fipt-muted">Your Balance</h2>
              <div className="flex items-center mt-1">
                <Coins className="w-5 h-5 mr-2 text-fipt-blue" />
                <span className="text-2xl font-bold text-fipt-dark">{balance.toLocaleString()}</span>
                <span className="ml-1 text-xs font-medium text-fipt-blue">FIPT</span>
              </div>
            </div>
            <div className="bg-white/80 px-3 py-1 rounded-full shadow-sm">
              <span className="text-xs font-medium text-fipt-dark">Rank #42</span>
            </div>
          </div>
        </Card>
      </div>
      
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
        <EarnButton onEarn={handleEarnPoints} />
      </div>
      
      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Today's Earnings</h3>
          <p className="text-xl font-bold text-fipt-dark">{balance} FIPT</p>
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
