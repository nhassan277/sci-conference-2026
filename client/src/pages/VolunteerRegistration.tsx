import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Users, Calendar, Heart } from "lucide-react";

const COMMITTEES = [
  {
    id: "hall_organization",
    name: "Conference Hall Organization",
    nameAr: "لجنة التنظيم داخل القاعات",
    count: 10,
    description: "Manage sessions and assist speakers in conference halls",
  },
  {
    id: "reception",
    name: "Reception and Registration",
    nameAr: "لجنة الاستقبال والتسجيل",
    count: 10,
    description: "Welcome participants, distribute ID badges and certificates",
  },
  {
    id: "logistics",
    name: "Logistics and Field Tasks",
    nameAr: "لجنة المشاوير والمهام الميدانية",
    count: 5,
    description: "Handle deliveries and field coordination (Year 3-4 preferred)",
  },
  {
    id: "marketing",
    name: "Publications and Marketing",
    nameAr: "لجنة المطبوعات والتسويق",
    count: 8,
    description: "Design materials, manage social media, photography",
  },
  {
    id: "hospitality",
    name: "Main Entrance Hospitality",
    nameAr: "لجنة الاستقبال والضيافة",
    count: 10,
    description: "Guide guests from university gate to conference halls",
  },
  {
    id: "technical",
    name: "Technical Support",
    nameAr: "لجنة الدعم التقني",
    count: 5,
    description: "Manage projectors, computers, and technical equipment",
  },
  {
    id: "catering",
    name: "Catering and Refreshments",
    nameAr: "لجنة الضيافة والمرطبات",
    count: 10,
    description: "Serve refreshments during coffee breaks (Year 1-2 preferred)",
  },
  {
    id: "scientific",
    name: "Scientific Coordination",
    nameAr: "لجنة التنسيق العلمي",
    count: 5,
    description: "Format abstracts and prepare abstract book (Year 3-4)",
  },
  {
    id: "posters",
    name: "Poster Session",
    nameAr: "لجنة الملصقات العلمية",
    count: 4,
    description: "Organize and manage poster presentations",
  },
];

