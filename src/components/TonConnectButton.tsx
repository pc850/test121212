
import React, { useEffect, useState } from "react";
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
import { TonConnect, WalletInfoRemote } from '@tonconnect/sdk';

// Create a connector instance
const connector = new TonConnect();

const TonConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [availableWallets, setAvailableWallets] = useState<WalletInfoRemote[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize connector and load available wallets
  useEffect(() => {
    // Initialize connector with your app manifest (optional)
    connector.init({
      manifestUrl: 'https://fipt-app.com/tonconnect-manifest.json',
      connectButtonOptions: {
        // If walletNotFound is true, bridge wallet is added in the wallets list
        walletNotFound: true
      }
    });

    // Load available wallets
    const fetchWallets = async () => {
      try {
        const wallets = await connector.getWallets();
        setAvailableWallets(wallets);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    
    fetchWallets();

    // Listen for connection status changes
    const unsubscribe = connector.onStatusChange(wallet => {
      if (wallet) {
        // Format address
        const address = wallet.account.address;
        const formattedAddress = address.slice(0, 6) + '...' + address.slice(-6);
        
        setWalletAddress(formattedAddress);
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${wallet.device.appName || 'wallet'}`,
        });
      } else {
        setWalletAddress("");
        setIsConnected(false);
      }
    });

    // Check if already connected
    const walletState = connector.wallet;
    if (walletState) {
      const address = walletState.account.address;
      const formattedAddress = address.slice(0, 6) + '...' + address.slice(-6);
      setWalletAddress(formattedAddress);
      setIsConnected(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const connectWallet = async (walletApp: WalletInfoRemote) => {
    try {
      await connector.connect({ walletApp });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnect = () => {
    connector.disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            {availableWallets.length > 0 ? (
              availableWallets.map((wallet) => (
                <Button 
                  key={wallet.name}
                  variant="outline" 
                  className="justify-start gap-2"
                  onClick={() => connectWallet(wallet)}
                >
                  {wallet.imageUrl && (
                    <img src={wallet.imageUrl} alt={wallet.name} className="h-5 w-5" />
                  )}
                  {!wallet.imageUrl && <Link className="h-5 w-5" />}
                  {wallet.name}
                </Button>
              ))
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="justify-start gap-2" 
                  onClick={() => toast({
                    title: "Wallet not available",
                    description: "Please install a TON wallet to connect",
                  })}
                >
                  <img src="https://tonkeeper.com/assets/tonconnect-icon.png" alt="Tonkeeper" className="h-5 w-5" />
                  Tonkeeper
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start gap-2"
                  onClick={() => toast({
                    title: "Wallet not available",
                    description: "Please install a TON wallet to connect",
                  })}
                >
                  <img src="https://ton.org/download/ton_symbol.svg" alt="TonHub" className="h-5 w-5" />
                  TonHub
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
