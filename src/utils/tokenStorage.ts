/**
 * tokenStorage.ts — Secure token management singleton.
 *
 * The backend issues only an access token (no refresh token).
 * We persist the access token in sessionStorage so the user remains
 * logged in across page refreshes in the same browser tab.
 *
 * This is still scoped to the browser session and avoids long-lived
 * persistence across browser restarts.
 */

const ACCESS_TOKEN_KEY = "auditinsight.accessToken";

class TokenStorage {
  private accessToken: string | null = null;

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  }

  setTokens(accessToken: string): void {
    this.accessToken = accessToken;
    if (this.isBrowser()) {
      try {
        window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
        const stored = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
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
        window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
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


