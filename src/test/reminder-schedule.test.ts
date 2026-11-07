import { describe, it, expect } from "vitest";
import { DEFAULT_SETTINGS, halfHourSlots, inQuietHours } from "@/quran/lib/reminder-schedule";

describe("half-hour reminders", () => {
  it("fire every 30 minutes on :00 and :30", () => {
    const s = { ...DEFAULT_SETTINGS, quietEnabled: false };
    const slots = halfHourSlots(new Date(2026, 0, 1, 10, 10), s, 2);
    expect(slots.map((d) => `${d.getHours()}:${d.getMinutes()}`)).toEqual(["10:30", "11:0", "11:30", "12:0"]);
  });
  it("skip quiet hours 22:00-06:00", () => {
    expect(inQuietHours(new Date(2026, 0, 1, 23, 0), DEFAULT_SETTINGS)).toBe(true);
    expect(inQuietHours(new Date(2026, 0, 1, 6, 0), DEFAULT_SETTINGS)).toBe(false);
  });
  it("produce nothing when switched off", () => {
    expect(halfHourSlots(new Date(), { ...DEFAULT_SETTINGS, halfHourlyEnabled: false })).toEqual([]);
  });
});
