import type { LDClient, LDContext } from "launchdarkly-js-client-sdk";
import type { LandingNavVariant } from "@/components/LandingNav";

/** LaunchDarkly flag key (must match the flag key in your LD project). */
export const WAITLIST_LANDING_PAGE_FLAG = "waitlist-landing-page-variant";

export const LAUNCHDARKLY_CONTEXT: LDContext = {
  kind: "user",
  key: "anonymous-landing",
  anonymous: true,
};

export function getLaunchDarklyClientSideId(): string | undefined {
  const id = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_SIDE_ID;
  return typeof id === "string" && id.trim() !== "" ? id.trim() : undefined;
}

/**
 * Boolean LD flag `waitlist-landing-page-variant`.
 * ON (true) → waitlist landing; OFF (false) → full product landing.
 */
export function landingVariantFromWaitlistFlag(
  flagOn: boolean | undefined,
): LandingNavVariant {
  return flagOn ? "waitlist" : "standard";
}

/** Reads the waitlist landing boolean flag via the JS SDK's `variation` API. */
export function readWaitlistLandingFlag(ldClient: LDClient): boolean {
  return Boolean(ldClient.variation(WAITLIST_LANDING_PAGE_FLAG, false));
}
