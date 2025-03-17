
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock } from "lucide-react";

interface TelegramLoginOptionsProps {
  onSuccess?: () => void;
}

const TelegramLoginOptions = ({ onSuccess }: TelegramLoginOptionsProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTelegramAuth = (user: any) => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="telegram" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="telegram" className="flex justify-center">
          <TelegramLoginButton 
            botName="Chicktok_bot"
            onAuth={handleTelegramAuth}
            buttonSize="large"
            cornerRadius={8}
            className="my-2"
          />
        </TabsContent>
        
        <TabsContent value="email">
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <label htmlFor="email" className="text-sm font-medium">Email</label>
              </div>
              <Input
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                <label htmlFor="password" className="text-sm font-medium">Password</label>
              </div>
              <Input
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={handleEmailPasswordSignup}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelegramLoginOptions;
