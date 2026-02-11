import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Upload, FileText, Image, Presentation } from "lucide-react";
import { Link } from "wouter";

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB

const sponsorMaterialsSchema = z.object({
  sponsorshipId: z.string().min(1, "Sponsorship ID is required"),
  companyDescription: z.string().min(10, "Please provide a brief company description (at least 10 characters)"),
  logo: z.instanceof(FileList).optional(),
  banner: z.instanceof(FileList).optional(),
  brochure: z.instanceof(FileList).optional(),
  workshopMaterials: z.instanceof(FileList).optional(),
});

type SponsorMaterialsForm = z.infer<typeof sponsorMaterialsSchema>;

export default function SponsorDashboard() {
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadMaterials = trpc.sponsorship.uploadMaterials.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SponsorMaterialsForm>({
    resolver: zodResolver(sponsorMaterialsSchema),
  });

  const onSubmit = async (data: SponsorMaterialsForm) => {
    setUploading(true);
    try {
      // Convert files to base64 for upload
      const logo = data.logo?.[0];
      const banner = data.banner?.[0];
      const brochure = data.brochure?.[0];
      const workshopMaterials = data.workshopMaterials?.[0];

      const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const uploadData = {
        sponsorshipId: parseInt(data.sponsorshipId),
        companyDescription: data.companyDescription,
        logo: logo ? { data: await toBase64(logo), name: logo.name, type: logo.type } : undefined,
        banner: banner ? { data: await toBase64(banner), name: banner.name, type: banner.type } : undefined,
        brochure: brochure ? { data: await toBase64(brochure), name: brochure.name, type: brochure.type } : undefined,
        workshopMaterials: workshopMaterials ? { data: await toBase64(workshopMaterials), name: workshopMaterials.name, type: workshopMaterials.type } : undefined,
      };

      await uploadMaterials.mutateAsync(uploadData);
      setSubmitted(true);
      toast.success("Materials uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload materials. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Materials Uploaded!</CardTitle>
            <CardDescription className="text-base" dir="rtl">
              تم رفع المواد بنجاح!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Your sponsorship materials have been uploaded successfully. Our team will review them and contact you if any changes are needed.
            </p>
            <p className="text-muted-foreground" dir="rtl">
              تم رفع مواد الرعاية بنجاح. سيقوم فريقنا بمراجعتها والتواصل معك إذا كانت هناك حاجة لأي تغييرات.
            </p>
            <Link href="/">
              <Button className="w-full">Return to Home | العودة للصفحة الرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Faculty of Science</p>
              </div>
            </div>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      <div className="container py-12 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Sponsor Materials Upload</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">رفع مواد الرعاية</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your company materials to be featured at the conference
          </p>
          <p className="text-lg text-muted-foreground" dir="rtl">
            قم برفع مواد شركتك لعرضها في المؤتمر
          </p>
        </div>

        {/* Upload Form */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upload Your Materials</CardTitle>
              <CardDescription className="text-base" dir="rtl">
                قم برفع موادك
              </CardDescription>
              <CardDescription className="text-sm text-muted-foreground mt-2">
                Maximum file size: 16MB per file. Accepted formats: JPG, PNG, PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sponsorshipId">Sponsorship ID | رقم الرعاية *</Label>
                  <Input
                    id="sponsorshipId"
                    {...register("sponsorshipId")}
                    placeholder="Enter your sponsorship ID (provided in confirmation email)"
                  />
                  {errors.sponsorshipId && (
                    <p className="text-sm text-red-500">{errors.sponsorshipId.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    You received this ID in your sponsorship confirmation email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyDescription">Company Description | وصف الشركة *</Label>
                  <Textarea
                    id="companyDescription"
                    {...register("companyDescription")}
                    placeholder="Brief description of your company and products/services"
                    rows={4}
                  />
                  {errors.companyDescription && (
                    <p className="text-sm text-red-500">{errors.companyDescription.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Company Logo | شعار الشركة
                    </Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/jpeg,image/png"
                      {...register("logo")}
                    />
                    <p className="text-xs text-muted-foreground">
                      High-resolution logo (PNG or JPG)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner" className="flex items-center gap-2">
                      <Presentation className="w-4 h-4" />
                      Promotional Banner | بانر ترويجي
                    </Label>
                    <Input
                      id="banner"
                      type="file"
                      accept="image/jpeg,image/png"
                      {...register("banner")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Banner for website and conference materials
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brochure" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Company Brochure | كتيب الشركة
                    </Label>
                    <Input
                      id="brochure"
                      type="file"
                      accept="application/pdf"
                      {...register("brochure")}
                    />
                    <p className="text-xs text-muted-foreground">
                      PDF brochure for distribution
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workshopMaterials" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Workshop Materials | مواد الورشة
                    </Label>
                    <Input
                      id="workshopMaterials"
                      type="file"
                      accept="application/pdf"
                      {...register("workshopMaterials")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Materials for your workshop session (Platinum only)
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Important Notes | ملاحظات مهمة</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>All files will be reviewed by our team before publication</li>
                    <li>Maximum file size is 16MB per file</li>
                    <li>High-resolution images are recommended for best quality</li>
                    <li>Workshop materials are only for Platinum sponsors</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading... | جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Materials | رفع المواد
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
