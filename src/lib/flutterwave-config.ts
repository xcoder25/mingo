
const isProd = process.env.NODE_ENV === 'production';

// URLs
const SANDBOX_AUTH_URL = 'https://idp-sandbox.flutterwave.com/oauth2/token';
const SANDBOX_API_URL = 'https://api.flutterwave.com/v3';
const PROD_AUTH_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
const PROD_API_URL = 'https://api.flutterwave.com/v3';

export const FLW_AUTH_URL = isProd ? PROD_AUTH_URL : SANDBOX_AUTH_URL;
export const FLW_API_URL = isProd ? PROD_API_URL : SANDBOX_API_URL;

// Credentials
export const FLW_CLIENT_ID = isProd
  ? process.env.FLW_PROD_CLIENT_ID
  : process.env.FLW_SANDBOX_CLIENT_ID;

export const FLW_CLIENT_SECRET = isProd
  ? process.env.FLW_PROD_CLIENT_SECRET
  : process.env.FLW_SANDBOX_CLIENT_SECRET;

// Public Encryption Key (safe for client-side use)
export const FLW_ENCRYPTION_KEY = isProd
  ? process.env.NEXT_PUBLIC_FLW_PROD_ENCRYPTION_KEY
  : process.env.NEXT_PUBLIC_FLW_SANDBOX_ENCRYPTION_KEY;

if (!FLW_CLIENT_ID || !FLW_CLIENT_SECRET || !FLW_ENCRYPTION_KEY) {
    if (isProd) {
        console.warn("Flutterwave production credentials are not fully configured. Please check your environment variables.");
    } else {
        console.warn("Flutterwave sandbox credentials are not fully configured. Please check your environment variables.");
    }
}
