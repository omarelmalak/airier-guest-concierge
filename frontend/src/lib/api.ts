import { getSession } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
    path: string,
    method: HttpMethod,
    body?: unknown
): Promise<T> {
    const session = await getSession();

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.error || res.statusText);
    }

    return res.json();
}

export const api = {
    get: <T>(path: string) => request<T>(path, "GET"),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, "POST", body),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, "PATCH", body),
    delete: <T>(path: string) => request<T>(path, "DELETE"),
};