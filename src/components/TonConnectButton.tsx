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

// Import Supabase client
import { supabase } from "@/integrations/supabase/client";

const TonConnectButton: React.FC = () => {
  const { connectWallet, disconnectWallet, connected, address, wallet } = useTonkeeperWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walletInfo, setWalletInfo] = useState<string>("No wallet info available");

  useEffect(() => {
    // Debug info
    if (wallet) {
      const info = `Wallet initialized: ${!!wallet}, Connected: ${connected}, Address: ${address}`;
      console.log(info);
      setWalletInfo(info);
    }
  }, [wallet, connected, address]);

  // Connect function to trigger Tonkeeper via TonConnect
  const handleConnect = async () => {
    try {
      console.log("Attempting to connect wallet from button...");
      setIsConnecting(true);
      
      await connectWallet();
      
      // The connection status might not update immediately, so we check after a short delay
      setTimeout(() => {
        console.log("Connection attempt completed, connected status:", connected, "address:", address);
        
        if (connected && address) {
          toast({
            title: "Connected to Wallet",
            description: `Wallet address: ${address}`,
          });

          // Store wallet address in Supabase
          storeWalletAddress(address);
        } else {
          toast({
            title: "Connection pending",
            description: "Please complete the connection in your wallet app",
          });
        }
      }, 2000);
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
            
            {/* Debug info - hidden in production */}
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
              <p className="font-medium">Debug Info:</p>
              <p className="break-all">{walletInfo}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
