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

export type MailMessage = {
  id: string;
  subject?: string;
  from?: { emailAddress: { name?: string; address?: string } };
  toRecipients?: { emailAddress: { name?: string; address?: string } }[];
  bodyPreview?: string;
  body?: { contentType: string; content: string };
  receivedDateTime?: string;
  sentDateTime?: string;
  isRead?: boolean;
};

export type MailListResponse = {
  value: MailMessage[];
  "@odata.nextLink"?: string;
};

export async function listInbox(top = 20, select?: string) {
  const token = readToken();
  const { data } = await http.get<MailListResponse>("/mail/inbox", {
    headers: { Authorization: `Bearer ${token}` },
    params: { top, $select: select },
  });
  return data;
}

export async function listSent(top = 20, select?: string) {
  const token = readToken();
  const { data } = await http.get<MailListResponse>("/mail/sent", {
    headers: { Authorization: `Bearer ${token}` },
    params: { top, $select: select },
  });
  return data;
}

export async function getMessageDetails(messageId: string, includeBody = true) {
  if (!messageId) throw new Error("messageId é obrigatório");
  const token = readToken();
  const { data } = await http.get<MailMessage>(
    `/mail/messages/${encodeURIComponent(messageId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { include_body: includeBody },
    }
  );
  return data;
}

export type SendMailPayload = {
  to: string[];
  subject: string;
  body: string;
};

export async function sendMail(payload: SendMailPayload) {
  if (!payload.to?.length) throw new Error("Destinatário é obrigatório");
  if (!payload.subject?.trim()) throw new Error("Assunto é obrigatório");
  if (!payload.body?.trim()) throw new Error("Corpo é obrigatório");

  const token = readToken();
  const { data } = await http.post(
    "/mail/send",
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
}