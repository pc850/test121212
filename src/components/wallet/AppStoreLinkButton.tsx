
import React from "react";
import { Button } from "@/components/ui";
import { Download } from "lucide-react";

interface AppStoreLinkButtonProps {
  isIOS: boolean;
  onOpenAppStore: () => void;
}

const AppStoreLinkButton: React.FC<AppStoreLinkButtonProps> = ({ 
  isIOS,
  onOpenAppStore
}) => {
  return (
    <Button 
      variant="secondary"
      className="justify-start gap-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
      onClick={onOpenAppStore}
    >
      <Download className="h-4 w-4" />
      {isIOS ? "Get Tonkeeper from App Store" : "Get Tonkeeper from Play Store"}
    </Button>
  );
};

export default AppStoreLinkButton;
