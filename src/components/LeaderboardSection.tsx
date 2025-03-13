
import React from "react";
import { Trophy, Clock, Flame, Heart } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MasturbationUser = {
  id: string;
  username: string;
  avatar: string;
  minutesSpent: number;
  rank: number;
};

interface LeaderboardSectionProps {
  className?: string;
}

const LeaderboardSection = ({ className }: LeaderboardSectionProps) => {
  // Data for adult users 18+ who spend time on platforms
  const topMasturbators: MasturbationUser[] = [
    { 
      id: "1", 
      username: "@HotRod_69", 
      avatar: "https://i.pravatar.cc/150?img=11", 
      minutesSpent: 12450, 
      rank: 1 
    },
    { 
      id: "2", 
      username: "@PussyLover420", 
      avatar: "https://i.pravatar.cc/150?img=12", 
      minutesSpent: 10980, 
      rank: 2 
    },
    { 
      id: "3", 
      username: "@StrokeKing", 
      avatar: "https://i.pravatar.cc/150?img=13", 
      minutesSpent: 9870, 
      rank: 3 
    },
    { 
      id: "4", 
      username: "@LonelyGuy4U", 
      avatar: "https://i.pravatar.cc/150?img=14", 
      minutesSpent: 8540, 
      rank: 4 
    },
    { 
      id: "5", 
      username: "@SexMachine88", 
      avatar: "https://i.pravatar.cc/150?img=15", 
      minutesSpent: 7650, 
      rank: 5 
    },
    { 
      id: "6", 
      username: "@JerkyBoy", 
      avatar: "https://i.pravatar.cc/150?img=16", 
      minutesSpent: 6890, 
      rank: 6 
    },
    { 
      id: "7", 
      username: "@CamLover24", 
      avatar: "https://i.pravatar.cc/150?img=17", 
      minutesSpent: 5950, 
      rank: 7 
    }
  ];

  // Format minutes to hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-3 bg-fipt-dark text-white rounded-t-lg">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          Top Masturbators
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white rounded-b-lg overflow-hidden">
          {topMasturbators.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center p-3 border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 min-w-8">
                {user.rank === 1 ? (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                ) : user.rank === 2 ? (
                  <Trophy className="h-5 w-5 text-gray-400" />
                ) : user.rank === 3 ? (
                  <Trophy className="h-5 w-5 text-amber-600" />
                ) : (
                  <span className="text-sm text-gray-500 font-medium">{user.rank}</span>
                )}
              </div>
              
              <div className="flex items-center flex-1 ml-2">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm mr-3">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.slice(1, 3).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm text-fipt-dark">{user.username}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" /> 
                    <span>{formatTime(user.minutesSpent)} spent</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs font-medium">{Math.floor(user.minutesSpent / 100)}</span>
                </div>
                <div className="text-xs text-gray-500">sessions</div>
              </div>
            </div>
          ))}
          
          <div className="p-3 bg-gray-50 text-center">
            <span className="text-xs text-gray-500">All users are 18+ years old</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;
