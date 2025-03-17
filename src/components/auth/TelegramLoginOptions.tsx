
import { TelegramUser } from "@/types/telegram";
import TelegramLoginButton from "@/components/TelegramLoginButton";

interface TelegramLoginOptionsProps {
  onSuccess?: (user: TelegramUser) => void;
}

const TelegramLoginOptions = ({ onSuccess }: TelegramLoginOptionsProps) => {
  const handleTelegramAuth = (user: TelegramUser) => {
    if (onSuccess) {
      onSuccess(user);
    }
  };

  return (
    <TelegramLoginButton 
      botName="Chicktok_bot"
      onAuth={handleTelegramAuth}
      buttonSize="large"
      cornerRadius={8}
      className="my-2"
    />
  );
};

export default TelegramLoginOptions;
