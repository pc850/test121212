
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TelegramLoginOptions from "@/components/auth/TelegramLoginOptions";
import TonConnectButton from "@/components/TonConnectButton";

interface LoginSectionProps {
  showLoginOptions: boolean;
  setShowLoginOptions: (show: boolean) => void;
  onLoginSuccess: () => void;
  isLoggedIn: boolean;
}

const LoginSection = ({ 
  showLoginOptions, 
  setShowLoginOptions, 
  onLoginSuccess,
  isLoggedIn 
}: LoginSectionProps) => {
  if (isLoggedIn) return null;
  
  return (
    <>
      <div className="px-6 pb-2 flex justify-between -mt-2">
        <div className="flex gap-2 w-full justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowLoginOptions(!showLoginOptions)}
          >
            {showLoginOptions ? "Hide Login Options" : "Login / Sign Up"}
          </Button>
          <TonConnectButton />
        </div>
      </div>
      
      {/* Login Options Dialog */}
      {showLoginOptions && (
        <div className="px-6 mt-4 mb-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">Sign In / Sign Up</h3>
            <TelegramLoginOptions onSuccess={onLoginSuccess} />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSection;
