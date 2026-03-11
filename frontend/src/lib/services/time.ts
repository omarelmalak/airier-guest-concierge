import { api } from "../api";

export interface ToUtcRequest {
  timezone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or HH:mm:ss
}

export interface ToUtcResponse {
  utc: string; // ISO8601
}

export async function toUtc(payload: ToUtcRequest): Promise<ToUtcResponse> {
  return api.post<ToUtcResponse>("/time/to_utc", payload);
}

export interface TodayRequest {
  timezone: string;
}

export interface TodayResponse {
  date: string; // YYYY-MM-DD
}

export async function todayInTimezone(payload: TodayRequest): Promise<TodayResponse> {
  return api.post<TodayResponse>("/time/today", payload);
}

