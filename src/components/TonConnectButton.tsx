"use client"; // For Next.js App Router client-side rendering

import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui";
import { toast } from "@/hooks/use-toast";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { TelegramUser } from "@/types/telegram";
import { useWalletStorage } from "@/hooks/useWalletStorage";
import { useWalletDialog } from "@/hooks/useWalletDialog";
import WalletDialogContent from "@/components/wallet/WalletDialogContent";

const TonConnectButton: React.FC = () => {
  const { connectWallet, disconnectWallet, connected, address, wallet, available, isMobile, isConnecting, isTelegramMiniApp } = useTonkeeperWallet();
  const { storeWalletAddress } = useWalletStorage();
  const [walletInfo, setWalletInfo] = useState<string>("No wallet info available");
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isTonkeeperBrowser, setIsTonkeeperBrowser] = useState(false);
  
  const { 
    dialogOpen, 
    setDialogOpen, 
    connectionAttempted, 
    setConnectionAttempted 
  } = useWalletDialog(connected, isConnecting, isMobile, isTelegramMiniApp);

  useEffect(() => {
    // Check if we're inside Tonkeeper browser
    const checkTonkeeperBrowser = /Tonkeeper/i.test(navigator.userAgent);
    setIsTonkeeperBrowser(checkTonkeeperBrowser);
    
    if (wallet) {
      const info = `Wallet initialized: ${!!wallet}, Connected: ${connected}, Address: ${address}, Available wallets: ${available ? available.length : 0}, Mobile: ${isMobile}, TG Mini App: ${isTelegramMiniApp}, Tonkeeper Browser: ${checkTonkeeperBrowser}`;
      console.log(info);
      setWalletInfo(info);
    }
    
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        setTelegramUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, [wallet, connected, address, available, isMobile, isTelegramMiniApp]);

  useEffect(() => {
    if (connected && address) {
      console.log("Wallet connected, storing address:", address);
      storeWalletAddress(address, telegramUser);
      
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected",
      });
      
      setDialogOpen(false);
      setConnectionAttempted(false);
    }
  }, [connected, address, storeWalletAddress, telegramUser, setDialogOpen, setConnectionAttempted]);

  const handleConnect = async () => {
    try {
      console.log("Attempting to connect wallet from button...");
      setConnectionAttempted(true);
      
      // Make sure to handle the case when no wallets are available in Telegram Mini App
      if ((!available || available.length === 0) && !isTelegramMiniApp) {
        toast({
          title: "No wallets available",
          description: "No compatible wallets found. Please install Tonkeeper.",
          variant: "destructive"
        });
        return;
      }
      
      // Even with no wallets, if in Telegram Mini App, we'll try to open Tonkeeper
      if (available && available.length > 0) {
        console.log("Available wallets:", available.map(w => w.name).join(', '));
      } else if (isTelegramMiniApp) {
        console.log("No wallets available, but in Telegram Mini App. Will try direct connection.");
      }
      
      if (isTonkeeperBrowser) {
        toast({
          title: "Connecting to Tonkeeper",
          description: "Using in-app connection. Please approve the request.",
        });
      } else if (isMobile || isTelegramMiniApp) {
        toast({
          title: "Opening Tonkeeper",
          description: "Opening Tonkeeper wallet. Please approve the connection request.",
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
      setConnectionAttempted(false);
      toast({
        title: "Connection error",
        description: `Failed to connect to wallet: ${error.message || String(error)}`,
        variant: "destructive"
      });
    }
  };

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

  // If we're inside Tonkeeper browser and not connected, auto-connect
  useEffect(() => {
    if (isTonkeeperBrowser && !connected && !isConnecting && available && available.length > 0) {
      console.log("Auto-connecting in Tonkeeper browser");
      handleConnect();
    }
  }, [isTonkeeperBrowser, connected, isConnecting, available]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          <Wallet className="h-4 w-4" />
          {connected ? "Connected" : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <WalletDialogContent
          connected={connected}
          isConnecting={isConnecting}
          address={address}
          telegramUser={telegramUser}
          walletInfo={walletInfo}
          available={available || []}
          isMobile={isMobile}
          isTelegramMiniApp={isTelegramMiniApp}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
