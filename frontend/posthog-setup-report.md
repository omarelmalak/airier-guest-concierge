<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the airier guest concierge React/Vite app. Here is a summary of what was done:

- Installed `posthog-js` and `@posthog/react` packages
- Initialized PostHog in `src/main.tsx` using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables, with `PostHogProvider` and `PostHogErrorBoundary` wrapping the entire app
- Added `posthog.identify()` calls on signup and login to link events to known users
- Added `posthog.captureException()` for error tracking in auth, waitlist, and property creation flows
- Environment variables written to `.env` (and covered by `.gitignore`)

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created an account via the signup form | `src/pages/Auth.tsx` |
| `user_signed_in` | User successfully signed in via the login form | `src/pages/Auth.tsx` |
| `waitlist_joined` | Visitor submitted their email to join the waitlist on the landing page | `src/pages/Landing.tsx` |
| `get_started_clicked` | Visitor clicked a primary CTA button on the landing page (hero or bottom CTA) | `src/pages/Landing.tsx` |
| `property_created` | Host successfully completed all steps and created a new property | `src/pages/AddProperty.tsx` |
| `property_creation_step_completed` | Host advanced to the next step in the add-property wizard | `src/pages/AddProperty.tsx` |
| `subscription_activated` | Host activated an AI assistant subscription for a property | `src/components/SubscriptionDialog.tsx` |
| `subscription_cancelled` | Host cancelled an active AI assistant subscription | `src/components/SubscriptionDialog.tsx` |
| `subscription_manage_opened` | Host opened the subscription management dialog for a property | `src/pages/Settings.tsx` |
| `settings_saved` | Host saved their profile and notification settings | `src/pages/Settings.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/344254/dashboard/1364566
- **Landing → Signup conversion funnel**: https://us.posthog.com/project/344254/insights/Fs3IGkia
- **Signup → Property created funnel**: https://us.posthog.com/project/344254/insights/nAl2hZx8
- **Sign Ups & Sign Ins over time**: https://us.posthog.com/project/344254/insights/QCYYcPzT
- **Subscription activations vs cancellations**: https://us.posthog.com/project/344254/insights/O6nfHM5P
- **Waitlist joins over time**: https://us.posthog.com/project/344254/insights/pIdw5omg

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
