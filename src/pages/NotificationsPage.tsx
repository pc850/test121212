
import { useEffect, useState } from "react";
import { CheckCheck, Bell, MessageSquare, Award, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "like" | "comment" | "achievement" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  userAvatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You've earned 1000 FIPT points! Keep going!",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "like",
    title: "New Like",
    message: "crypto_whale liked your post",
    time: "1 hour ago",
    read: false,
    userAvatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    type: "comment",
    title: "New Comment",
    message: "blockchain_dev commented: 'Great achievement!'",
    time: "3 hours ago",
    read: true,
    userAvatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    type: "system",
    title: "Daily Reminder",
    message: "Don't forget to claim your daily bonus",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "achievement",
    title: "New Rank",
    message: "You've reached Rank 42 on the leaderboard",
    time: "1 day ago",
    read: true,
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageSquare className="w-5 h-5 text-fipt-blue" />;
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-fipt-muted" />;
    }
  };
  
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Notifications";
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-fipt-dark">Notifications</h1>
          {unreadCount > 0 && (
            <div className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-fipt-blue rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
        
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-1 text-xs font-medium text-fipt-blue"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all read</span>
        </button>
      </div>
      
      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={cn(
              "p-4 rounded-xl border bg-white transition-all duration-300 animate-slide-up",
              notification.read ? "border-gray-100" : "border-fipt-blue/30 shadow-sm"
            )}
          >
            <div className="flex">
              {/* Icon or avatar */}
              <div className="mr-3 mt-0.5">
                {notification.userAvatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={notification.userAvatar} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-fipt-gray">
                    {getNotificationIcon(notification.type)}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn(
                    "font-medium",
                    notification.read ? "text-fipt-dark" : "text-fipt-blue"
                  )}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-fipt-muted">{notification.time}</span>
                </div>
                <p className="text-sm text-fipt-muted">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
