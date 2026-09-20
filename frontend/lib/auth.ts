const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/* =========================
   SAVE TOKENS
========================= */

export function saveTokens(
  accessToken: string,
  refreshToken: string
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken
  );

  if (refreshToken) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken
    );
  }
}

/* =========================
   GET ACCESS TOKEN
========================= */

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/* =========================
   GET REFRESH TOKEN
========================= */

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/* =========================
   SET TOKENS
========================= */

export function setTokens(
  accessToken: string,
  refreshToken: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken
  );

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    refreshToken
  );
}

/* =========================
   CLEAR TOKENS
========================= */

export function clearTokens(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/* =========================
   LOGOUT
========================= */

export function logout(): void {
  clearTokens();
}

/* =========================
   REMOVE ITEM
========================= */

export function removeItem(): void {
  logout();
}

/* =========================
   AUTH CHECK
========================= */

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

