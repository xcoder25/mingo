// --- CLIENT-SIDE CONFIG ---
// These values are prefixed with NEXT_PUBLIC_ and are safe to be exposed to the client.
export const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;
export const FLW_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_FLW_ENCRYPTION_KEY;


// --- SERVER-SIDE CONFIG (for verification if needed later) ---
export const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
export const FLW_SECRET_HASH = process.env.FLW_SECRET_HASH;


// Warning for missing configuration
if (!FLW_PUBLIC_KEY) {
    console.warn("Flutterwave public key is not configured. Please check your .env file.");
}
