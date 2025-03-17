
"use client"; // For Next.js App Router client-side rendering

import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { toast } from "@/hooks/use-toast";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { TelegramUser } from "@/components/TelegramLoginButton";

// Import Supabase client
import { supabase } from "@/integrations/supabase/client";

const TonConnectButton: React.FC = () => {
  const { connectWallet, disconnectWallet, connected, address, wallet, available } = useTonkeeperWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walletInfo, setWalletInfo] = useState<string>("No wallet info available");
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Debug info
    if (wallet) {
      const info = `Wallet initialized: ${!!wallet}, Connected: ${connected}, Address: ${address}, Available wallets: ${available.length}`;
      console.log(info);
      setWalletInfo(info);
    }
    
    // Check if user is logged in with Telegram
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        setTelegramUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, [wallet, connected, address, available]);

  // Connect function to trigger Tonkeeper via TonConnect
  const handleConnect = async () => {
    try {
      console.log("Attempting to connect wallet from button...");
      setIsConnecting(true);
      
      // If no wallets are available, show specific error
      if (!available || available.length === 0) {
        toast({
          title: "No wallets available",
          description: "No compatible wallets found. Please install Tonkeeper.",
          variant: "destructive"
        });
        return;
      }
      
      // Display available wallets for debugging
      console.log("Available wallets:", JSON.stringify(available, null, 2));
      
      await connectWallet();
      
      toast({
        title: "Connection initiated",
        description: "Please check your wallet app to approve the connection",
      });
      
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection error",
        description: `Failed to connect to wallet: ${error.message || String(error)}`,
        variant: "destructive"
      });
    } finally {
      // We'll keep the connecting state for a bit in case the user is completing the process
      setTimeout(() => {
        setIsConnecting(false);
      }, 5000);
    }
  };

  const storeWalletAddress = async (address: string) => {
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

  // Disconnect function to end the session
  const handleDisconnect = async () => {
    try {
      disconnectWallet();
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      console.error("Disconnect error:", error);
      toast({
        title: "Error",
        description: `Failed to disconnect wallet: ${error.message || String(error)}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          <Wallet className="h-4 w-4" />
          {connected ? "Connected" : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {connected ? "Wallet Connected" : "Connect your TON wallet"}
          </DialogTitle>
          <DialogDescription>
            {connected
              ? "Your wallet is connected to FIPT Shop"
              : "Connect your Tonkeeper wallet to log in or sign up"}
          </DialogDescription>
        </DialogHeader>
        
        {connected ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Wallet Address</p>
              <p className="text-xs text-muted-foreground break-all">
                {address}
              </p>
              
              {telegramUser && (
                <div className="mt-2 pt-2 border-t border-muted-foreground/10">
                  <p className="text-sm font-medium">Linked to Telegram</p>
                  <p className="text-xs text-muted-foreground">
                    @{telegramUser.username || telegramUser.first_name}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              <img
                src="https://tonkeeper.com/assets/tonconnect-icon.png"
                alt="Tonkeeper"
                className="h-5 w-5"
              />
              {isConnecting ? "Connecting..." : "Tonkeeper"}
            </Button>
            
            {telegramUser && (
              <div className="p-2 bg-muted rounded-md text-xs text-muted-foreground">
                <p>Connecting will link your wallet to your Telegram account:</p>
                <p className="font-medium mt-1">@{telegramUser.username || telegramUser.first_name}</p>
              </div>
            )}
            
            {/* Debug info */}
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
              <p className="font-medium">Debug Info:</p>
              <p className="break-all">{walletInfo}</p>
              <p className="font-medium mt-2">Available Wallets:</p>
              <p className="break-all">{available.length > 0 ? available.map(w => w.name).join(', ') : 'None found'}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
