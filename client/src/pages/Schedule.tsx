import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

const PROGRAM_PDF_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/program_final_226b1f90.pdf";

export default function Schedule() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Page header */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 border-b">
        <div className="container py-14 md:py-20 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Conference Program</h1>
          </div>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">برنامج المؤتمر</p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            April 7–8, 2026 · Faculty of Science, Cairo University
          </p>
          <p className="text-base text-muted-foreground" dir="rtl">
            ٧–٨ أبريل ٢٠٢٦ · كلية العلوم، جامعة القاهرة
          </p>
        </div>
      </section>

      {/* Download section */}
      <section className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* PDF icon */}
          <div className="flex justify-center">
            <div className="w-28 h-28 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-lg">
              <FileText className="w-14 h-14 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">SCI 2026 — Full Program</h2>
            <p className="text-muted-foreground">
              Download the complete conference schedule including all sessions, keynote speakers, workshops, and venue details.
            </p>
            <p className="text-muted-foreground text-sm" dir="rtl">
              حمّل البرنامج الكامل للمؤتمر بما يشمل جميع الجلسات والمتحدثين الرئيسيين والورش والتفاصيل اللوجستية.
            </p>
          </div>

          {/* Download button */}
          <a href={PROGRAM_PDF_URL} download="SCI2026-Program.pdf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-3 text-lg px-10 py-6 bg-primary hover:bg-primary/90 shadow-md">
              <Download className="w-5 h-5" />
              Download Program PDF · تحميل البرنامج
            </Button>
          </a>

          {/* Preview link */}
          <p className="text-sm text-muted-foreground">
            Or{" "}
            <a
              href={PROGRAM_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              view it in your browser
            </a>
            {" "}without downloading.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
