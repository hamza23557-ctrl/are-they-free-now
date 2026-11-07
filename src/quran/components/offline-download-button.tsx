import { useEffect, useState } from "react";
import { AlertCircle, Check, Download, Loader2, Trash2, X } from "lucide-react";
import {
  downloadRecitation,
  isRecitationCached,
  removeCachedRecitation,
  type RecitationType,
} from "@/quran/lib/offline-audio";

type DownloadStatus = "checking" | "idle" | "downloading" | "downloaded" | "error";

export function OfflineDownloadButton({
  type,
  number,
  showLabel = false,
}: {
  type: RecitationType;
  number: number;
  showLabel?: boolean;
}) {
  const [status, setStatus] = useState<DownloadStatus>("checking");
  const [progress, setProgress] = useState<number | null>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [controller, setController] = useState<AbortController | null>(null);

  async function refreshStatus() {
    try {
      setStatus((current) => current === "downloading" ? current : "checking");
      setStatus(await isRecitationCached(type, number) ? "downloaded" : "idle");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    void refreshStatus();
    const handleUpdated = () => { void refreshStatus(); };
    window.addEventListener("quran-offline-audio-updated", handleUpdated);
    return () => window.removeEventListener("quran-offline-audio-updated", handleUpdated);
  }, [type, number]);

  // يلاحق العدّاد المعروض النسبة الحقيقية بحركة متدرجة حتى يظهر العدّ بوضوح
  useEffect(() => {
    if (status !== "downloading") {
      setDisplayProgress(0);
      return;
    }
    const target = progress ?? 0;
    let raf = 0;
    const step = () => {
      setDisplayProgress((current) => {
        if (target <= current) return current;
        const next = current + (target - current) * 0.09;
        return target - next < 0.5 ? target : next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status, progress]);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (status === "checking") return;

    if (status === "downloaded") {
      try {
        await removeCachedRecitation(type, number);
        setStatus("idle");
      } catch {
        setStatus("error");
      }
      return;
    }

    try {
      setProgress(0);
      setStatus("downloading");
      const nextController = new AbortController();
      setController(nextController);
      await downloadRecitation(type, number, setProgress, nextController.signal);
      setProgress(100);
      setController(null);
      setStatus("downloaded");
    } catch (error) {
      setController(null);
      setProgress(null);
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }
  }

  function handleCancelClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const shouldCancel = window.confirm(
      "السورة قيد التحميل الآن.\nهل تريد إلغاء التحميل؟\nاضغط «موافق» للإلغاء أو «إلغاء» لمتابعة التحميل.",
    );
    if (shouldCancel) {
      controller?.abort();
      setController(null);
      setProgress(null);
      setStatus("idle");
    }
  }

  const label = status === "downloaded"
    ? "محفوظ بدون إنترنت"
    : status === "downloading"
      ? progress === null ? "جارٍ التحميل" : `جارٍ التحميل ${progress}%`
      : status === "error"
        ? "إعادة المحاولة"
        : "تحميل بدون إنترنت";

  if (status === "downloaded") {
    return (
      <div className="flex items-center justify-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <span
          className={`${showLabel ? "px-2 py-1.5 text-xs font-sans" : "w-8 h-8"} flex items-center justify-center rounded-full text-primary bg-primary/10`}
          aria-label="السورة محفوظة بدون إنترنت"
          title="السورة محفوظة بدون إنترنت"
          data-testid={`icon-downloaded-${type}-${number}`}
        >
          <Check className="w-4 h-4" />
          {showLabel && <span className="mr-1">محفوظة دون إنترنت</span>}
        </span>
        <button
          type="button"
          onClick={handleClick}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground border border-border hover:text-red-600 hover:border-red-300 transition-colors"
          aria-label="حذف السورة من التحميلات"
          title="حذف السورة من التحميلات"
          data-testid={`btn-delete-download-${type}-${number}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (status === "downloading") {
    const size = showLabel ? 40 : 44;
    const stroke = 3.5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = progress === null ? 0 : displayProgress;
    return (
      <div className="flex items-center justify-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
          role="status"
          aria-label={label}
          title={label}
          data-testid={`download-progress-${type}-${number}`}
        >
          <svg width={size} height={size} className="-rotate-90 absolute inset-0">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              className="stroke-border"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              className="stroke-primary"
            />
          </svg>
          <span className="font-sans text-[10px] font-bold text-primary leading-none">
            {progress === null ? <Loader2 className="w-4 h-4 animate-spin" /> : `${Math.floor(pct)}%`}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCancelClick}
          className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground border border-border hover:text-red-600 hover:border-red-300 transition-colors"
          aria-label="إلغاء التحميل"
          title="إلغاء التحميل"
          data-testid={`btn-cancel-download-${type}-${number}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "checking"}
      className={`flex items-center justify-center gap-1.5 rounded-full transition-all ${
        showLabel ? "px-3 py-1.5 text-xs font-sans border" : "w-9 h-9 flex-shrink-0"
      } ${
        status === "error"
          ? "text-red-600 border-red-200 bg-red-50"
          : "text-muted-foreground border-border hover:text-primary hover:border-primary/50"
      } disabled:opacity-70`}
      aria-label={label}
      title={label}
      data-testid={`btn-download-${type}-${number}`}
    >
      {status === "checking"
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : status === "error"
          ? <AlertCircle className="w-4 h-4" />
          : <Download className="w-4 h-4" />}
      {showLabel && <span>{label}</span>}
    </button>
  );
}