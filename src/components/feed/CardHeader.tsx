
import React from 'react';

interface CardHeaderProps {
  username: string;
  userAvatar: string;
}

const CardHeader = ({ username, userAvatar }: CardHeaderProps) => {
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
        <img 
          src={userAvatar} 
          alt={username} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="ml-3">
        <h3 className="font-medium text-white drop-shadow-md">{username}</h3>
        <p className="text-xs text-white/80 drop-shadow-sm">FIPT Community</p>
      </div>
    </div>
  );
};

export default CardHeader;
