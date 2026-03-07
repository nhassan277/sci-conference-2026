import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Info, AlertTriangle, CheckCircle, Zap } from "lucide-react";

const TYPE_CONFIG = {
  info: {
    bg: "bg-blue-600",
    icon: Info,
  },
  warning: {
    bg: "bg-yellow-500",
    icon: AlertTriangle,
  },
  success: {
    bg: "bg-green-600",
    icon: CheckCircle,
  },
  urgent: {
    bg: "bg-red-600",
    icon: Zap,
  },
};

export default function AnnouncementBanner() {
  const { data: announcements } = trpc.announcements.getActive.useQuery();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  if (!announcements || announcements.length === 0) return null;

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  // Show the most recent active announcement
  const ann = visible[0];
  const config = TYPE_CONFIG[ann.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div className={`w-full ${config.bg} text-white`}>
      <div className="container py-2.5 flex items-center gap-3">
        <Icon className="w-4 h-4 shrink-0" />
        <div className="flex-1 text-sm font-medium">
          <span>{ann.message}</span>
          {ann.messageAr && (
            <span className="mx-2 opacity-70">|</span>
          )}
          {ann.messageAr && (
            <span dir="rtl" className="text-sm">{ann.messageAr}</span>
          )}
          {ann.link && ann.linkText && (
            <a
              href={ann.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 underline font-bold text-white/90 hover:text-white"
            >
              {ann.linkText} →
            </a>
          )}
        </div>
        <button
          onClick={() => setDismissed((prev) => new Set([...prev, ann.id]))}
          className="shrink-0 opacity-70 hover:opacity-100 p-1 rounded"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
