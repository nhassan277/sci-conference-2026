import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const conferenceDate = new Date("2026-04-07T09:00:00+02:00"); // April 7, 2026, 9:00 AM Cairo time

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = conferenceDate.getTime() - now.getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const isOver = conferenceDate.getTime() - Date.now() <= 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const subscribeMutation = trpc.reminder.subscribe.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      setEmail("");
      setTimeout(() => setMessage(null), 5000);
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
      setTimeout(() => setMessage(null), 5000);
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) subscribeMutation.mutate({ email });
  };

  const units = [
    { value: timeLeft.days, label: "Days", labelAr: "يوم" },
    { value: timeLeft.hours, label: "Hours", labelAr: "ساعة" },
    { value: timeLeft.minutes, label: "Minutes", labelAr: "دقيقة" },
    { value: timeLeft.seconds, label: "Seconds", labelAr: "ثانية" },
  ];

  return (
    <div className="w-full">
      {/* Main countdown block */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[oklch(0.45_0.15_250)] via-[oklch(0.38_0.18_255)] to-[oklch(0.28_0.20_260)] px-6 py-10 md:py-14 shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

        {isOver ? (
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-white">🎉 Conference is Live!</p>
            <p className="text-2xl font-semibold text-yellow-300 mt-2" dir="rtl">المؤتمر يبدأ الآن!</p>
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <p className="text-sm md:text-base font-semibold uppercase tracking-widest text-white/60 mb-1">
                April 7–8, 2026 · Faculty of Science, Cairo University
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Conference Starts In
              </h3>
              <p className="text-lg md:text-xl font-semibold text-yellow-300 mt-1" dir="rtl">
                الوقت المتبقي للمؤتمر
              </p>
            </div>

            {/* Countdown units */}
            <div className="flex justify-center items-center gap-2 md:gap-6 flex-wrap">
              {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-2 md:gap-6">
                  <div className="flex flex-col items-center">
                    {/* Number box */}
                    <div className="relative">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                        <span className="text-4xl md:text-6xl font-extrabold text-white tabular-nums leading-none">
                          {unit.value.toString().padStart(2, "0")}
                        </span>
                      </div>
                      {/* Bottom shine line */}
                      <div className="absolute bottom-0 left-2 right-2 h-px bg-white/30 rounded-full" />
                    </div>
                    {/* Labels */}
                    <p className="mt-2 text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">
                      {unit.label}
                    </p>
                    <p className="text-xs text-yellow-300/80" dir="rtl">
                      {unit.labelAr}
                    </p>
                  </div>
                  {/* Separator colon (not after last unit) */}
                  {i < units.length - 1 && (
                    <span className="text-3xl md:text-5xl font-bold text-white/40 mb-6 select-none">:</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reminder subscription */}
      <div className="mt-6 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border border-primary/20 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-primary" />
          <h4 className="text-base font-semibold text-primary">Get Reminded | احصل على تذكير</h4>
        </div>
        <p className="text-xs text-center text-muted-foreground mb-4">
          Receive an email reminder one week before the conference · تذكير بالبريد قبل أسبوع
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email | أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Remind Me | ذكرني"}
            </Button>
          </div>
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
