
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveUserToLocalStorage, getUserFromLocalStorage, verifyTelegramLogin, saveUserToSupabase } from "@/utils/telegramAuthUtils";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import TelegramLoginOptions from "@/components/auth/TelegramLoginOptions";
import EmailLoginOptions from "@/components/auth/EmailLoginOptions";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
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

  const handleLoginSuccess = () => {
    navigate('/earn');
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
            <TelegramLoginOptions onSuccess={handleTelegramAuth} />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailLoginOptions onSuccess={handleLoginSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
