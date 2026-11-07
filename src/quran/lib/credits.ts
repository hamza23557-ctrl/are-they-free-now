export const START_CREDITS = 100;
export const QUESTION_COST = 15;
/** Rewarded-ad packages: number of 30s videos watched -> credits earned. */
export const AD_PACKAGES = [
  { ads: 2, credits: 50 },
  { ads: 3, credits: 105 },
] as const;

export const canAsk = (balance: number) => balance >= QUESTION_COST;
export const afterQuestion = (balance: number) => Math.max(0, balance - QUESTION_COST);
export function rewardFor(adsWatched: number): number {
  const pkg = AD_PACKAGES.find((p) => p.ads === adsWatched);
  return pkg ? pkg.credits : 0;
}

/** Image interstitial: shown on navigation when at least 4 minutes passed since the last one. */
export const INTERSTITIAL_MIN_GAP_MS = 4 * 60 * 1000;
export const canShowInterstitial = (lastShownAt: number, now: number) =>
  now - lastShownAt >= INTERSTITIAL_MIN_GAP_MS;

const KEY = "illuminated-credits";
export function loadCredits(): number {
  const v = localStorage.getItem(KEY);
  return v === null ? START_CREDITS : Number(v) || 0;
}
export function saveCredits(n: number) {
  localStorage.setItem(KEY, String(n));
}
