import { http } from "../lib/http";

function readToken(): string {
  const raw = localStorage.getItem("auth_session_v1");
  if (!raw) throw new Error("Token não encontrado");
  try {
    const parsed = JSON.parse(raw);
    const token = parsed.msAccessToken || parsed.ms_access_token || null;
    if (!token) throw new Error("Token inválido");
    return token as string;
  } catch {
    if (!raw) throw new Error("Token inválido");
    return raw;
  }
}

export type AiRequest = {
  prompt: string;
  goal?: string;
  context?: Record<string, any>;
  constraints?: string[];
  tools?: string[];
};

export type AiResponse = any;

export async function runAI(payload: AiRequest): Promise<AiResponse> {
  if (!payload?.prompt?.trim()) {
    throw new Error("prompt é obrigatório");
  }
  const token = readToken();
  const { data } = await http.post("/ai/", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}