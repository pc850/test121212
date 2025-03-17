
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TelegramUser } from "@/types/telegram";

export const useWalletStorage = () => {
  const storeWalletAddress = async (address: string, telegramUser: TelegramUser | null) => {
    try {
      // Store wallet address in connected_wallets
      const { error } = await supabase
        .from("connected_wallets")
        .insert({ wallet_address: address });

      if (error) {
        console.error("Supabase insertion error:", error);
        toast({
          title: "Database error",
          description: "Failed to store wallet address",
        });
      } else {
        console.log("Wallet address stored in Supabase successfully");
      }
      
      // If user is logged in with Telegram, link the wallet to the telegram user
      if (telegramUser) {
        await supabase
          .from("user_wallet_links")
          .upsert(
            {
              telegram_id: telegramUser.id,
              wallet_address: address,
              is_primary: true
            },
            { onConflict: 'telegram_id, wallet_address' }
          );
          
        console.log("Wallet linked to Telegram user");
      }
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
    }
  };

  return { storeWalletAddress };
};
