
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock } from "lucide-react";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { saveUserToLocalStorage, getUserFromLocalStorage, verifyTelegramLogin, saveUserToSupabase } from "@/utils/telegramAuthUtils";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { autoLogin } = useTelegramAuth();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Try auto login with Telegram first
      const telegramUser = await autoLogin();
      if (telegramUser) {
        setIsAuthenticated(true);
        return;
      }

      // Check if telegram user exists in localStorage
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        // Verify the stored user
        const isValid = await verifyTelegramLogin(storedUser);
        if (isValid) {
          setIsAuthenticated(true);
          return;
        }
      }

      // Check if supabase session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [autoLogin]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/earn" />;
  }

  const handleTelegramAuth = async (user: TelegramUser) => {
    try {
      // Verify the Telegram user data
      const isValid = await verifyTelegramLogin(user);
      
      if (!isValid) {
        toast({
          title: "Authentication failed",
          description: "Telegram verification failed. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Save user data to Supabase
      const saved = await saveUserToSupabase(user);
      if (!saved) {
        toast({
          title: "Authentication failed",
          description: "Failed to save user data. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Save to localStorage for persistence
      saveUserToLocalStorage(user);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${user.first_name}!`,
      });
      
      navigate('/earn');
    } catch (error) {
      console.error('Telegram auth error:', error);
      toast({
        title: "Authentication failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
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
      
      navigate('/earn');
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fipt-blue">Welcome to FIPT</h1>
          <p className="mt-2 text-gray-600">Sign in or create an account to continue</p>
        </div>

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
    </div>
  );
};

export default AuthPage;
