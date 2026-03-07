import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { trpc } from "@/lib/trpc";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Camera, BarChart3, User } from "lucide-react";
import { toast } from "sonner";

export default function CheckIn() {
  const { user, loading: authLoading, logout, login, isAuthenticated, isAdmin } = useUser();

  // Redirect if not admin
  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Staff Access Required</CardTitle>
            <CardDescription>
              This check-in system is for authorized staff only.
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [scannedRegistration, setScannedRegistration] = useState<any>(null);
  const [lastScannedId, setLastScannedId] = useState<number | null>(null);

  const { data: stats, refetch: refetchStats } = trpc.checkin.stats.useQuery();
  const lookupMutation = trpc.checkin.lookup.useMutation();
  const checkInMutation = trpc.checkin.markCheckedIn.useMutation();

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;

    if (isScanning && videoRef.current) {
      codeReader = new BrowserMultiFormatReader();

      codeReader
        .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            const text = result.getText();
            const registrationId = parseInt(text, 10);

            if (!isNaN(registrationId) && registrationId !== lastScannedId) {
              setLastScannedId(registrationId);
              handleScan(registrationId);
            }
          }
        })
        .catch((err) => {
          console.error("Error starting video:", err);
          toast.error("Failed to access camera. Please check permissions.");
        });
    }

    return () => {
      if (codeReader) {
        codeReader.reset();
      }
    };
  }, [isScanning, lastScannedId]);

  const handleScan = async (registrationId: number) => {
    try {
      const registration = await lookupMutation.mutateAsync({ registrationId });
      setScannedRegistration(registration);

      if (registration.checkedIn) {
        toast.warning(`Already checked in at ${new Date(registration.checkedInAt!).toLocaleString()}`);
      } else {
        toast.success("Registration found! Click 'Check In' to confirm.");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration not found");
      setScannedRegistration(null);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedRegistration || !staffName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await checkInMutation.mutateAsync({
        registrationId: scannedRegistration.id,
        staffName: staffName.trim(),
      });

      toast.success(`${scannedRegistration.fullNameEnglish} checked in successfully!`);
      setScannedRegistration(null);
      setLastScannedId(null);
      refetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to check in");
    }
  };

  const startScanning = () => {
    if (!staffName.trim()) {
      toast.error("Please enter your name first");
      return;
    }
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setLastScannedId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Event Check-In</h1>
              <p className="text-sm text-muted-foreground">SCI 2026 Conference</p>
            </div>
            {stats && (
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{stats.checkedIn}/{stats.total}</p>
                  <p className="text-xs text-muted-foreground">{stats.percentage}% checked in</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                Scan attendee badges to check them in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Staff Name Input */}
              {!isScanning && (
                <div className="space-y-2">
                  <Label htmlFor="staffName">Your Name (Staff)</Label>
                  <Input
                    id="staffName"
                    placeholder="Enter your name"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                  />
                </div>
              )}

              {/* Video Preview */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {isScanning ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 border-4 border-primary/50 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/80" />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Camera not active</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanner Controls */}
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startScanning} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Button>
                ) : (
                  <Button onClick={stopScanning} variant="outline" className="flex-1">
                    Stop Scanning
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Registration Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Attendee Information
              </CardTitle>
              <CardDescription>
                Details will appear after scanning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scannedRegistration ? (
                <div className="space-y-4">
                  {/* Check-in Status */}
                  {scannedRegistration.checkedIn ? (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Already Checked In</p>
                        <p className="text-sm text-green-700">
                          {new Date(scannedRegistration.checkedInAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">
                          By: {scannedRegistration.checkedInBy}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-900">Ready to Check In</p>
                        <p className="text-sm text-blue-700">Click the button below to confirm</p>
                      </div>
                    </div>
                  )}

                  {/* Attendee Details */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name (English)</Label>
                      <p className="font-semibold">{scannedRegistration.fullNameEnglish}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Name (Arabic)</Label>
                      <p className="font-semibold" dir="rtl">{scannedRegistration.fullNameArabic}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p>{scannedRegistration.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p>{scannedRegistration.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Affiliation</Label>
                      <p>{scannedRegistration.affiliation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{scannedRegistration.attendeeCategory}</Badge>
                      <Badge variant="outline">{scannedRegistration.participationType}</Badge>
                      {scannedRegistration.wantsCertificate && (
                        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-200">
                          Certificate
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Check-in Button */}
                  {!scannedRegistration.checkedIn && (
                    <Button
                      onClick={handleCheckIn}
                      className="w-full"
                      disabled={checkInMutation.isPending}
                    >
                      {checkInMutation.isPending ? "Checking in..." : "Confirm Check-In"}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <XCircle className="w-16 h-16 mb-4 opacity-20" />
                  <p>No registration scanned yet</p>
                  <p className="text-sm">Scan a QR code to view attendee details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Card */}
        {stats && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Check-In Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.checkedIn}</p>
                  <p className="text-sm text-muted-foreground">Checked In</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{stats.remaining}</p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
