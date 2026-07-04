/**
 * tokenStorage.ts — Secure token management singleton.
 *
 * The backend issues only an access token (no refresh token).
 * We store it in-memory only — invisible to XSS scripts reading
 * localStorage. The trade-off is the token is lost on page refresh,
 * which means the user must log in again after a hard refresh.
 * This is acceptable until the backend adds refresh token support.
 */

class TokenStorage {
  private accessToken: string | null = null;

  setTokens(accessToken: string): void {
    this.accessToken = accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // No-op kept for call-site compatibility — backend has no refresh token
  getRefreshToken(): string | null {
    return null;
  }

  updateAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  clear(): void {
    this.accessToken = null;
  }

  hasSession(): boolean {
    return this.accessToken !== null;
  }
}

export const tokenStorage = new TokenStorage();
