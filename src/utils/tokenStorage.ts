/**
 * tokenStorage.ts — Secure token management singleton.
 *
 * The backend issues only an access token (no refresh token).
 * We persist the access token in localStorage so the user remains
 * logged in across page refreshes, tab restarts, and browser restarts.
 *
 * The token is automatically cleared on explicit logout, or when it expires.
 */

const ACCESS_TOKEN_KEY = "auditinsight.accessToken";

class TokenStorage {
  private accessToken: string | null = null;

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  setTokens(accessToken: string): void {
    this.accessToken = accessToken;
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      } catch {
        // Ignore storage exceptions in privacy-restricted environments.
      }
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken !== null) {
      return this.accessToken;
    }

    if (this.isBrowser()) {
      try {
        const stored = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (stored) {
          this.accessToken = stored;
          return stored;
        }
      } catch {
        return null;
      }
    }

    return null;
  }

  // No-op kept for call-site compatibility — backend has no refresh token
  getRefreshToken(): string | null {
    return null;
  }

  updateAccessToken(accessToken: string): void {
    this.setTokens(accessToken);
  }

  clear(): void {
    this.accessToken = null;
    if (this.isBrowser()) {
      try {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      } catch {
        // Ignore storage exceptions.
      }
    }
  }

  hasSession(): boolean {
    return this.getAccessToken() !== null;
  }
}

export const tokenStorage = new TokenStorage();


