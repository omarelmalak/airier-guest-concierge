import { api } from "../api";
import { WaitlistCountResponse } from "../static-data/response-types";

export const getWaitlistCount = async (): Promise<number> => {
  const data = await api.get<WaitlistCountResponse>("/waitlisted_hosts/count");
  return typeof data.count === "number" ? data.count : 0;
};

