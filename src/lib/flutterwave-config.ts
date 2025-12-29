
// URLs
const PROD_AUTH_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
const PROD_API_URL = 'https://api.flutterwave.com/v3';


// --- SERVER-SIDE CONFIG ---
// These values are only accessible on the server.
export const FLW_AUTH_URL = PROD_AUTH_URL;
export const FLW_API_URL = PROD_API_URL;

export const FLW_CLIENT_ID = process.env.FLW_CLIENT_ID;
export const FLW_CLIENT_SECRET = process.env.FLW_CLIENT_SECRET;


// --- CLIENT-SIDE CONFIG ---
// These values are prefixed with NEXT_PUBLIC_ and are safe to be exposed to the client.
export const FLW_PUBLIC_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_FLW_ENCRYPTION_KEY;

// Warning for missing configuration
if (!FLW_CLIENT_ID || !FLW_CLIENT_SECRET || !FLW_PUBLIC_ENCRYPTION_KEY) {
    console.warn("Flutterwave credentials are not fully configured. Please check your .env file.");
}
