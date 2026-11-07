export interface ReminderSettings {
  morningEnabled: boolean;
  morningTime: string; // "HH:MM"
  eveningEnabled: boolean;
  eveningTime: string;
  halfHourlyEnabled: boolean;
  quietEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

export const DEFAULT_SETTINGS: ReminderSettings = {
  morningEnabled: true,
  morningTime: "06:00",
  eveningEnabled: true,
  eveningTime: "17:00",
  halfHourlyEnabled: true,
  quietEnabled: true,
  quietStart: "22:00",
  quietEnd: "06:00",
};

export const REMINDER_TEXTS = [
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
  "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
  "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
  "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
  "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
  "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
  "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ",
  "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي",
  "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ",
];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function inQuietHours(date: Date, s: ReminderSettings): boolean {
  if (!s.quietEnabled) return false;
  const now = date.getHours() * 60 + date.getMinutes();
  const a = toMin(s.quietStart);
  const b = toMin(s.quietEnd);
  return a <= b ? now >= a && now < b : now >= a || now < b;
}

/** Half-hour reminder times (on :00 and :30) for the next `hours`, skipping quiet hours. */
export function halfHourSlots(from: Date, s: ReminderSettings, hours = 48): Date[] {
  if (!s.halfHourlyEnabled) return [];
  const start = new Date(from);
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() < 30 ? 30 : 60);
  const out: Date[] = [];
  for (let i = 0; i < hours * 2; i++) {
    const d = new Date(start.getTime() + i * 30 * 60000);
    if (!inQuietHours(d, s)) out.push(d);
  }
  return out;
}
