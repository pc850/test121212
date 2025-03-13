
import React from "react";
import { Trophy, Award, Users } from "lucide-react";
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
import { cn } from "@/lib/utils";

type LeaderboardUser = {
  id: string;
  username: string;
  avatar: string;
  points: number;
  rank: number;
};

interface LeaderboardSectionProps {
  className?: string;
}

const LeaderboardSection = ({ className }: LeaderboardSectionProps) => {
  // Mock data - in a real app this would come from an API
  const topUsers: LeaderboardUser[] = [
    { 
      id: "1", 
      username: "MoniqueSpell", 
      avatar: "https://i.pravatar.cc/150?img=1", 
      points: 12450, 
      rank: 1 
    },
    { 
      id: "2", 
      username: "JasminQueen", 
      avatar: "https://i.pravatar.cc/150?img=2", 
      points: 10980, 
      rank: 2 
    },
    { 
      id: "3", 
      username: "LovelyEmma", 
      avatar: "https://i.pravatar.cc/150?img=3", 
      points: 9870, 
      rank: 3 
    },
    { 
      id: "4", 
      username: "SweetCandy", 
      avatar: "https://i.pravatar.cc/150?img=4", 
      points: 8540, 
      rank: 4 
    },
    { 
      id: "5", 
      username: "HotSophia", 
      avatar: "https://i.pravatar.cc/150?img=5", 
      points: 7650, 
      rank: 5 
    }
  ];

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Trophy className="h-4 w-4 text-fipt-blue" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.rank === 1 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100">
                      <Trophy className="h-3 w-3 text-yellow-500" />
                    </div>
                  ) : user.rank === 2 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                      <Award className="h-3 w-3 text-gray-500" />
                    </div>
                  ) : user.rank === 3 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
                      <Award className="h-3 w-3 text-amber-600" />
                    </div>
                  ) : (
                    user.rank
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm">{user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;