export default function VolunteerRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    academicYear: "",
    department: "",
    preferredCommittee: "",
    secondChoiceCommittee: "",
    skills: "",
    previousExperience: "",
    availability: {
      day1: false,
      day2: false,
      beforeConference: false,
    },
    whyVolunteer: "",
  });

  const submitMutation = trpc.volunteers.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application Submitted!", {
        description: "Thank you for volunteering! We will review your application and contact you soon.",
      });
    },
    onError: (error) => {
      toast.error("Submission Failed", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.studentId) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!formData.academicYear || !formData.department || !formData.preferredCommittee) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!formData.availability.day1 && !formData.availability.day2 && !formData.availability.beforeConference) {
      toast.error("Availability Required", {
        description: "Please select at least one availability option",
      });
      return;
    }

    if (formData.whyVolunteer.length < 10) {
      toast.error("More Information Needed", {
        description: "Please tell us more about why you want to volunteer (minimum 10 characters)",
      });
      return;
    }

    submitMutation.mutate(formData as any);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12">
        <div className="container max-w-2xl">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-800">Application Submitted Successfully!</CardTitle>
              <CardDescription className="text-lg text-green-700" dir="rtl">
                تم تقديم طلبك بنجاح!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-base">
                Thank you for your interest in volunteering for the SCI 2026 Conference! We have received your
                application and will review it carefully.
              </p>
              <p className="text-base" dir="rtl">
                شكراً لاهتمامك بالتطوع في مؤتمر SCI 2026! لقد استلمنا طلبك وسنقوم بمراجعته بعناية.
              </p>
              <p className="text-base font-semibold">
                We will contact you via email at <span className="text-primary">{formData.email}</span> with further
                details.
              </p>
              <div className="pt-4">
                <Button onClick={() => (window.location.href = "/")} size="lg">
                  Return to Homepage | العودة للصفحة الرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Volunteer Registration</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">
            التسجيل كمتطوع
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Join us in making SCI 2026 a success! Be part of the organizing team.
          </p>
          <p className="text-base text-muted-foreground" dir="rtl">
            انضم إلينا لإنجاح مؤتمر SCI 2026! كن جزءاً من الفريق المنظم.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Networking</h3>
              <p className="text-sm text-muted-foreground">Connect with researchers and industry professionals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Experience</h3>
              <p className="text-sm text-muted-foreground">Gain valuable event organization experience</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Certificates</h3>
              <p className="text-sm text-muted-foreground">Receive volunteer and attendance certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Application Form</CardTitle>
            <CardDescription>Please fill in all required fields marked with *</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information | المعلومات الشخصية</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">
                      Full Name * <span className="text-xs text-muted-foreground">(As in ID)</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ahmed Mohamed Ali"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ahmed@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20 1234567890"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="12345678"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="academicYear">Academic Year *</Label>
                    <Select value={formData.academicYear} onValueChange={(value) => setFormData({ ...formData, academicYear: value })}>
                      <SelectTrigger id="academicYear">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Year 1 | السنة الأولى</SelectItem>
                        <SelectItem value="2">Year 2 | السنة الثانية</SelectItem>
                        <SelectItem value="3">Year 3 | السنة الثالثة</SelectItem>
                        <SelectItem value="4">Year 4 | السنة الرابعة</SelectItem>
                        <SelectItem value="graduate">Graduate Student | طالب دراسات عليا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Biotechnology, Chemistry"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Committee Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Committee Selection | اختيار اللجنة</h3>

                <div>
                  <Label htmlFor="preferredCommittee">Preferred Committee * | اللجنة المفضلة</Label>
                  <Select
                    value={formData.preferredCommittee}
                    onValueChange={(value) => setFormData({ ...formData, preferredCommittee: value })}
                  >
                    <SelectTrigger id="preferredCommittee">
                      <SelectValue placeholder="Select your first choice" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMITTEES.map((committee) => (
                        <SelectItem key={committee.id} value={committee.id}>
                          {committee.name} ({committee.count} needed) - {committee.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.preferredCommittee && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {COMMITTEES.find((c) => c.id === formData.preferredCommittee)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="secondChoiceCommittee">Second Choice Committee (Optional) | اللجنة الثانية</Label>
                  <Select
                    value={formData.secondChoiceCommittee}
                    onValueChange={(value) => setFormData({ ...formData, secondChoiceCommittee: value })}
                  >
                    <SelectTrigger id="secondChoiceCommittee">
                      <SelectValue placeholder="Select your second choice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {COMMITTEES.filter((c) => c.id !== formData.preferredCommittee).map((committee) => (
                        <SelectItem key={committee.id} value={committee.id}>
                          {committee.name} - {committee.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skills and Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Skills & Experience | المهارات والخبرة</h3>

                <div>
                  <Label htmlFor="skills">
                    Skills (Optional) <span className="text-xs text-muted-foreground">(e.g., Photoshop, English, Public Speaking)</span>
                  </Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="List any relevant skills..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="previousExperience">Previous Volunteer Experience (Optional)</Label>
                  <Textarea
                    id="previousExperience"
                    value={formData.previousExperience}
                    onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                    placeholder="Have you volunteered before? Tell us about it..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Availability * | التوفر</h3>
                <p className="text-sm text-muted-foreground">Please select when you are available to volunteer:</p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="day1"
                      checked={formData.availability.day1}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          availability: { ...formData.availability, day1: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="day1" className="font-normal cursor-pointer">
                      Day 1 - April 7, 2026 (8:00 AM - 6:00 PM) | اليوم الأول - 7 أبريل 2026
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="day2"
                      checked={formData.availability.day2}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          availability: { ...formData.availability, day2: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="day2" className="font-normal cursor-pointer">
                      Day 2 - April 8, 2026 (8:00 AM - 7:00 PM) | اليوم الثاني - 8 أبريل 2026
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="beforeConference"
                      checked={formData.availability.beforeConference}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          availability: { ...formData.availability, beforeConference: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="beforeConference" className="font-normal cursor-pointer">
                      Before Conference (Preparation days) | قبل المؤتمر (أيام التحضير)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Why Volunteer */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Motivation | الدافع</h3>

                <div>
                  <Label htmlFor="whyVolunteer">Why do you want to volunteer? * | لماذا تريد التطوع؟</Label>
                  <Textarea
                    id="whyVolunteer"
                    value={formData.whyVolunteer}
                    onChange={(e) => setFormData({ ...formData, whyVolunteer: e.target.value })}
                    placeholder="Tell us what motivates you to volunteer for this conference..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimum 10 characters</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button type="submit" size="lg" disabled={submitMutation.isPending} className="w-full md:w-auto px-12">
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application | تقديم الطلب"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">What You'll Receive | ما ستحصل عليه</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ Official volunteer certificate from Cairo University</p>
            <p>✅ Conference attendance certificate (100 hours of continuing education)</p>
            <p>✅ Conference bag with materials and gifts</p>
            <p>✅ Free meals during conference days</p>
            <p>✅ Volunteer t-shirt (if available)</p>
            <p>✅ Networking opportunities with researchers and companies</p>
            <p>✅ Valuable event organization experience</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
