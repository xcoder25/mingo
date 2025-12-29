const isProd = process.env.NODE_ENV === 'production';

// URLs
const SANDBOX_AUTH_URL = 'https://idp-sandbox.flutterwave.com/oauth2/token';
const PROD_AUTH_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
const API_URL = 'https://api.flutterwave.com/v3';

// --- SERVER-SIDE CONFIG ---
// These values are only accessible on the server.
export const FLW_AUTH_URL = isProd ? PROD_AUTH_URL : SANDBOX_AUTH_URL;
export const FLW_API_URL = API_URL;

export const FLW_CLIENT_ID = isProd
  ? process.env.FLW_PROD_CLIENT_ID
  : process.env.FLW_SANDBOX_CLIENT_ID;

export const FLW_CLIENT_SECRET = isProd
  ? process.env.FLW_PROD_CLIENT_SECRET
  : process.env.FLW_SANDBOX_CLIENT_SECRET;


// --- CLIENT-SIDE CONFIG ---
// These values are prefixed with NEXT_PUBLIC_ and are safe to be exposed to the client.
export const FLW_PUBLIC_ENCRYPTION_KEY = isProd
  ? process.env.NEXT_PUBLIC_FLW_PROD_ENCRYPTION_KEY
  : process.env.NEXT_PUBLIC_FLW_SANDBOX_ENCRYPTION_KEY;

// Warning for missing configuration
if (!FLW_CLIENT_ID || !FLW_CLIENT_SECRET || !FLW_PUBLIC_ENCRYPTION_KEY) {
    console.warn("Flutterwave credentials are not fully configured. Please check your .env file.");
}
