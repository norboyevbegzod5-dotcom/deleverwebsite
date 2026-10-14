// Every pixel listed here gets PageView and Lead events.
export const META_PIXEL_IDS = ["1652772945793686", "1291065949784226"];

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
