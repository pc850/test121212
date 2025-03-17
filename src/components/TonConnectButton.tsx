import React from "react";
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
import { useTonConnect } from "@/hooks/useTonConnect";

const TonConnectButton: React.FC = () => {
  const { 
    isConnecting,
    isConnected, 
    walletAddress, 
    provider,
    mockConnect, 
    connectToTonkeeper,
    disconnect 
  } = useTonConnect();

  const handleConnect = async (walletType: string) => {
    let address;
    
    if (walletType === "Tonkeeper") {
      address = await connectToTonkeeper();
    } else {
      address = await mockConnect(walletType);
    }
    
    if (address) {
      toast({
        title: `Connected to ${walletType}`,
        description: `Wallet address: ${address}`,
      });
    } else {
      toast({
        title: "Connection failed",
        description: "Could not connect to wallet",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
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
              ? `Your wallet is connected to FIPT Shop (${provider || "Unknown"})`
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
              onClick={handleDisconnect}
              disabled={isConnecting}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <Button 
              variant="outline" 
              className="justify-start gap-2" 
              onClick={() => handleConnect("Tonkeeper")}
              disabled={isConnecting}
            >
              <img src="https://tonkeeper.com/assets/tonconnect-icon.png" alt="Tonkeeper" className="h-5 w-5" />
              Tonkeeper
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => handleConnect("TonHub")}
              disabled={isConnecting}
            >
              <img src="https://ton.org/download/ton_symbol.svg" alt="TonHub" className="h-5 w-5" />
              TonHub
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={() => handleConnect("OpenMask")}
              disabled={isConnecting}
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
