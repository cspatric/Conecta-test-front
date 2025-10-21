// src/services/ai.ts
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

export type MessageType =
  | "small_talk"
  | "text"
  | "contacts_list"
  | "contact_detail"
  | "email_list"
  | "email_detail"
  | "email_sent"
  | "system"
  | "error";

export type Plan = {
  action: string;
  params: Record<string, unknown>;
  reason: string;
  confidence: number;
  message: string;
  message_type: MessageType;
};

export type AiResponse = {
  plan: Plan;
  result?: any;
  error?: string;
} | string;

export type AiRequest = {
  prompt: string;
  goal?: string;
  context?: Record<string, any>;
  constraints?: string[];
  tools?: string[];
};

export async function runAI(payload: AiRequest): Promise<AiResponse> {
  if (!payload?.prompt?.trim()) {
    throw new Error("prompt é obrigatório");
  }
  const token = readToken();

  try {
    const { data } = await http.post("/ai/", payload, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 60_000, // defensivo
    });
    return data; // 2xx
  } catch (err: any) {
    // Se a API respondeu algo (mesmo em 4xx/5xx), retornamos esse payload pro caller tratar
    const data = err?.response?.data;
    if (data) return data as AiResponse;

    // Falha sem payload (ex.: rede/CORS). Rejogamos a exceção.
    throw err;
  }
}