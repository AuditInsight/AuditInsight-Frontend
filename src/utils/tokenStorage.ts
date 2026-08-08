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
const USER_DATA_KEY = "auditinsight.userData";

interface CachedUserData {
  organisationId: string;
  organisationName: string;
  orgType: string;
}

class TokenStorage {
  private accessToken: string | null = null;
  private userData: CachedUserData | null = null;

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

  setUserData(userData: CachedUserData): void {
    this.userData = userData;
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        console.log("DEBUG: Saved user data to localStorage:", userData);
      } catch (err) {
        console.error("DEBUG: Failed to save user data:", err);
      }
    }
  }

  getUserData(): CachedUserData | null {
    if (this.userData !== null) {
      console.log("DEBUG: Retrieved user data from memory:", this.userData);
      return this.userData;
    }

    if (this.isBrowser()) {
      try {
        const stored = window.localStorage.getItem(USER_DATA_KEY);
        console.log("DEBUG: Retrieved from localStorage:", stored);
        if (stored) {
          this.userData = JSON.parse(stored);
          console.log("DEBUG: Parsed user data:", this.userData);
          return this.userData;
        }
      } catch (err) {
        console.error("DEBUG: Failed to parse user data:", err);
        return null;
      }
    }

    return null;
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
    this.userData = null;
    if (this.isBrowser()) {
      try {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(USER_DATA_KEY);
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


