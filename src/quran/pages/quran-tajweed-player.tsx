import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@/quran/wouter-shim";
import { ChevronRight, Play, Pause, RotateCcw, RotateCw, SkipBack, SkipForward, Heart, Shuffle, Repeat1 } from "lucide-react";
import { useSurahList } from "@/quran/hooks/useSurahList";
import { useFavorites } from "@/quran/hooks/useFavorites";
import { Skeleton } from "@/quran/components/ui/skeleton";
import { OfflineDownloadButton } from "@/quran/components/offline-download-button";
import { getCachedAudioObjectUrl } from "@/quran/lib/offline-audio";

let _autoPlayOnMount = false;

export default function QuranTajweedPlayer() {
  const [location, setLocation] = useLocation();
  const number = parseInt(location.split("/").pop() || "1");
  const { surahs } = useSurahList();
  const surah = surahs.find((s) => s.number === number);
  const { isFavorite, toggle } = useFavorites();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [playMode, setPlayMode] = useState<"off" | "auto" | "shuffle" | "repeat">("auto");

  const audioUrl = `https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/${number.toString().padStart(3, "0")}.mp3`;
  const [audioSourceUrl, setAudioSourceUrl] = useState(audioUrl);
  const sourceObjectUrlRef = useRef<string | null>(null);

  const prevNum  = number > 1   ? number - 1 : null;
  const nextNum  = number < 114 ? number + 1 : null;
  const prevSurah = surahs.find((s) => s.number === prevNum);
  const nextSurah = surahs.find((s) => s.number === nextNum);

  useEffect(() => {
    let active = true;
    setAudioSourceUrl(audioUrl);

    void getCachedAudioObjectUrl("tajweed", number)
      .then((cachedUrl) => {
        if (!cachedUrl) return;
        if (!active) {
          URL.revokeObjectURL(cachedUrl);
          return;
        }
        if (sourceObjectUrlRef.current) URL.revokeObjectURL(sourceObjectUrlRef.current);
        sourceObjectUrlRef.current = cachedUrl;
        setAudioSourceUrl(cachedUrl);
      })
      .catch(() => {});

    return () => {
      active = false;
      if (sourceObjectUrlRef.current) {
        URL.revokeObjectURL(sourceObjectUrlRef.current);
        sourceObjectUrlRef.current = null;
      }
    };
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = audioSourceUrl;
    audio.load();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffering(false);
    if (_autoPlayOnMount && audioRef.current) {
      _autoPlayOnMount = false;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [number, audioSourceUrl]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function handleEnded() {
    if (playMode === "repeat") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    } else if (playMode === "shuffle") {
      const randomNum = Math.floor(Math.random() * 114) + 1;
      _autoPlayOnMount = true;
      setLocation(`/quran-tajweed/${randomNum}`);
    } else if (playMode === "auto" && nextNum) {
      _autoPlayOnMount = true;
      setLocation(`/quran-tajweed/${nextNum}`);
    } else {
      setPlaying(false);
      setCurrentTime(0);
    }
  }

  function goNext() {
    if (!nextNum) return;
    _autoPlayOnMount = true;
    setLocation(`/quran-tajweed/${nextNum}`);
  }

  function goPrev() {
    if (!prevNum) return;
    setLocation(`/quran-tajweed/${prevNum}`);
  }

  function seekBy(seconds: number) {
    if (!audioRef.current) return;
    const nextTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration || Infinity);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function formatTime(s: number) {
    if (!isFinite(s)) return "0:00:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10 pt-2" dir="rtl">
      <div className="flex items-center justify-between">
        <Link href="/quran-tajweed"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-sans text-sm">
          <ChevronRight className="w-5 h-5" />
          قائمة السور
        </Link>
        <div className="flex items-center gap-2">
          <OfflineDownloadButton type="tajweed" number={number} showLabel />
          <button
            onClick={() => toggle(number)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm font-sans ${
              isFavorite(number)
                ? "border-rose-400 text-rose-500 bg-rose-50"
                : "border-border text-muted-foreground hover:border-rose-400 hover:text-rose-500"
            }`}>
            <Heart className="w-4 h-4" fill={isFavorite(number) ? "currentColor" : "none"} />
            {isFavorite(number) ? "في المفضلة" : "أضف للمفضلة"}
          </button>
        </div>
      </div>

      <div className="text-center space-y-2">
        {surah ? (
          <>
            <h1 className="font-serif text-5xl text-primary">{surah.name}</h1>
            <p className="font-sans text-muted-foreground">{surah.englishName} — {surah.englishNameTranslation}</p>
            <p className="font-sans text-xs text-muted-foreground">
              {surah.numberOfAyahs} آية — {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
            </p>
          </>
        ) : <Skeleton className="h-12 w-48 mx-auto" />}
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <p className="font-serif text-center text-muted-foreground text-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

        {/* seek bar */}
        <div className="space-y-2">
          <input type="range" min={0} max={duration || 100} value={currentTime}
            onChange={(e) => {
              const t = parseFloat(e.target.value);
              if (audioRef.current) { audioRef.current.currentTime = t; setCurrentTime(t); }
            }}
            className="w-full h-2 accent-primary cursor-pointer" data-testid="input-tajweed-seek" />
          <div className="flex justify-between font-sans text-xs text-muted-foreground" dir="ltr">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* central control cluster — identical to the murattal player */}
        <div className="flex items-center justify-center gap-3 sm:gap-5" dir="ltr">
          <button onClick={goPrev} disabled={!prevNum} aria-label="السورة السابقة"
            className="w-10 h-10 rounded-full border border-border hover:text-primary hover:border-primary disabled:opacity-30 transition-all bg-[#1c542fe6] text-[#ffff]"
            data-testid="button-tajweed-prev-surah">
            <SkipBack className="w-5 h-5 mx-auto" />
          </button>
          <button onClick={() => seekBy(10)} aria-label="تقديم 10 ثوانٍ"
            className="w-10 h-10 rounded-full hover:text-primary transition-all bg-[#1c542f] text-[#ffffff]"
            data-testid="button-tajweed-seek-forward">
            <span className="relative block">
              <RotateCw className="w-6 h-6 mx-auto" />
              <span className="absolute inset-0 flex items-center justify-center text-[#f8f5f2] text-[10px]">10</span>
            </span>
          </button>
          <button onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all active:scale-95"
            data-testid="button-tajweed-play-pause">
            {buffering
              ? <div className="w-7 h-7 border-[3px] border-primary-foreground border-t-transparent rounded-full animate-spin" />
              : playing
                ? <Pause className="w-8 h-8" />
                : <Play className="w-8 h-8 mr-[-3px]" />
            }
          </button>
          <button onClick={() => seekBy(-10)} aria-label="تأخير 10 ثوانٍ"
            className="w-10 h-10 rounded-full hover:text-primary transition-all bg-[#1c542f] text-[#f8f5f2]"
            data-testid="button-tajweed-seek-back">
            <span className="relative block">
              <RotateCcw className="w-6 h-6 mx-auto" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#f8f5f2]">10</span>
            </span>
          </button>
          <button onClick={goNext} disabled={!nextNum} aria-label="السورة التالية"
            className="w-10 h-10 rounded-full border border-border hover:text-primary hover:border-primary disabled:opacity-30 transition-all bg-[#1c542fe6] text-[#ffff]"
            data-testid="button-tajweed-next-surah">
            <SkipForward className="w-5 h-5 mx-auto" />
          </button>
        </div>

        {/* restart / quick navigation */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => {
            if (audioRef.current) { audioRef.current.currentTime = 0; setCurrentTime(0); }
          }} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-sans" data-testid="button-tajweed-restart">
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          {prevSurah && <button onClick={goPrev} className="text-primary hover:underline text-xs font-sans">{prevSurah.name}</button>}
          {nextSurah && <button onClick={goNext} className="text-primary hover:underline text-xs font-sans">{nextSurah.name}</button>}
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
          <select value={playMode} onChange={(e) => setPlayMode(e.target.value as typeof playMode)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-sans text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="خاصية التشغيل التلقائي" data-testid="select-tajweed-play-mode">
            <option value="auto">التشغيل التلقائي</option>
            <option value="shuffle">التشغيل العشوائي</option>
            <option value="repeat">تكرار السورة</option>
            <option value="off">إيقاف التشغيل التلقائي</option>
          </select>
          {playMode === "shuffle" ? <Shuffle className="w-4 h-4 text-primary" /> : playMode === "repeat" ? <Repeat1 className="w-4 h-4 text-primary" /> : <RotateCw className={`w-4 h-4 ${playMode === "auto" ? "text-primary" : "text-muted-foreground"}`} />}
        </div>
      </div>

      <p className="text-center font-sans text-xs text-muted-foreground">
        تلاوة الشيخ محمد صديق المنشاوي — المصحف المجوّد
      </p>

      <audio ref={audioRef} src={audioSourceUrl}
        onTimeUpdate={() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={handleEnded}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        preload="none" />
    </div>
  );
}
