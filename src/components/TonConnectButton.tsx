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

// Initialize TonConnect with your manifest URL
const tonConnect = new TonConnect({
  manifestUrl: "https://your-site.com/tonconnect-manifest.json",
});

const TonConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Connect function that triggers Tonkeeper via TonConnect
  const connectWallet = async () => {
    try {
      // If you want to limit the connection to Tonkeeper, pass an array with one wallet connection source.
      // Replace "tonkeeper" with the appropriate id if needed (refer to your SDK docs).
      const wallets = await tonConnect.connect([{ id: "tonkeeper" }]);
      if (wallets && wallets.length > 0) {
        const address = wallets[0].account.address;
        setWalletAddress(address);
        setIsConnected(true);
        toast({
          title: "Connected to Tonkeeper",
          description: `Wallet address: ${address}`,
        });
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
