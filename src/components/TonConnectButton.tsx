
import React, { useState, useEffect } from "react";
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
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const TonConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Initialize WalletConnect
    const walletConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", 
      qrcodeModal: QRCodeModal,
    });

    // Set the connector
    setConnector(walletConnector);

    // Setup event listeners
    if (walletConnector) {
      // Check if already connected
      if (walletConnector.connected) {
        const { accounts } = walletConnector;
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }

      // Listen for connect events
      walletConnector.on("connect", (error, payload) => {
        if (error) {
          console.error("Connection error:", error);
          toast({
            title: "Connection Error",
            description: "Failed to connect to wallet",
            variant: "destructive"
          });
          return;
        }

        const { accounts } = payload.params[0];
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to wallet: ${accounts[0].substring(0, 8)}...`,
        });
      });

      // Listen for disconnect events
      walletConnector.on("disconnect", (error) => {
        if (error) {
          console.error("Disconnect error:", error);
        }
        setWalletAddress("");
        setIsConnected(false);
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      });
    }

    // Clean up event listeners on component unmount
    return () => {
      if (walletConnector) {
        walletConnector.off("connect");
        walletConnector.off("disconnect");
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!connector) {
      toast({
        title: "Connection Error",
        description: "WalletConnect not initialized",
        variant: "destructive"
      });
      return;
    }

    if (!connector.connected) {
      try {
        // Create a new session and show QR code
        await connector.createSession();
      } catch (error) {
        console.error("Failed to create session:", error);
        toast({
          title: "Connection Error",
          description: "Failed to create wallet session",
          variant: "destructive"
        });
      }
    } else {
      // Already connected, show the current connection
      toast({
        title: "Already Connected",
        description: `Connected to wallet: ${walletAddress.substring(0, 8)}...`,
      });
    }
  };

  const disconnect = () => {
    if (connector && connector.connected) {
      connector.killSession();
    }
    setIsConnected(false);
    setWalletAddress("");
    setOpen(false);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              onClick={connectWallet}
            >
              <img src="https://tonkeeper.com/assets/tonconnect-icon.png" alt="Tonkeeper" className="h-5 w-5" />
              Connect with Tonkeeper
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={connectWallet}
            >
              <img src="https://ton.org/download/ton_symbol.svg" alt="TonHub" className="h-5 w-5" />
              Connect with TonHub
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={connectWallet}
            >
              <Link className="h-5 w-5" />
              Connect with OpenMask
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TonConnectButton;
