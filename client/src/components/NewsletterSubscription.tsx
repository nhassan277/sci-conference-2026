import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
// Simple toast replacement
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    if (variant === 'destructive') {
      alert(`Error: ${description}`);
    } else {
      alert(`${title}: ${description}`);
    }
  }
});

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: data.message,
      });
      setEmail("");
      setName("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate({ email, name: name || undefined });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-800">
        <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mb-4" />
        <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
          You're Subscribed!
        </h3>
        <p className="text-green-700 dark:text-green-300 text-center">
          Thank you for subscribing. You'll receive conference updates and announcements.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 p-8 rounded-lg border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-8 h-8 text-primary" />
        <div>
          <h3 className="text-2xl font-bold text-primary">Stay Updated</h3>
          <p className="text-sm text-muted-foreground">
            Subscribe to receive conference news and announcements
          </p>
          <p className="text-sm text-muted-foreground" dir="rtl">
            اشترك لتلقي أخبار المؤتمر والإعلانات
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your Name (Optional) | الاسم (اختياري)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            disabled={subscribeMutation.isPending}
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Your Email | البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
            disabled={subscribeMutation.isPending}
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="px-6"
          >
            {subscribeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe | اشترك"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
