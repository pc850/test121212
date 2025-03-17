
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the FIPT balance for a wallet address from Supabase
 */
export const getFiptBalance = async (walletAddress: string | null): Promise<number> => {
  if (!walletAddress) return 0;
  
  try {
    console.log("Getting FIPT balance for wallet", walletAddress);
    const { data, error } = await supabase
      .from("wallet_balances")
      .select("fipt_balance")
      .eq("wallet_address", walletAddress)
      .single();
    
    if (error) {
      console.error("Error fetching FIPT balance:", error);
      return 0;
    }
    
    return data?.fipt_balance || 0;
  } catch (error) {
    console.error("Error in getFiptBalance:", error);
    return 0;
  }
};

/**
 * Update the FIPT balance for a wallet address in Supabase
 * Returns the new balance
 */
export const updateFiptBalance = async (
  walletAddress: string | null, 
  amount: number, 
  isIncrement = true
): Promise<number> => {
  if (!walletAddress) return 0;
  
  try {
    console.log(`${isIncrement ? 'Adding' : 'Setting'} ${amount} FIPT for wallet`, walletAddress);
    
    // First check if the wallet already has a record
    const { data: existingData } = await supabase
      .from("wallet_balances")
      .select("fipt_balance")
      .eq("wallet_address", walletAddress)
      .single();
    
    let newBalance = 0;
    
    if (existingData) {
      // Update existing record
      newBalance = isIncrement 
        ? existingData.fipt_balance + amount 
        : amount;
      
      const { error } = await supabase
        .from("wallet_balances")
        .update({ 
          fipt_balance: newBalance,
          last_updated: new Date().toISOString()
        })
        .eq("wallet_address", walletAddress);
      
      if (error) {
        console.error("Error updating FIPT balance:", error);
        return existingData.fipt_balance;
      }
    } else {
      // Insert new record
      newBalance = isIncrement ? amount : amount;
      
      const { error } = await supabase
        .from("wallet_balances")
        .insert({
          wallet_address: walletAddress,
          fipt_balance: newBalance
        });
      
      if (error) {
        console.error("Error inserting new FIPT balance:", error);
        return 0;
      }
    }
    
    return newBalance;
  } catch (error) {
    console.error("Error in updateFiptBalance:", error);
    return 0;
  }
};

/**
 * Get top wallets by FIPT balance for leaderboard
 */
export const getTopWallets = async (limit = 10): Promise<Array<{wallet_address: string, fipt_balance: number}>> => {
  try {
    const { data, error } = await supabase
      .from("wallet_balances")
      .select("wallet_address, fipt_balance")
      .order("fipt_balance", { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching top wallets:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getTopWallets:", error);
    return [];
  }
};
