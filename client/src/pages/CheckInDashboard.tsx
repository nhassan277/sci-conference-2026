import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CheckInDashboard() {
  const { user, loading: authLoading, logout, login, isAuthenticated, isAdmin } = useUser();

  // Redirect if not admin
  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Staff Access Required</CardTitle>
            <CardDescription>
              This dashboard is for authorized staff only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Please log in with a staff account to continue.
                </p>
                <Button onClick={login} className="w-full">
                  Log In
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Your account does not have staff privileges. Please contact the system administrator.
                </p>
                <Button onClick={logout} variant="outline" className="w-full">
                  Log Out
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: stats, refetch: refetchStats } = trpc.checkin.stats.useQuery();
  const { data: recentCheckins, refetch: refetchRecent } = trpc.checkin.recentCheckins.useQuery({ limit: 20 });
  const { data: categoryBreakdown, refetch: refetchBreakdown } = trpc.checkin.categoryBreakdown.useQuery();

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      refetchRecent();
      refetchBreakdown();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetchStats, refetchRecent, refetchBreakdown]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      student: "Graduate & Postgraduate Students",
      faculty: "Faculty Members",
      researcher: "External Researchers",
      industry: "Industry Partners",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      student: "bg-blue-500",
      faculty: "bg-purple-500",
      researcher: "bg-green-500",
      industry: "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Check-In Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Auto-refreshes every 10 seconds
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.checkedIn || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats?.remaining || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Check-In Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.percentage || 0}%</div>
              <Progress value={stats?.percentage || 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Check-in status by attendee category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryBreakdown?.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(cat.category)}`} />
                      <span className="font-medium">{getCategoryLabel(cat.category)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {cat.checkedIn} / {cat.total}
                      </span>
                      <Badge variant="secondary">{cat.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={cat.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Check-Ins Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Check-Ins</CardTitle>
              <CardDescription>Live feed of latest check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recentCheckins && recentCheckins.length > 0 ? (
                  recentCheckins.map((checkin) => (
                    <div
                      key={checkin.id}
                      className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{checkin.fullNameEnglish}</div>
                        <div className="text-sm text-muted-foreground">{checkin.affiliation}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(checkin.attendeeCategory)}
                          </Badge>
                          {checkin.checkedInBy && (
                            <span className="text-xs text-muted-foreground">
                              by {checkin.checkedInBy}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {checkin.checkedInAt
                          ? formatDistanceToNow(new Date(checkin.checkedInAt), { addSuffix: true })
                          : "Unknown"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No check-ins yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
