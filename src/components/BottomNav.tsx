
import { Home, Play, Bell, User, ShoppingBag, ArrowLeftRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, title: "Earn", path: "/earn" },
    { icon: Play, title: "Feed", path: "/feed" },
    { icon: ArrowLeftRight, title: "Swap", path: "/swap" },
    { icon: ShoppingBag, title: "Shop", path: "/shop" },
    { icon: User, title: "Profile", path: "/profile" },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="glass border-t border-gray-200 w-full max-w-md mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full rounded-lg transition-all duration-200 ease-in-out",
                  isActive ? "text-fipt-blue scale-105" : "text-fipt-muted"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-6 h-6 mb-1",
                  isActive && "after:absolute after:bottom-[-8px] after:left-[35%] after:w-[30%] after:h-1 after:bg-fipt-blue after:rounded-full"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "stroke-fipt-blue" : "stroke-fipt-muted"
                  )} />
                </div>
                <span className="text-xs font-medium">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
