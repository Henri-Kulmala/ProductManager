const API_URL = import.meta.env.VITE_API_URL!;

export type SessionUser = { id: string; role: string };

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return false;
  }

  return res.status === 204;
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
}

export async function getUser(): Promise<SessionUser | null> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { user: SessionUser | null };
  return data.user ?? null;
}
