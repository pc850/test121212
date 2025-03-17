
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock } from "lucide-react";

interface EmailLoginOptionsProps {
  onSuccess?: () => void;
}

const EmailLoginOptions = ({ onSuccess }: EmailLoginOptionsProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
  );
};

export default EmailLoginOptions;
