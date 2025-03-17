
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { useSwapForm } from "@/hooks/useSwapForm";
import TokenField from "@/components/swap/TokenField";
import ExchangeRateInfo from "@/components/swap/ExchangeRateInfo";
import SlippageSelector from "@/components/swap/SlippageSelector";
import SwapButton from "@/components/swap/SwapButton";
import TransactionDetails from "@/components/swap/TransactionDetails";
import TonConnectButton from "@/components/TonConnectButton";

const SwapPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "FIPT - Swap";
  }, []);

  // Connect to wallet
  const { connected, address } = useTonkeeperWallet();

  // Swap form state and handlers
  const {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    fromAmount,
    toAmount,
    slippage,
    setSlippage,
    isLoading,
    isCalculating,
    priceImpact,
    tokens,
    exchangeRate,
    fromTokenData,
    toTokenData,
    handleSwapPositions,
    handleFromAmountChange,
    handleToAmountChange,
    handleSubmit
  } = useSwapForm(address);

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Page Header */}
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-fipt-dark">Swap</h1>
          <p className="text-sm text-fipt-muted">Exchange tokens seamlessly on Tonswap DEX</p>
        </div>
        <TonConnectButton />
      </div>
      
      {/* Swap Container */}
      <div className="flex-1 px-4 py-6">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 mb-4">
          {/* From Token */}
          <TokenField
            label="From"
            tokenValue={fromToken}
            onTokenChange={setFromToken}
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            tokens={tokens}
            excludeTokenId={toToken}
            tokenData={fromTokenData}
            disabled={isLoading}
            showMaxButton={true}
            onMaxClick={() => {
              const bal = fromTokenData?.balance.toString() || "0";
              handleFromAmountChange(bal);
            }}
          />
          
          {/* Swap Direction Button */}
          <div className="flex justify-center my-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-2 border-gray-200"
              onClick={handleSwapPositions}
              disabled={isLoading || isCalculating}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* To Token */}
          <TokenField
            label="To"
            tokenValue={toToken}
            onTokenChange={setToToken}
            amount={toAmount}
            onAmountChange={handleToAmountChange}
            tokens={tokens}
            excludeTokenId={fromToken}
            tokenData={toTokenData}
            isCalculating={isCalculating}
            disabled={isLoading || isCalculating}
          />
          
          {/* Exchange Rate */}
          <ExchangeRateInfo
            exchangeRate={exchangeRate}
            fromToken={fromTokenData}
            toToken={toTokenData}
          />
          
          {/* Slippage Settings */}
          <SlippageSelector
            value={slippage}
            onChange={setSlippage}
            options={["0.5", "1", "2"]}
            disabled={isLoading}
          />
          
          <Separator className="my-4" />
          
          {/* Swap Button */}
          <SwapButton
            isLoading={isLoading}
            connected={connected}
            fromAmount={fromAmount}
            toAmount={toAmount}
            onClick={handleSubmit}
          />
        </div>
        
        {/* Transaction Details */}
        <TransactionDetails
          toAmount={toAmount}
          slippage={slippage}
          toToken={toTokenData}
          priceImpact={priceImpact}
        />

        {/* Wallet connection notice */}
        {!connected && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p className="font-medium">Connect your TON wallet to start swapping</p>
            <p className="mt-1">Click the "Connect Wallet" button in the top-right corner to connect your Tonkeeper wallet and access the Tonswap DEX.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapPage;
