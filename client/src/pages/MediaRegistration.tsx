import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Newspaper, Radio, Tv, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export default function MediaRegistration() {
  const [mediaType, setMediaType] = useState("");
  const [coverageType, setCoverageType] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerMutation = trpc.media.register.useMutation({
    onSuccess: () => {
      toast.success("تم التسجيل بنجاح - سيتم التواصل معكم قريباً");
      // Reset form
      setMediaType("");
      setCoverageType([]);
      setTeamMembers([]);
      setAgreedToTerms(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "فشل التسجيل - يرجى المحاولة مرة أخرى");
      setIsSubmitting(false);
    },
  });

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now().toString(),
        name: "",
        role: "",
        phone: "",
      },
    ]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const toggleCoverageType = (type: string) => {
    setCoverageType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error("يرجى الموافقة على الإقرار قبل التسجيل");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Validate required fields
    const organizationName = formData.get("organizationName") as string;
    const organizationType = formData.get("organizationType") as string;
    const fullName = formData.get("fullName") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!organizationName || !organizationType || !fullName || !jobTitle || !phone || !email) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (coverageType.length === 0) {
      toast.error("يرجى اختيار نوع التغطية");
      return;
    }

    setIsSubmitting(true);

    registerMutation.mutate({
      organizationName,
      organizationType: organizationType as "newspaper" | "news_website" | "tv_channel" | "radio",
      coverageType: coverageType[0] as "written" | "photo" | "video" | "live_broadcast",
      fullName,
      jobTitle,
      phone,
      email,
      pressCardNumber: formData.get("pressCardNumber") as string | undefined,
      teamMembers: teamMembers.filter(m => m.name && m.role && m.phone),
      agreementAccepted: agreedToTerms,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Media Registration | تسجيل التغطية الإعلامية
          </h1>
          <p className="text-lg text-muted-foreground">
            SCI 2026 Conference | مؤتمر SCI 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conference Information */}
          <Card>
            <CardHeader>
              <CardTitle>Conference Information | معلومات المؤتمر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Conference Name | اسم المؤتمر</Label>
                  <Input
                    value="Science at the Core of Innovation (SCI 2026)"
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label>Date | التاريخ</Label>
                  <Input value="April 7-8, 2026 | 7-8 أبريل 2026" disabled className="bg-muted" />
                </div>
              </div>
              <div>
                <Label>Venue | مكان الانعقاد</Label>
                <Input
                  value="Conference Hall - University Hostel, Cairo University | قاعة المؤتمرات - المدينة الجامعية، جامعة القاهرة"
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                Media Organization Information | بيانات الجهة الإعلامية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="org-name">
                  Organization Name | اسم الجهة الإعلامية <span className="text-destructive">*</span>
                </Label>
                <Input id="org-name" name="organizationName" required placeholder="أدخل اسم الجهة الإعلامية" />
              </div>

              <div>
                <Label htmlFor="media-type">
                  Media Type | نوع الجهة <span className="text-destructive">*</span>
                </Label>
                <Select value={mediaType} onValueChange={setMediaType} name="organizationType" required>
                  <SelectTrigger id="media-type">
                    <SelectValue placeholder="اختر نوع الجهة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newspaper">
                      <div className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4" />
                        Newspaper | صحيفة
                      </div>
                    </SelectItem>
                    <SelectItem value="news-website">
                      <div className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4" />
                        News Website | موقع إخباري
                      </div>
                    </SelectItem>
                    <SelectItem value="tv">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4" />
                        TV Channel | قناة تليفزيونية
                      </div>
                    </SelectItem>
                    <SelectItem value="radio">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4" />
                        Radio Station | إذاعة
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coverage Type | نوع التغطية <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { value: "written", label: "Written | مكتوبة" },
                    { value: "photo", label: "Photo | مصورة" },
                    { value: "video", label: "Video | فيديو" },
                    { value: "live", label: "Live Broadcast | بث مباشر" },
                  ].map((type) => (
                    <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={type.value}
                        checked={coverageType.includes(type.value)}
                        onCheckedChange={() => toggleCoverageType(type.value)}
                      />
                      <Label htmlFor={type.value} className="cursor-pointer font-normal">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journalist Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                Journalist/Reporter Information | بيانات الصحفي / الإعلامي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="journalist-name">
                  Full Name | الاسم بالكامل <span className="text-destructive">*</span>
                </Label>
                <Input id="journalist-name" name="fullName" required placeholder="أدخل الاسم بالكامل" />
              </div>

              <div>
                <Label htmlFor="position">
                  Position | الصفة الوظيفية <span className="text-destructive">*</span>
                </Label>
                <Input id="position" name="jobTitle" required placeholder="مثال: محرر، مراسل، مصور" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    Phone Number | رقم الهاتف <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+20 123 456 7890"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    Email | البريد الإلكتروني <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="id-number">
                  ID Card / Press Card Number | رقم البطاقة أو كارنيه النقابة
                </Label>
                <Input id="id-number" name="pressCardNumber" placeholder="اختياري" />
              </div>
            </CardContent>
          </Card>

          {/* Coverage Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Coverage Team | فريق التغطية</span>
                <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member | إضافة عضو
                </Button>
              </CardTitle>
              <CardDescription>
                Add team members if applicable | أضف أعضاء الفريق إن وجد
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No team members added | لم يتم إضافة أعضاء فريق
                </p>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={member.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Member {index + 1} | العضو {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeamMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Name | الاسم</Label>
                          <Input
                            value={member.name}
                            onChange={(e) =>
                              updateTeamMember(member.id, "name", e.target.value)
                            }
                            placeholder="الاسم"
                          />
                        </div>
                        <div>
                          <Label>Role | الصفة</Label>
                          <Input
                            value={member.role}
                            onChange={(e) =>
                              updateTeamMember(member.id, "role", e.target.value)
                            }
                            placeholder="الصفة"
                          />
                        </div>
                        <div>
                          <Label>Phone | رقم الهاتف</Label>
                          <Input
                            value={member.phone}
                            onChange={(e) =>
                              updateTeamMember(member.id, "phone", e.target.value)
                            }
                            placeholder="رقم الهاتف"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Declaration */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Declaration | إقرار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="cursor-pointer font-normal leading-relaxed">
                  أقر بصحة البيانات الواردة أعلاه، والالتزام بضوابط التغطية الإعلامية أثناء
                  انعقاد المؤتمر.
                  <br />
                  <span className="text-sm text-muted-foreground">
                    I confirm the accuracy of the information provided above and commit to
                    adhering to media coverage guidelines during the conference.
                  </span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button type="submit" size="lg" className="px-12">
              <Camera className="w-5 h-5 mr-2" />
              Submit Registration | تسجيل
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
