import { useEffect, useState } from "react";
import { useLDClient, useLDClientError } from "launchdarkly-react-client-sdk";
import Landing from "@/pages/Landing";
import {
  WAITLIST_LANDING_PAGE_FLAG,
  landingVariantFromWaitlistFlag,
  readWaitlistLandingFlag,
} from "@/lib/launchdarkly";

/** Root route: waitlist vs full product landing from LaunchDarkly only. */
const LandingRoute = () => {
  const ldClient = useLDClient();
  const ldError = useLDClientError();
  const [flagOn, setFlagOn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!ldClient) return;

    const readFlag = () => {
      setFlagOn(readWaitlistLandingFlag(ldClient));
    };

    const warnIfNoFlags = () => {
      if (!import.meta.env.DEV) return;
      const loaded = Object.keys(ldClient.allFlags());
      if (loaded.length > 0) return;
      console.error(
        "[LaunchDarkly] Client initialized but no flags were returned. " +
          "Update VITE_LAUNCHDARKLY_CLIENT_SIDE_ID in Doppler to the environment's " +
          '"Client-side ID" from LaunchDarkly (Account settings → Environments). ' +
          "A 401 from the eval API usually means the wrong key is configured.",
      );
    };

    const onReady = () => {
      readFlag();
      warnIfNoFlags();
    };

    readFlag();
    ldClient.on("ready", onReady);
    ldClient.on("change", readFlag);
    ldClient.on("failed", (err: Error) => {
      if (import.meta.env.DEV) console.error("[LaunchDarkly] client failed:", err);
    });
    return () => {
      ldClient.off("ready", onReady);
      ldClient.off("change", readFlag);
    };
  }, [ldClient]);

  const variant = landingVariantFromWaitlistFlag(flagOn);

  useEffect(() => {
    if (!import.meta.env.DEV || !ldClient) return;

    const log = () => {
      console.group("[LaunchDarkly] landing");
      console.log("flag key:", WAITLIST_LANDING_PAGE_FLAG);
      console.log("variation:", readWaitlistLandingFlag(ldClient));
      console.log("allFlags():", ldClient.allFlags());
      console.log("context:", ldClient.getContext());
      console.log("resolved variant:", variant);
      console.groupEnd();
    };

    log();
  }, [ldClient, variant]);

  useEffect(() => {
    if (ldError && import.meta.env.DEV) {
      console.error("[LaunchDarkly] initialization error:", ldError);
    }
  }, [ldError]);

  return <Landing variant={variant} />;
};

export default LandingRoute;
