
import React, { useState } from "react";
import { Wallet, Link } from "lucide-react";
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

const TonConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const mockConnect = (walletType: string) => {
    // This is a mock connection - in a real app, use a TON Connect SDK
    const mockAddress = "UQD......" + Math.random().toString(16).slice(2, 8);
    setWalletAddress(mockAddress);
    setIsConnected(true);
    toast({
      title: `Connected to ${walletType}`,
      description: `Wallet address: ${mockAddress}`,
    });
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
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
          <DialogTitle>{isConnected ? "Wallet Connected" : "Connect your TON wallet"}</DialogTitle>
          <DialogDescription>
            {isConnected 
              ? "Your wallet is connected to FIPT Shop"
              : "Choose your preferred TON wallet to connect"
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
              onClick={() => mockConnect("Tonkeeper")}
            >
              <img src="https://tonkeeper.com/assets/tonconnect-icon.png" alt="Tonkeeper" className="h-5 w-5" />
              Tonkeeper
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => mockConnect("TonHub")}
            >
              <img src="https://ton.org/download/ton_symbol.svg" alt="TonHub" className="h-5 w-5" />
              TonHub
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => mockConnect("OpenMask")}
            >
              <Link className="h-5 w-5" />
              OpenMask
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
