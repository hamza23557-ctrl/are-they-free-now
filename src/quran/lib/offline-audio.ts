
export type RecitationType = "murattal" | "tajweed";

const AUDIO_CACHE_NAME = "quran-recitation-audio-v1";


/** Large surahs are bundled as several byte-chunks that are joined at runtime. */
const SPLIT_MURATTAL: Record<number, number> = { 2: 3, 3: 2, 4: 2 };

function getSplitParts(number: number) {
  const count = SPLIT_MURATTAL[number];
  return count ? Array.from({ length: count }, (_, i) => `/audio/murattal/${number}.part${i}`) : null;
}

async function fetchSplitBlob(parts: string[], onProgress?: (p: number) => void, signal?: AbortSignal) {
  const blobs: Blob[] = [];
  for (let i = 0; i < parts.length; i++) {
    const res = await fetch(parts[i], { signal });
    if (!res.ok) throw new Error(`تعذر تحميل التلاوة (${res.status})`);
    blobs.push(await res.blob());
    onProgress?.(Math.round(((i + 1) / parts.length) * 100));
  }
  return new Blob(blobs, { type: "audio/mpeg" });
}

export function isSplitMurattal(number: number) {
  return Boolean(SPLIT_MURATTAL[number]);
}

/** Murattal recitations bundled with the app itself. */
export function getLocalMurattalUrl(number: number) {
  return `/audio/murattal/${number}.mp3`;
}

export function getRecitationUrl(type: RecitationType, number: number) {
  if (type === "tajweed") {
    return `https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/${number.toString().padStart(3, "0")}.mp3`;
  }

  return getLocalMurattalUrl(number);
}

async function getAudioCache() {
  if (!("caches" in window)) {
    throw new Error("التخزين المحلي غير مدعوم في هذا المتصفح");
  }

  return window.caches.open(AUDIO_CACHE_NAME);
}

export async function isRecitationCached(type: RecitationType, number: number) {
  const cache = await getAudioCache();
  return Boolean(await cache.match(getRecitationUrl(type, number)));
}

export async function downloadRecitation(
  type: RecitationType,
  number: number,
  onProgress?: (progress: number | null) => void,
  signal?: AbortSignal,
) {
  const url = getRecitationUrl(type, number);
  const cache = await getAudioCache();
  const splitParts = type === "murattal" ? getSplitParts(number) : null;
  if (splitParts) {
    onProgress?.(0);
    const blob = await fetchSplitBlob(splitParts, onProgress, signal);
    await cache.put(url, new Response(blob, { headers: { "Content-Type": "audio/mpeg" } }));
    onProgress?.(100);
    window.dispatchEvent(new Event("quran-offline-audio-updated"));
    return;
  }
  const response = await fetch(url, { mode: "cors", cache: "no-store", signal });

  if (!response.ok) {
    throw new Error(`تعذر تنزيل التلاوة (${response.status})`);
  }

  const contentLength = Number(response.headers.get("content-length"));
  const total = Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null;

  if (!response.body) {
    const blob = await response.blob();
    await cache.put(url, new Response(blob, {
      headers: { "Content-Type": response.headers.get("content-type") || "audio/mpeg" },
    }));
    onProgress?.(100);
    window.dispatchEvent(new Event("quran-offline-audio-updated"));
    return;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  // عند تعذّر معرفة الحجم الحقيقي نقدّره تلقائيًا وننمّيه مع التقدم حتى يستمر العدّاد بالعدّ
  let estimatedTotal = total ?? 2 * 1024 * 1024;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    received += value.byteLength;
    if (!total && received > estimatedTotal * 0.85) {
      estimatedTotal = received * 1.6;
    }
    const effectiveTotal = total ?? estimatedTotal;
    onProgress?.(Math.min(99, Math.round((received / effectiveTotal) * 100)));
  }

  const blob = new Blob(chunks as BlobPart[], {
    type: response.headers.get("content-type") || "audio/mpeg",
  });
  await cache.put(url, new Response(blob, {
    headers: { "Content-Type": response.headers.get("content-type") || "audio/mpeg" },
  }));
  onProgress?.(100);
  window.dispatchEvent(new Event("quran-offline-audio-updated"));
}

export async function downloadAllRecitations(
  type: RecitationType,
  numbers: number[],
  onProgress?: (completed: number, total: number) => void,
  signal?: AbortSignal,
) {
  for (let index = 0; index < numbers.length; index += 1) {
    await downloadRecitation(type, numbers[index], undefined, signal);
    onProgress?.(index + 1, numbers.length);
  }
}

export async function removeCachedRecitation(type: RecitationType, number: number) {
  const cache = await getAudioCache();
  await cache.delete(getRecitationUrl(type, number));
  window.dispatchEvent(new Event("quran-offline-audio-updated"));
}

export async function getCachedAudioObjectUrl(type: RecitationType, number: number) {
  const cache = await getAudioCache();
  const response = await cache.match(getRecitationUrl(type, number));
  if (!response) {
    const parts = type === "murattal" ? getSplitParts(number) : null;
    return parts ? URL.createObjectURL(await fetchSplitBlob(parts)) : null;
  }

  return URL.createObjectURL(await response.blob());
}