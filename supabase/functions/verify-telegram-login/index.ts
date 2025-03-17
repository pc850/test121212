
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as crypto from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Set the Telegram bot token directly - for Chicktok_bot (https://t.me/Chicktok_bot)
const TELEGRAM_BOT_TOKEN = "7622575103:AAFNq5Vtl6pPFy0Yyxmi1SzWnaLgcNq8RVo";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received verification request");
    const { telegramData } = await req.json();
    
    if (!telegramData) {
      console.log("Missing telegram data");
      return new Response(
        JSON.stringify({ error: "Missing telegram data" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log("Received Telegram data type:", typeof telegramData);
    console.log("Telegram data fields:", Object.keys(telegramData));
    
    // Special case for WebApp auto-login
    if (telegramData.hash && telegramData.hash.includes('web_app_data')) {
      console.log('WebApp auto-login detected, bypassing verification');
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: "WebApp login data accepted",
          user: telegramData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Get the Telegram bot token 
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is not available");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Extract the hash from the data
    const { hash, ...userData } = telegramData;
    
    // Create a validation hash from the data
    const dataCheckString = Object.keys(userData)
      .sort()
      .map(key => `${key}=${userData[key]}`)
      .join('\n');
    
    console.log("Data check string:", dataCheckString);
    
    // Create a secret key using the bot token
    const secretKey = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(TELEGRAM_BOT_TOKEN)
    );
    
    // Create an HMAC using the secret key
    const hmac = await crypto.subtle.importKey(
      "raw",
      secretKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign(
      "HMAC",
      hmac,
      new TextEncoder().encode(dataCheckString)
    );
    
    // Convert the signature to a hex string
    const hashHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("Calculated hash:", hashHex);
    console.log("Provided hash:", hash);
    
    // Check if the hash matches the provided hash
    const isValid = hashHex === hash;
    
    // Check if the auth_date is not too old (within the last day)
    const isRecent = (Date.now() / 1000) - userData.auth_date < 86400;
    
    console.log("Validation result:", { isValid, isRecent });
    
    if (isValid && isRecent) {
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: "Telegram login data is valid",
          user: userData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: isValid ? "Login expired, please try again" : "Invalid login data"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
