import { defineStore } from "pinia";
import { http } from "../lib/http";

type User = {
  id: string;
  displayName?: string;
  userPrincipalName?: string;
  mail?: string | null;
};

type TokenMeta = {
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

const SNAPSHOT_KEY = "auth_snapshot_v1";
const SESSION_KEY = "auth_session_v1";

function readSessionLocal() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    const userRaw = localStorage.getItem("ms_user");
    const token = localStorage.getItem("ms_access_token");
    return {
      user: userRaw ? (JSON.parse(userRaw) as User) : null,
      msAccessToken: token,
      tokenMeta: null as TokenMeta | null,
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      user: (parsed.user ?? null) as User | null,
      msAccessToken: (parsed.msAccessToken ?? parsed.ms_access_token ?? null) as string | null,
      tokenMeta: (parsed.tokenMeta ?? parsed.token ?? null) as TokenMeta | null,
    };
  } catch {
    return { user: null, msAccessToken: null, tokenMeta: null };
  }
}

function writeSessionLocal(user: User | null, token: string | null, meta: TokenMeta | null) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ user, msAccessToken: token, tokenMeta: meta })
  );
  if (user) localStorage.setItem("ms_user", JSON.stringify(user));
  if (token) localStorage.setItem("ms_access_token", token);
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    accessToken: () => {
      const { msAccessToken } = readSessionLocal();
      return msAccessToken || null;
    },
  },
  actions: {
    saveSnapshot() {
      try {
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ user: this.user }));
      } catch {}
    },
    loadFromStorage() {
      const sess = readSessionLocal();
      if (sess.user) this.user = sess.user;
      else {
        try {
          const raw = localStorage.getItem(SNAPSHOT_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            this.user = parsed?.user ?? null;
          }
        } catch {}
      }
    },
    clearStorage() {
      localStorage.removeItem(SNAPSHOT_KEY);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("ms_user");
      localStorage.removeItem("ms_access_token");
      localStorage.removeItem("ms_token_meta");
    },
    setSessionFromFrontend(payload: { user: User; token: string; meta?: TokenMeta }) {
      this.user = payload.user;
      writeSessionLocal(payload.user, payload.token, payload.meta ?? null);
      this.saveSnapshot();
    },
    async fetchMe() {
      this.isLoading = true;
      this.error = null;
      try {
        const { data } = await http.get("/auth/me");
        if (data?.authenticated) {
          this.user = data.user as User;
          this.saveSnapshot();
          const sess = readSessionLocal();
          writeSessionLocal(this.user, sess.msAccessToken, sess.tokenMeta);
          return true;
        }
        this.user = null;
        this.clearStorage();
        return false;
      } catch (e: any) {
        this.error = e?.response?.data?.message || e?.message || "Erro ao carregar sessão";
        this.user = null;
        this.clearStorage();
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      try {
        await http.post("/auth/logout");
      } finally {
        this.user = null;
        this.error = null;
        this.clearStorage();
        window.location.href = "/login";
      }
    },
  },
});