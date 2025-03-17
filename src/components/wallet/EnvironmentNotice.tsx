
import React from "react";
import { Smartphone } from "lucide-react";

interface EnvironmentNoticeProps {
  isTelegramMiniApp: boolean;
  isMobile: boolean;
  isIOS: boolean;
}

const EnvironmentNotice: React.FC<EnvironmentNoticeProps> = ({ 
  isTelegramMiniApp,
  isMobile,
  isIOS
}) => {
  if (isTelegramMiniApp) {
    return (
      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
        <p className="font-medium">IMPORTANT: Telegram Mini App Notice</p>
        <p><strong>You are using a Telegram Mini App.</strong> Connecting to Tonkeeper will open outside of Telegram.</p>
        <p className="mt-1">When you click the button, you should be redirected to Tonkeeper. After connecting in Tonkeeper, you <strong>must return to Telegram</strong> to complete the process.</p>
      </div>
    );
  }
  
  if (isMobile) {
    return (
      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
        <p className="font-medium flex items-center"><Smartphone className="h-3 w-3 mr-1" /> Mobile Device Instructions</p>
        <p><strong>You need the Tonkeeper app installed</strong> on your device.</p>
        <p className="mt-1">Tapping the button will attempt to open the Tonkeeper app. If it doesn't open:</p>
        <ol className="list-decimal pl-4 mt-1 space-y-1">
          <li>Make sure Tonkeeper is installed</li>
          <li>{isIOS ? "On iOS, get Tonkeeper from the App Store" : "On Android, get Tonkeeper from the Play Store"}</li>
          <li>After installing, tap the button again</li>
        </ol>
      </div>
    );
  }
  
  return null;
};

export default EnvironmentNotice;
