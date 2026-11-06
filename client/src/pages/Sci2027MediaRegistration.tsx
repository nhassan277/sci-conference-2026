import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import Sci2027RequestForm from "@/components/Sci2027RequestForm";

export default function Sci2027MediaRegistration() {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]" lang="en">
      <Sci2027Header />
      <main>
        <Sci2027RequestForm kind="media"
          eyebrow="SCI 2027 · Media registration"
          title="Bring the science to a wider audience."
          introduction="Journalists, photographers and media teams are invited to share their interest in covering SCI 2027 at Cairo University."
          detail="Tell us who you represent and the coverage you have in mind. This form starts a conversation with the conference team; it is not an attendance registration form."
          nextSteps={[
            "Send your contact details and intended coverage.",
            "Keep the reference shown after your request is received.",
            "The SCI 2027 team will review your request and contact you about next steps.",
          ]}
          successNotice="Receipt of this request is not media accreditation or approval. Any access or coverage arrangements must be confirmed separately by the SCI 2027 team."
        />
      </main>
      <Sci2027Footer />
    </div>
  );
}
