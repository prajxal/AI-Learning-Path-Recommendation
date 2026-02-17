const BACKEND_URL = "http://localhost:8000";

type AuthResponse = {
  user_id: string;
};

type AuthError = {
  detail?: string;
};

async function authRequest(path: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data: AuthResponse | AuthError | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      data && "detail" in data && typeof data.detail === "string"
        ? data.detail
        : `Authentication request failed: ${response.status}`;
    throw new Error(detail);
  }

  if (!data || !("user_id" in data) || typeof data.user_id !== "string") {
    throw new Error("Invalid authentication response");
  }

  return { user_id: data.user_id };
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  return authRequest("/auth/signup", email, password);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return authRequest("/auth/login", email, password);
}
