import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import Sci2027RequestForm from "@/components/Sci2027RequestForm";

export default function Sci2027SponsorRegistration() {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]" lang="en">
      <Sci2027Header />
      <main>
        <Sci2027RequestForm kind="sponsor"
          eyebrow="SCI 2027 · Sponsor & partner registration"
          title="Build a partnership around scientific impact."
          introduction="Connect your organization with the people and ideas shaping SCI 2027. Share your interest in sponsorship, in-kind support or a collaborative partnership."
          detail="Select the cooperation route you would like to explore, or choose Discuss options. Your selection is an expression of interest, not a package purchase or a financial commitment."
          nextSteps={[
            "Introduce your organization and the cooperation you are interested in.",
            "Keep the reference shown after your request is received.",
            "The SCI 2027 team will review your interests and contact you to discuss suitable options.",
          ]}
          successNotice="Receipt of this request is not sponsorship confirmation and does not create a charge or payment commitment. Any partnership, benefits or terms must be agreed separately with the SCI 2027 team."
        />
      </main>
      <Sci2027Footer />
    </div>
  );
}
