import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { basicLogger } from "launchdarkly-js-client-sdk";
import App from "./App.tsx";
import "./index.css";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import {
  getLaunchDarklyClientSideId,
  LAUNCHDARKLY_CONTEXT,
} from "@/lib/launchdarkly";

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
});

const clientSideId = getLaunchDarklyClientSideId();

if (!clientSideId && import.meta.env.DEV) {
  console.warn(
    "[LaunchDarkly] VITE_LAUNCHDARKLY_CLIENT_SIDE_ID is not set; landing flags will not load.",
  );
}

const app = <App />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        {clientSideId ? (
          <LDProvider
            clientSideID={clientSideId}
            context={LAUNCHDARKLY_CONTEXT}
            reactOptions={{ useCamelCaseFlagKeys: false }}
            options={
              import.meta.env.DEV
                ? { logger: basicLogger({ level: "warn" }) }
                : undefined
            }
          >
            {app}
          </LDProvider>
        ) : (
          app
        )}
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
);
