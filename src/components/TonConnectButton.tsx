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
import { useWalletStorage } from "@/hooks/useWalletStorage";
import WalletInfoDisplay from "@/components/wallet/WalletInfoDisplay";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

const TonConnectButton: React.FC = () => {
  const { connectWallet, disconnectWallet, connected, address, wallet, available, isMobile } = useTonkeeperWallet();
  const { storeWalletAddress } = useWalletStorage();
  const [isConnecting, setIsConnecting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walletInfo, setWalletInfo] = useState<string>("No wallet info available");
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Debug info
    if (wallet) {
      const info = `Wallet initialized: ${!!wallet}, Connected: ${connected}, Address: ${address}, Available wallets: ${available.length}, Mobile: ${isMobile}`;
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
  }, [wallet, connected, address, available, isMobile]);

  // When connection status changes, update local storage and Supabase if needed
  useEffect(() => {
    if (connected && address) {
      console.log("Wallet connected, storing address:", address);
      // Store wallet address in Supabase if user is logged in
      storeWalletAddress(address, telegramUser);
      
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected",
      });
      
      // Close dialog after successful connection
      setDialogOpen(false);
      setIsConnecting(false);
    }
  }, [connected, address, storeWalletAddress, telegramUser]);

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
        setIsConnecting(false);
        return;
      }
      
      // Display available wallets for debugging
      console.log("Available wallets:", available.map(w => w.name).join(', '));
      
      // On mobile devices, we'll close the dialog since we're redirecting to another app
      if (isMobile) {
        // Set a short timeout to allow the button click to be processed
        setTimeout(() => {
          setDialogOpen(false);
        }, 300);
        
        toast({
          title: "Opening Tonkeeper",
          description: "We're redirecting you to the Tonkeeper app. Please approve the connection and return to this app.",
        });
      } else {
        toast({
          title: "Connection initiated",
          description: "Please check your wallet app to approve the connection",
        });
      }
      
      await connectWallet();
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection error",
        description: `Failed to connect to wallet: ${error.message || String(error)}`,
        variant: "destructive"
      });
      setIsConnecting(false);
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
            <WalletInfoDisplay 
              address={address} 
              telegramUser={telegramUser} 
            />
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <WalletConnectButton
            isConnecting={isConnecting}
            telegramUser={telegramUser}
            walletInfo={walletInfo}
            available={available}
            onConnect={handleConnect}
            isMobile={isMobile}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
