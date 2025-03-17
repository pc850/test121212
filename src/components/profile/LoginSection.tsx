
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  if (isLoggedIn) return null;
  
  return (
    <>
      <div className="px-6 pb-2 flex justify-between -mt-2">
        <div className="flex gap-2 w-full justify-between">
          <TonConnectButton />
        </div>
      </div>
    </>
  );
};

export default LoginSection;
