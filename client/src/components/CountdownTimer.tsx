import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const subscribeMutation = trpc.reminder.subscribe.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      setEmail("");
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
      setTimeout(() => setMessage(null), 5000);
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate({ email });
    }
  };

  return (
    <div className="w-full space-y-8">
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

      {/* Reminder Subscription Form */}
      <Card className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-primary">Get Reminded</h4>
          </div>
          <p className="text-sm text-muted-foreground">Receive an email reminder one week before the conference</p>
          <p className="text-sm text-muted-foreground" dir="rtl">احصل على تذكير قبل أسبوع من المؤتمر</p>
        </div>
        
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
              className="bg-primary hover:bg-primary/90"
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Remind Me | ذكرني"}
            </Button>
          </div>
          
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${
              message.type === "success" 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
