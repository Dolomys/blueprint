type PostHogLike = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify: (userId: string, props?: Record<string, unknown>) => void;
  reset: () => void;
};

const posthog = (globalThis as typeof globalThis & { posthog?: PostHogLike }).posthog;

export function track(event: string, props?: Record<string, unknown>) {
  posthog?.capture(event, props);
}

export function identify(userId: string, props?: Record<string, unknown>) {
  posthog?.identify(userId, props);
}

export function reset() {
  posthog?.reset();
}
