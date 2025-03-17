
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TonConnectButton from "@/components/TonConnectButton";

const Index = () => {
  return (
    <div className="container py-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">FIPT App</h1>
          <p className="text-muted-foreground">Earn & Shop with FIPT tokens</p>
        </div>
        <TonConnectButton />
      </header>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome to FIPT</CardTitle>
          <CardDescription>Your gateway to the TON ecosystem</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Connect your TON wallet to start earning and shopping with FIPT tokens.</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link to="/earn">Earn FIPT</Link>
          </Button>
          <Button asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/earn" className="group">
          <Card className="h-full transition-all hover:border-primary group-hover:shadow-sm">
            <CardHeader>
              <CardTitle>Earn FIPT</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Complete tasks and watch ads to earn FIPT tokens.</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/shop" className="group">
          <Card className="h-full transition-all hover:border-primary group-hover:shadow-sm">
            <CardHeader>
              <CardTitle>FIPT Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Spend your FIPT tokens on exclusive merchandise and offers.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Index;
