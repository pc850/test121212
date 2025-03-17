
import React from "react";
import { AlertTriangle } from "lucide-react";

interface RetryNoticeProps {
  isMobile: boolean;
  isTelegramMiniApp: boolean;
  isIOS: boolean;
}

const RetryNotice: React.FC<RetryNoticeProps> = ({ 
  isMobile, 
  isTelegramMiniApp,
  isIOS 
}) => {
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
      <p className="font-medium flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> Connection taking too long</p>
      <p className="mt-1">If Tonkeeper didn't open, please try these steps:</p>
      <ol className="list-decimal pl-4 mt-1 space-y-1">
        <li>Make sure you have the Tonkeeper app installed</li>
        <li>Tap "Try Again" to make another connection attempt</li>
        {isMobile && <li>{isIOS ? "On iOS, you may need to open the App Store to install Tonkeeper" : "On Android, you may need to open the Play Store to install Tonkeeper"}</li>}
        {isTelegramMiniApp && <li>After connecting in Tonkeeper, return to this Telegram Mini App</li>}
      </ol>
    </div>
  );
};

export default RetryNotice;
