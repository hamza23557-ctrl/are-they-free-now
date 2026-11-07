import { describe, expect, it } from "vitest";
import { START_CREDITS, afterQuestion, canAsk, canShowInterstitial, rewardFor } from "@/quran/lib/credits";

describe("illuminated book credits", () => {
  it("starts with 100 credits", () => expect(START_CREDITS).toBe(100));
  it("each question costs 15", () => expect(afterQuestion(100)).toBe(85));
  it("cannot ask with less than 15", () => { expect(canAsk(14)).toBe(false); expect(canAsk(15)).toBe(true); });
  it("2 ads give 50", () => expect(rewardFor(2)).toBe(50));
  it("3 ads give 105", () => expect(rewardFor(3)).toBe(105));
  it("1 ad gives nothing", () => expect(rewardFor(1)).toBe(0));
});

describe("ad timing rules set by the user", () => {
  it("image ad shows when 4 minutes passed", () => expect(canShowInterstitial(0, 240_000)).toBe(true));
  it("image ad not before 4 minutes", () => expect(canShowInterstitial(0, 239_999)).toBe(false));
});
