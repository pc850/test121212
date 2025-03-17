
/**
 * Finds the Tonkeeper wallet in the list of available wallets
 */
export const findTonkeeperWallet = (available: any[]) => {
  const tonkeeper = available.find(w => 
    w.name.toLowerCase().includes('tonkeeper') || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );
  
  if (!tonkeeper) {
    console.error("Tonkeeper wallet not found in available wallets");
  } else {
    console.log("Found Tonkeeper wallet:", tonkeeper);
  }
  
  return tonkeeper;
};
