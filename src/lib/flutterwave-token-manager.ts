
import { FLW_AUTH_URL, FLW_CLIENT_ID, FLW_CLIENT_SECRET } from './flutterwave-config';

interface Token {
  value: string | null;
  expiresAt: number | null;
}

// In-memory cache for the token
const token: Token = {
  value: null,
  expiresAt: null,
};

class TokenManager {
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  private async refreshToken(): Promise<string | null> {
    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        if (!FLW_CLIENT_ID || !FLW_CLIENT_SECRET) {
          throw new Error('Flutterwave client ID or secret is not configured.');
        }
        
        const response = await fetch(FLW_AUTH_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'client_id': FLW_CLIENT_ID,
            'client_secret': FLW_CLIENT_SECRET,
            'grant_type': 'client_credentials',
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.access_token) {
          console.error('Flutterwave token refresh failed:', data);
          throw new Error('Failed to get Flutterwave token');
        }
        
        token.value = data.access_token;
        // Set expiration time from 'expires_in' (in seconds)
        token.expiresAt = Date.now() + (data.expires_in * 1000);
        
        return token.value;

      } catch (error) {
        console.error('Error refreshing Flutterwave token:', error);
        token.value = null;
        token.expiresAt = null;
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();
    return this.refreshPromise;
  }

  public async getToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
        return this.refreshPromise;
    }
    
    // Refresh if token is null, or if it expires in the next 60 seconds
    if (!token.value || !token.expiresAt || (token.expiresAt - Date.now() < 60000)) {
      return this.refreshToken();
    }
    
    return token.value;
  }
}

export const tokenManager = new TokenManager();
