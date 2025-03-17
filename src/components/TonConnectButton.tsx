
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
import { useTonConnect } from "@/hooks/useTonConnect";

const TonConnectButton: React.FC = () => {
  const { 
    isConnecting,
    isConnected, 
    walletAddress, 
    provider,
    mockConnect, 
    connectToWallet,
    connectToTonkeeper,
    disconnect,
    wallets
  } = useTonConnect();
  
  // Track whether we're in development mode and should allow mock connections
  const [useMockConnection, setUseMockConnection] = useState(false);

  const handleConnect = async (walletId: string) => {
    let address;
    
    // Use real wallet connection if not in development mode
    if (!useMockConnection) {
      address = await connectToWallet(walletId);
    } else {
      // Fallback to mock connection for development
      address = await mockConnect(walletId);
    }
    
    if (address) {
      toast({
        title: `Connected to ${walletId}`,
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
            {/* Display available wallets from the SDK */}
            {wallets.length > 0 ? (
              wallets.map((wallet) => (
                <Button 
                  key={wallet.id}
                  variant="outline" 
                  className="justify-start gap-2" 
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                >
                  {wallet.imageUrl ? (
                    <img src={wallet.imageUrl} alt={wallet.name} className="h-5 w-5" />
                  ) : (
                    <Link className="h-5 w-5" />
                  )}
                  {wallet.name}
                </Button>
              ))
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="justify-start gap-2" 
                  onClick={() => handleConnect("tonkeeper")}
                  disabled={isConnecting}
                >
                  <img src="https://tonkeeper.com/assets/tonconnect-icon.png" alt="Tonkeeper" className="h-5 w-5" />
                  Tonkeeper
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start gap-2"
                  onClick={() => handleConnect("tonhub")}
                  disabled={isConnecting}
                >
                  <img src="https://ton.org/download/ton_symbol.svg" alt="TonHub" className="h-5 w-5" />
                  TonHub
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start gap-2"
                  onClick={() => handleConnect("openmask")}
                  disabled={isConnecting}
                >
                  <Link className="h-5 w-5" />
                  OpenMask
                </Button>
              </>
            )}
            
            {/* Development mode toggle */}
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="text-xs text-muted-foreground">Development Mode</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setUseMockConnection(!useMockConnection)}
                className={`text-xs ${useMockConnection ? 'text-green-500' : 'text-muted-foreground'}`}
              >
                {useMockConnection ? 'Enabled (Mock)' : 'Disabled (Real)'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
