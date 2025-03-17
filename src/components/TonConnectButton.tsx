"use client"; // For Next.js App Router client-side rendering

import React, { useState } from "react";
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

// Import TonConnect SDK
import { TonConnect } from "@tonconnect/sdk";
// Import Supabase client
import { supabase } from "@/integrations/supabase/client";

// Initialize TonConnect with your manifest URL (ensure the manifest file exists and is accessible)
const tonConnect = new TonConnect({
  manifestUrl: "https://fipt-wonderland.lovable.app/tonconnect-manifest.json",
});

const TonConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Connect function to trigger Tonkeeper via TonConnect
  const connectWallet = async () => {
    try {
      // Connect only to Tonkeeper
      const wallets = await tonConnect.connect([{ bridgeUrl: 'https://bridge.tonapi.io/bridge' }]);
      if (wallets && typeof wallets === 'object') {
        const address = wallets.toString();

        // Update local state
        setWalletAddress(address);
        setIsConnected(true);

        toast({
          title: "Connected to Tonkeeper",
          description: `Wallet address: ${address}`,
        });

        // Insert wallet address into Supabase (adjust table/column names as needed)
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
          console.log("Wallet address stored in Supabase");
        }
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection error",
        description: `Failed to connect to wallet: ${error.message || error}`,
      });
    }
  };

  // Disconnect function to end the session
  const disconnect = async () => {
    try {
      await tonConnect.disconnect();
      setIsConnected(false);
      setWalletAddress("");

      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      console.error("Disconnect error:", error);
      toast({
        title: "Error",
        description: `Failed to disconnect wallet: ${error.message || error}`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          <Wallet className="h-4 w-4" />
          {isConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isConnected ? "Wallet Connected" : "Connect your TON wallet"}
          </DialogTitle>
          <DialogDescription>
            {isConnected
              ? "Your wallet is connected to FIPT Shop"
              : "Connect your Tonkeeper wallet to log in or sign up"}
          </DialogDescription>
        </DialogHeader>
        
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Wallet Address</p>
              <p className="text-xs text-muted-foreground break-all">
                {walletAddress}
              </p>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={disconnect}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={connectWallet}
            >
              <img
                src="https://tonkeeper.com/assets/tonconnect-icon.png"
                alt="Tonkeeper"
                className="h-5 w-5"
              />
              Tonkeeper
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
