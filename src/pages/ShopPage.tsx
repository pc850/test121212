
import React, { useState } from "react";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const ShopPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<number>(0);

  const addToCart = (product: string) => {
    setCartItems(cartItems + 1);
    toast({
      title: "Added to cart",
      description: `${product} has been added to your cart`,
    });
  };

  const merchandiseItems = [
    {
      id: 1, 
      name: "FIPT Hoodie - Signature Pattern", 
      price: "$49.99",
      description: "Comfortable red hoodie with FIPT branding and signature pattern",
      image: "/lovable-uploads/d46305d6-1a9a-40ff-a23f-d089f1f82ff9.png"
    },
    {
      id: 2, 
      name: "FIPT Classic Hoodie", 
      price: "$49.99",
      description: "Classic red hoodie with bold FIPT logo on front",
      image: "/lovable-uploads/4648ba41-cc11-4400-9f60-cd7ddbe64569.png"
    },
    {
      id: 3, 
      name: "FIPT White T-Shirt - Blue Logo", 
      price: "$24.99",
      description: "Premium white cotton t-shirt with blue FIPT logo",
      image: "/lovable-uploads/7cb7440e-1c67-40ef-a80e-80673f441b31.png"
    },
    {
      id: 4, 
      name: "FIPT White T-Shirt - Black Logo", 
      price: "$24.99",
      description: "Premium white cotton t-shirt with black FIPT logo",
      image: "/lovable-uploads/6fdbbf6c-66d7-4f35-99d5-88aa55da77ad.png"
    },
    {
      id: 5, 
      name: "FIPT Sportswear Set - Blue & Pink", 
      price: "$59.99",
      description: "Two-piece workout set with crop top and shorts in blue and pink",
      image: "/lovable-uploads/0edb97c4-4ed5-48bd-b939-bc687505eaa8.png"
    }
  ];

  return (
    <div className="container py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FIPT Shop</h1>
          <p className="text-muted-foreground">Official FIPT merchandise</p>
        </div>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-fipt-blue text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {cartItems}
          </span>
        </Button>
      </header>

      <Tabs defaultValue="merchandise">
        <TabsList>
          <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="merchandise" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchandiseItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="font-bold">{item.price}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => addToCart(item.name)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="premium" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Premium Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get exclusive access to premium FIPT content and merchandise with our membership options.
              </p>
              <div className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold">Monthly - $9.99</h3>
                  <p className="text-sm text-muted-foreground">Full access to all premium features</p>
                  <Button className="mt-2 w-full">Subscribe</Button>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-bold">Yearly - $99.99</h3>
                  <p className="text-sm text-muted-foreground">Save over 15% with yearly membership</p>
                  <Button className="mt-2 w-full">Subscribe</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopPage;
