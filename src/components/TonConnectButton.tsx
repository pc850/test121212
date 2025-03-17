
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

// Import TonConnect SDK with correct types
import { TonConnect, type Wallet as TonWallet } from "@tonconnect/sdk";

// Initialize TonConnect with the correct manifest URL
const tonConnect = new TonConnect({
  manifestUrl: "https://5bc3d506-2efc-40e2-9a59-c8a6ba10c04b.lovableproject.com/tonconnect-manifest.json",
});

const TonConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Setup TonConnect on component mount
  useEffect(() => {
    // Check if already connected
    const connectedWallet = tonConnect.wallet;
    if (connectedWallet) {
      setIsConnected(true);
      setWalletAddress(connectedWallet.account.address);
    }

    // Set up connection event listeners
    const unsubscribeConnection = tonConnect.onStatusChange((wallet) => {
      if (wallet) {
        setIsConnected(true);
        setWalletAddress(wallet.account.address);
        toast({
          title: "Connected to wallet",
          description: `Wallet connected successfully`,
        });
      } else {
        setIsConnected(false);
        setWalletAddress("");
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeConnection();
    };
  }, []);

  // Connect function that triggers wallet connection
  const connectWallet = async () => {
    try {
      // Get a list of available wallets
      const walletsList = tonConnect.getWallets();
      const universalLink = tonConnect.connect({
        universalLink: walletsList[0]?.universalLink,
        bridgeUrl: walletsList[0]?.bridgeUrl
      });
      
      if (universalLink) {
        window.open(universalLink, '_blank');
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection error",
        description: "Failed to connect to wallet",
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
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
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
              : "Connect your Tonkeeper wallet to log in or sign up"
            }
          </DialogDescription>
        </DialogHeader>
        
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Wallet Address</p>
              <p className="text-xs text-muted-foreground break-all">{walletAddress}</p>
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
