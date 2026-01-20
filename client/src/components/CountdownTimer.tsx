import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label, labelAr }: { value: number; label: string; labelAr: string }) => (
    <Card className="flex flex-col items-center justify-center p-4 md:p-6 bg-white/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all min-w-[80px] md:min-w-[100px]">
      <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-xs text-muted-foreground" dir="rtl">
        {labelAr}
      </div>
    </Card>
  );

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Conference Starts In
        </h3>
        <p className="text-xl md:text-2xl font-semibold text-secondary" dir="rtl">
          الوقت المتبقي للمؤتمر
        </p>
      </div>
      
      <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
        <TimeUnit value={timeLeft.days} label="Days" labelAr="يوم" />
        <TimeUnit value={timeLeft.hours} label="Hours" labelAr="ساعة" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" labelAr="دقيقة" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" labelAr="ثانية" />
      </div>
    </div>
  );
}
