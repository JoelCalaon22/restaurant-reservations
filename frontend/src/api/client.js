const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}

export { BASE_URL };
