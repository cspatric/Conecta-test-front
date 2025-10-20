import { http } from "../lib/http";


export type MsUser = {
  id: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  mail?: string | null;
};

export type AuthCallbackSuccess = {
  access_token: string;
  user: MsUser;
};

export type AuthCallbackError = {
  error: string;
  error_description?: string;
};

export function authLoginRedirect() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
}

export async function authCallback(params: {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}) {
  const resp = await http.get<AuthCallbackSuccess | AuthCallbackError>(
    "/auth/callback",
    { params }
  );
  return resp.data;
}

export async function authLogout() {
  await http.post("/auth/logout");
}