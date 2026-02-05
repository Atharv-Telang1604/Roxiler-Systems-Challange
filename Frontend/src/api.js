const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000";

export function getAuthToken() {
  return localStorage.getItem("token");
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function setAuthMeta(meta) {
  if (meta) {
    localStorage.setItem("authMeta", JSON.stringify(meta));
  } else {
    localStorage.removeItem("authMeta");
  }
}

export function getAuthMeta() {
  const raw = localStorage.getItem("authMeta");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const message = data?.message || `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    // Network error or fetch failed
    if (err.message.includes("fetch")) {
      throw new Error(
        `Cannot connect to server. Please make sure the backend is running on ${API_BASE}`
      );
    }
    throw err;
  }
}

