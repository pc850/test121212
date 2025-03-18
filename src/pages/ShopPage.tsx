
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
      name: "TEST Red Hoodie", 
      price: 49999,
      description: "Comfortable red hoodie with TEST branding and signature pattern",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=774&auto=format&fit=crop"
    },
    {
      id: 2, 
      name: "TEST Classic Hoodie", 
      price: 49999,
      description: "Classic red hoodie with bold TEST logo on front",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=772&auto=format&fit=crop"
    },
    {
      id: 3, 
      name: "TEST White Tee - Blue", 
      price: 24999,
      description: "Premium white cotton t-shirt with blue TEST logo",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=774&auto=format&fit=crop"
    },
    {
      id: 4, 
      name: "TEST White Tee - Black", 
      price: 24999,
      description: "Premium white cotton t-shirt with black TEST logo",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=774&auto=format&fit=crop"
    },
    {
      id: 5, 
      name: "TEST Sport Set", 
      price: 59999,
      description: "Two-piece workout set with crop top and shorts in blue and pink",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1740&auto=format&fit=crop"
    },
    {
      id: 6, 
      name: "TEST Black Hoodie", 
      price: 49999,
      description: "Sleek black hoodie with minimalist TEST logo, perfect for urban style",
      image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=1374&auto=format&fit=crop"
    }
  ];

  const formatTestPrice = (price: number) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return price.toString();
  };

  const formatUsdPrice = (testPrice: number) => {
    const usdPrice = (testPrice * 0.0001).toFixed(2);
    return `$${usdPrice}`;
  };

  return (
    <div className="container py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">TEST Shop</h1>
          <p className="text-muted-foreground">Official TEST merchandise</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-fipt-blue text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartItems}
            </span>
          </Button>
        </div>
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
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg h-8 truncate">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-3 overflow-hidden rounded-md">
                    <AspectRatio ratio={1} className="h-48">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="object-contain w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 h-10 line-clamp-2">{item.description}</p>
                  <p className="flex items-center gap-2">
                    <span className="text-fipt-blue text-sm font-semibold">{formatTestPrice(item.price)} $TEST</span>
                    <span className="text-xs text-muted-foreground">({formatUsdPrice(item.price)} USD)</span>
                  </p>
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
                Get exclusive access to premium TEST content and merchandise with our membership options.
              </p>
              <div className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="flex items-center gap-2">
                    <span className="text-fipt-blue text-sm font-semibold">9.9k $TEST</span>
                    <span className="text-xs text-muted-foreground">($1.00 USD)</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Full access to all premium features</p>
                  <Button className="mt-2 w-full">Subscribe</Button>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="flex items-center gap-2">
                    <span className="text-fipt-blue text-sm font-semibold">99.9k $TEST</span>
                    <span className="text-xs text-muted-foreground">($10.00 USD)</span>
                  </h3>
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
