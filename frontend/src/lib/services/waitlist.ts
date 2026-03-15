import { api } from "../api";
import { WaitlistCountResponse } from "../static-data/response-types";

export const getWaitlistCount = async (): Promise<number> => {
  const data = await api.getPublic<WaitlistCountResponse>("/waitlisted_hosts/count");
  return typeof data.count === "number" ? data.count : 0;
};

