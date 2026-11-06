import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => {
  const file = resolve(process.cwd(), "client/src", path);
  return existsSync(file) ? readFileSync(file, "utf8") : "";
};
const form = () => source("components/Sci2027RequestForm.tsx");
const media = () => source("pages/Sci2027MediaRegistration.tsx");
const sponsor = () => source("pages/Sci2027SponsorRegistration.tsx");

// Follow the existing SCI 2027 source-contract tests without adding a DOM dependency.
describe("SCI 2027 public request forms", () => {
  it("provides two default-export pages with the shared conference shell", () => {
    for (const [page, name, kind] of [
      [media(), "Sci2027MediaRegistration", "media"],
      [sponsor(), "Sci2027SponsorRegistration", "sponsor"],
    ]) {
      expect(page).toContain(`export default function ${name}`);
      expect(page).toContain("<Sci2027Header />");
      expect(page).toContain("<Sci2027Footer />");
      expect(page).toContain(`<Sci2027RequestForm kind="${kind}"`);
    }
  });

  it("uses shared validation, types and option lists instead of a second contract", () => {
    const code = form();
    for (const value of [
      "@shared/sci2027Requests", "mediaRequestSchema", "sponsorRequestSchema",
      "MediaRequestInput", "SponsorRequestInput", "coverageTypes", "cooperationTypes",
    ]) expect(code).toContain(value);
    expect(code).toContain("mediaRequestSchema.safeParse");
    expect(code).toContain("sponsorRequestSchema.safeParse");
    expect(code).toContain("options.map");
  });

  it("contains every required media and sponsor field with human-readable labels", () => {
    const code = form();
    for (const [name, label] of [
      ["fullName", "Full name"], ["email", "Email address"], ["phone", "Phone number"],
      ["organizationName", "Media organization"], ["jobTitle", "Job title"],
      ["coverageType", "Coverage type"], ["companyName", "Company / organization name"],
      ["contactPerson", "Contact person"], ["activitySector", "Activity sector"],
      ["cooperationType", "Cooperation type"],
    ]) {
      expect(code).toContain(`name: "${name}"`);
      expect(code).toContain(`label: "${label}"`);
    }
    expect(code).toContain("required={field.required}");
    expect(code).toContain("htmlFor={id}");
    expect(code).toContain("name={field.name}");
  });

  it("keeps website and notes optional, bounded and clearly described", () => {
    const code = form();
    expect(code).toMatch(/name: "website"[\s\S]*?required: false/);
    expect(code).toMatch(/name: "notes"[\s\S]*?required: false/);
    expect(code).toContain('type: "url"');
    expect(code).toContain("https://");
    expect(code).toContain("http://");
    expect(code).toContain("(optional)");
    expect(code).toContain("maxLength={field.maxLength}");
  });

  it("requires explicit processing and contact consent without marketing permission", () => {
    const code = form();
    expect(code).toContain("useState(false)");
    expect(code).toContain('name="consent"');
    expect(code).toContain('type="checkbox"');
    expect(code).toContain("process my request and contact me about it");
    expect(code).toContain("checked={consent}");
    expect(code).toContain("required");
    expect(code).not.toMatch(/subscribe|marketing|newsletter/i);
  });

  it("has an empty, non-focusable honeypot separate from the optional website", () => {
    const code = form();
    expect(code).toContain('contactWebsite: ""');
    expect(code).toContain('name="contactWebsite"');
    expect(code).toContain("tabIndex={-1}");
    expect(code).toContain('autoComplete="off"');
    expect(code).toContain('aria-hidden="true"');
  });

  it("keeps one UUID for retries and sends only parsed data to the dedicated mutations", () => {
    const code = form();
    expect(code).toContain("useState(() => crypto.randomUUID())");
    expect(code).toContain("trpc.sci2027Requests.submitMedia.useMutation()");
    expect(code).toContain("trpc.sci2027Requests.submitSponsor.useMutation()");
    expect(code).toContain("mediaMutation.mutateAsync(parsed.data)");
    expect(code).toContain("sponsorMutation.mutateAsync(parsed.data)");
    expect(code).toContain("submissionKey, consent");
    const catchBody = code.slice(code.indexOf("} catch {"), code.indexOf("} finally {"));
    expect(catchBody).toContain("setSubmitError");
    expect(catchBody).not.toContain("setValues");
    expect(catchBody).not.toContain("setSubmissionKey");
    expect(catchBody).not.toContain("setConsent");
    expect(code.match(/setSubmissionKey\(crypto.randomUUID\(\)\)/g)).toHaveLength(1);
  });

  it("associates inline errors and focuses invalid controls while allowing correction", () => {
    const code = form();
    expect(code).toContain("parsed.error.issues");
    expect(code).toContain("aria-invalid={Boolean(error)}");
    expect(code).toContain("aria-describedby={describedBy}");
    expect(code).toContain("`${id}-error`");
    expect(code).toContain('role="alert"');
    expect(code).toContain("focusInvalidField");
    expect(code).toContain("delete next[name]");
  });

  it("narrows native invalid targets to form controls before reading validation properties", () => {
    const code = form();
    const handler = code.slice(code.indexOf("function handleNativeInvalid("), code.indexOf("async function handleSubmit("));
    expect(handler).not.toMatch(/event\.target\s+as\s/);
    for (const type of ["HTMLInputElement", "HTMLSelectElement", "HTMLTextAreaElement"]) {
      expect(handler).toContain(`control instanceof ${type}`);
      expect(handler.indexOf(`control instanceof ${type}`)).toBeLessThan(handler.indexOf("control.name"));
    }
    expect(handler).toContain('control.name === "contactWebsite"');
    expect(handler).toContain("control.validationMessage");
  });

  it("disables the form while pending and guards rapid duplicate submissions", () => {
    const code = form();
    expect(code).toContain("mediaMutation.isPending");
    expect(code).toContain("sponsorMutation.isPending");
    expect(code).toContain("if (pending || inFlight.current || reference) return");
    expect(code).toContain("disabled={pending}");
    expect(code).toContain("aria-busy={pending}");
    expect(code).toContain("Submitting request");
  });

  it("shows a persistent receipt/reference rather than approval or a payment commitment", () => {
    const code = form();
    expect(code).toContain("setReference(result.reference)");
    expect(code).toContain('role="status"');
    expect(code).toContain("Request received");
    expect(code).toContain("{reference}");
    expect(code).toContain("Submit another request");
    expect(code).toContain("onClick={startAnotherRequest}");
    expect(code).not.toMatch(/setTimeout|setInterval/);
    expect(media()).toContain("not media accreditation or approval");
    expect(sponsor()).toContain("not sponsorship confirmation");
    expect(sponsor()).toContain("does not create a charge or payment commitment");
  });

  it("uses the responsive navy/gold editorial layout and English-only copy", () => {
    const files = [form(), media(), sponsor()];
    expect(form()).toContain("lg:grid-cols-[0.82fr_1.18fr]");
    expect(form()).toContain("bg-[#062f52]");
    expect(form()).toContain("text-[#f0ca57]");
    for (const code of files) {
      expect(code).not.toMatch(/[\u0600-\u06ff]/);
      expect(code).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
      expect(code).not.toMatch(/type="file"|createCheckoutSession|mailto:|fetch\(/);
      expect(code).not.toContain("<img");
    }
  });
});
