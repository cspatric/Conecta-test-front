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

export async function listContacts(top = 100) {
  const token = readToken();
  const { data } = await http.get("/contacts/", {
    headers: { Authorization: `Bearer ${token}` },
    params: { top },
  });
  return data;
}

export async function getContactDetails(contactId: string, select?: string) {
  if (!contactId) throw new Error("contactId é obrigatório");
  const token = readToken();
  const { data } = await http.get(`/contacts/${encodeURIComponent(contactId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: select ? { $select: select } : undefined,
  });
  return data;
}

export type CreateContactPayload = {
  givenName: string;
  surname?: string | null;
  email?: string | null;
  businessPhones?: string[];
  extra?: Record<string, any>;
};

export async function createContact(payload: CreateContactPayload) {
  if (!payload?.givenName?.trim()) {
    throw new Error("givenName é obrigatório");
  }
  const token = readToken();
  const { data } = await http.post("/contacts/", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}