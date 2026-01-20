import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useUser } from "@/contexts/UserContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Mail, Send, ArrowLeft } from "lucide-react";

export default function DigestSettings() {
  const { user, loading: authLoading, isAuthenticated } = useUser();
  const [, navigate] = useLocation();

  const [frequency, setFrequency] = useState<"daily" | "weekly" | "disabled">("daily");
  const [enabled, setEnabled] = useState(true);
  const [sendingDaily, setSendingDaily] = useState(false);
  const [sendingWeekly, setSendingWeekly] = useState(false);

  // Check authentication and admin status
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  // Fetch current preferences
  const { data: preferences, isLoading: prefsLoading, refetch } = trpc.digest.getPreferences.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
      retry: false,
      onError: (error) => {
        if (error.message.includes("FORBIDDEN") || error.message.includes("10002")) {
          toast.error("Access Denied", {
            description: "You do not have permission to access this page.",
          });
          navigate("/");
        }
      },
    }
  );

  // Load preferences when data is available
  useEffect(() => {
    if (preferences) {
      setFrequency(preferences.frequency as "daily" | "weekly" | "disabled");
      setEnabled(preferences.enabled);
    }
  }, [preferences]);

  // Update preferences mutation
  const updateMutation = trpc.digest.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences Updated", {
        description: "Your email digest preferences have been saved.",
      });
      refetch();
    },
    onError: (error) => {
      toast.error("Update Failed", {
        description: error.message || "Failed to update preferences. Please try again.",
      });
    },
  });

  // Send now mutation
  const sendNowMutation = trpc.digest.sendNow.useMutation({
    onSuccess: (data, variables) => {
      toast.success("Digest Sent", {
        description: `${variables.frequency} digest has been sent to your email.`,
      });
      if (variables.frequency === "daily") {
        setSendingDaily(false);
      } else {
        setSendingWeekly(false);
      }
    },
    onError: (error, variables) => {
      toast.error("Send Failed", {
        description: error.message || "Failed to send digest. Please try again.",
      });
      if (variables.frequency === "daily") {
        setSendingDaily(false);
      } else {
        setSendingWeekly(false);
      }
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ frequency, enabled });
  };

  const handleSendDaily = () => {
    setSendingDaily(true);
    sendNowMutation.mutate({ frequency: "daily" });
  };

  const handleSendWeekly = () => {
    setSendingWeekly(true);
    sendNowMutation.mutate({ frequency: "weekly" });
  };

  if (authLoading || prefsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Email Digest Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure automated email digest reports with conference metrics and insights
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Digest Preferences
              </CardTitle>
              <CardDescription>
                Choose how often you want to receive email digest reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enabled" className="text-base font-medium">
                      Enable Email Digests
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive automated summary reports via email
                    </p>
                  </div>
                  <Switch
                    id="enabled"
                    checked={enabled}
                    onCheckedChange={setEnabled}
                  />
                </div>

                {enabled && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Frequency</Label>
                    <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as "daily" | "weekly" | "disabled")}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily" className="flex-1 cursor-pointer">
                          <div className="font-medium">Daily</div>
                          <div className="text-sm text-muted-foreground">
                            Receive a digest every day at 8:00 AM (Cairo time)
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                          <div className="font-medium">Weekly</div>
                          <div className="text-sm text-muted-foreground">
                            Receive a digest every Monday at 8:00 AM (Cairo time)
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Digest Now
              </CardTitle>
              <CardDescription>
                Manually trigger a digest email to test or get immediate insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div>
                    <h3 className="font-medium">Daily Digest</h3>
                    <p className="text-sm text-muted-foreground">
                      Last 24 hours of activity
                    </p>
                  </div>
                  <Button
                    onClick={handleSendDaily}
                    disabled={sendingDaily || sendNowMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {sendingDaily && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Send Daily Digest
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-muted-foreground">
                      Last 7 days of activity
                    </p>
                  </div>
                  <Button
                    onClick={handleSendWeekly}
                    disabled={sendingWeekly || sendNowMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {sendingWeekly && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Send Weekly Digest
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What's included in digests?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Registration and check-in statistics</li>
                  <li>• VIP attendee count and recent activities</li>
                  <li>• Category breakdown and trends</li>
                  <li>• Actionable insights and recommendations</li>
                  <li>• Recent registrations and check-ins</li>
                  <li>• Admin action summary</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
