export const META_PIXEL_ID = "1652772945793686";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead");
  }
}
