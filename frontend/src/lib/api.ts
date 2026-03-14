import { getSession } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

async function requestPublic<T>(path: string, method: "POST", body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(data?.error || res.statusText);
    }
    return data as T;
}

export const api = {
    get: <T>(path: string) => request<T>(path, "GET"),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, "POST", body),
    put: <T>(path: string, body: unknown) =>
        request<T>(path, "PUT", body),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, "PATCH", body),
    delete: <T>(path: string) => request<T>(path, "DELETE"),
    postPublic: <T>(path: string, body: unknown) =>
        requestPublic<T>(path, "POST", body),
};