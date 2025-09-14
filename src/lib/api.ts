export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
  };
  // Do not send Authorization header; rely on httpOnly cookie for auth
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
