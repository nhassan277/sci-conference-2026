import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type InvalidEvent } from "react";
import { Link } from "wouter";
import {
  cooperationTypes,
  coverageTypes,
  mediaRequestSchema,
  sponsorRequestSchema,
  type MediaRequestInput,
  type SponsorRequestInput,
} from "@shared/sci2027Requests";
import { sci2027Content } from "@/data/sci2027Content";
import { trpc } from "@/lib/trpc";

type RequestKind = "media" | "sponsor";
type FieldName = Exclude<
  keyof MediaRequestInput | keyof SponsorRequestInput,
  "submissionKey" | "consent" | "contactWebsite"
>;
type FormValues = Record<FieldName, string> & { contactWebsite: string };
type FieldErrors = Partial<Record<FieldName | "consent" | "contactWebsite" | "submissionKey", string>>;
type RequestField = {
  name: FieldName;
  label: string;
  required: boolean;
  type?: "text" | "email" | "tel" | "url" | "select" | "textarea";
  autoComplete?: string;
  maxLength?: number;
  options?: readonly string[];
  hint?: string;
  fullWidth?: boolean;
};

type Sci2027RequestFormProps = {
  kind: RequestKind;
  eyebrow: string;
  title: string;
  introduction: string;
  detail: string;
  nextSteps: readonly string[];
  successNotice: string;
};

const jobTitleField: RequestField = {
  name: "jobTitle", label: "Job title", required: true,
  autoComplete: "organization-title", maxLength: 150,
};
const contactFields: RequestField[] = [
  { name: "email", label: "Email address", required: true, type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone number", required: true, type: "tel", autoComplete: "tel", maxLength: 40, hint: "Include your country code." },
];
const optionalFields: RequestField[] = [
  { name: "website", label: "Website", required: false, type: "url", autoComplete: "url", maxLength: 500, fullWidth: true, hint: "Use a complete http:// or https:// address." },
  { name: "notes", label: "Additional notes", required: false, type: "textarea", maxLength: 2000, fullWidth: true, hint: "Share relevant plans, interests or questions. Please do not include sensitive personal information." },
];
const mediaFields: RequestField[] = [
  { name: "fullName", label: "Full name", required: true, autoComplete: "name", maxLength: 150 },
  jobTitleField,
  ...contactFields,
  { name: "organizationName", label: "Media organization", required: true, autoComplete: "organization", maxLength: 200, fullWidth: true },
  { name: "coverageType", label: "Coverage type", required: true, type: "select", options: coverageTypes, fullWidth: true },
  ...optionalFields,
];
const sponsorFields: RequestField[] = [
  { name: "companyName", label: "Company / organization name", required: true, autoComplete: "organization", maxLength: 200, fullWidth: true },
  { name: "contactPerson", label: "Contact person", required: true, autoComplete: "name", maxLength: 150 },
  jobTitleField,
  ...contactFields,
  { name: "activitySector", label: "Activity sector", required: true, maxLength: 200, fullWidth: true },
  { name: "cooperationType", label: "Cooperation type", required: true, type: "select", options: cooperationTypes, fullWidth: true },
  ...optionalFields,
];

function emptyValues(): FormValues {
  return {
    fullName: "", organizationName: "", coverageType: "", companyName: "",
    contactPerson: "", activitySector: "", cooperationType: "", jobTitle: "",
    email: "", phone: "", website: "", notes: "", contactWebsite: "",
  };
}

const controlClassName = "block min-h-12 w-full rounded-none border border-[#063760]/25 bg-[#fffdf8] px-3.5 py-3 text-base text-[#17374f] transition-colors placeholder:text-[#617986] focus:border-[#ad8618] focus:outline-none focus:ring-2 focus:ring-[#d3a725]/30 aria-invalid:border-red-700 aria-invalid:bg-red-50/40 disabled:cursor-wait disabled:opacity-60";

export default function Sci2027RequestForm({
  kind, eyebrow, title, introduction, detail, nextSteps, successNotice,
}: Sci2027RequestFormProps) {
  const fields = kind === "media" ? mediaFields : sponsorFields;
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [consent, setConsent] = useState(false);
  const [submissionKey, setSubmissionKey] = useState(() => crypto.randomUUID());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const mediaMutation = trpc.sci2027Requests.submitMedia.useMutation();
  const sponsorMutation = trpc.sci2027Requests.submitSponsor.useMutation();
  const pending = mediaMutation.isPending || sponsorMutation.isPending;
  const prefix = `sci2027-${kind}`;

  useEffect(() => {
    if (reference) receiptRef.current?.focus();
  }, [reference]);

  function clearFieldError(name: keyof FieldErrors) {
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }

  function focusInvalidField(nextErrors: FieldErrors) {
    const name = [...fields.map((field) => field.name), "consent" as const]
      .find((fieldName) => nextErrors[fieldName]);
    if (name) {
      const control = formRef.current?.elements.namedItem(name);
      if (control instanceof HTMLElement) control.focus();
    }
  }

  function showSchemaErrors(issues: readonly { path: readonly PropertyKey[]; message: string }[]) {
    const nextErrors: FieldErrors = {};
    for (const issue of issues) {
      const name = issue.path[0] as keyof FieldErrors | undefined;
      if (name && !nextErrors[name]) {
        nextErrors[name] = name === "consent"
          ? "Please agree to processing and contact so we can handle your request."
          : issue.message;
      }
    }
    setErrors(nextErrors);
    if (nextErrors.contactWebsite || nextErrors.submissionKey || !Object.keys(nextErrors).length) {
      setSubmitError("We could not validate this request. Please check your details and try again.");
    }
    focusInvalidField(nextErrors);
  }

  function handleNativeInvalid(event: InvalidEvent<HTMLFormElement>) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return;
    if (!control.name || control.name === "contactWebsite") return;
    const name = control.name as keyof FieldErrors;
    setErrors((previous) => ({
      ...previous,
      [name]: name === "consent"
        ? "Please agree to processing and contact so we can handle your request."
        : control.validationMessage,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || inFlight.current || reference) return;
    setSubmitError("");
    setErrors({});
    // Select only this form's fields; the shared schema trims and validates the payload.
    const payload = {
      ...Object.fromEntries(fields.map((field) => [field.name, values[field.name]])),
      submissionKey, consent, contactWebsite: values.contactWebsite,
    };
    inFlight.current = true;
    try {
      let result: { success: true; reference: string };
      if (kind === "media") {
        const parsed = mediaRequestSchema.safeParse(payload);
        if (!parsed.success) {
          showSchemaErrors(parsed.error.issues);
          return;
        }
        result = await mediaMutation.mutateAsync(parsed.data);
      } else {
        const parsed = sponsorRequestSchema.safeParse(payload);
        if (!parsed.success) {
          showSchemaErrors(parsed.error.issues);
          return;
        }
        result = await sponsorMutation.mutateAsync(parsed.data);
      }
      setReference(result.reference);
    } catch {
      // Keep the key, consent and all inputs intact: retry safely after a lost response.
      setSubmitError("We could not confirm receipt of your request. Your details are still here. Please try again; retrying will not create a duplicate request.");
    } finally {
      inFlight.current = false;
    }
  }

  function startAnotherRequest() {
    setSubmissionKey(crypto.randomUUID());
    setValues(emptyValues());
    setConsent(false);
    setErrors({});
    setSubmitError("");
    setReference("");
    mediaMutation.reset();
    sponsorMutation.reset();
    requestAnimationFrame(() => {
      const firstControl = formRef.current?.elements.namedItem(fields[0].name);
      if (firstControl instanceof HTMLElement) firstControl.focus();
    });
  }

  return (
    <section className="container py-8 sm:py-12 lg:py-16" aria-labelledby={`${prefix}-title`}>
      <div className="grid items-start gap-0 border border-[#063760]/15 shadow-[0_20px_60px_rgba(6,47,82,0.06)] lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="relative isolate overflow-hidden bg-[#062f52] px-6 py-10 text-white sm:px-9 sm:py-12 lg:min-h-[780px] lg:px-10 lg:py-14">
          <div className="sci-network pointer-events-none absolute inset-0 -z-10 opacity-35" aria-hidden="true" />
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#f0ca57] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0ca57]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to SCI 2027
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">{eyebrow}</p>
          <h1 id={`${prefix}-title`} className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{title}</h1>
          <div className="mt-7 h-1 w-14 bg-[#e5bd4a]" aria-hidden="true" />
          <p className="mt-7 text-lg leading-8 text-[#d5e0e6]">{introduction}</p>
          <p className="mt-5 text-sm leading-7 text-[#b9ccd7]">{detail}</p>
          <div className="mt-10 border-t border-white/20 pt-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0ca57]">What happens next</h2>
            <ol className="mt-5 space-y-5">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-4 text-sm leading-6 text-[#d5e0e6]">
                  <span className="mt-0.5 shrink-0 font-serif text-xl text-[#f0ca57]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-10 border-t border-white/20 pt-7 text-xs leading-6 text-[#b9ccd7]">
            <p className="font-bold uppercase tracking-[0.12em] text-[#f0ca57]">{sci2027Content.identity.dates.en}</p>
            <p className="mt-1">{sci2027Content.identity.location.name}</p>
          </div>
        </aside>

        <div className="min-w-0 bg-white px-6 py-9 sm:p-9 lg:px-11 lg:py-12">
          {reference ? (
            <div ref={receiptRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className="border-t-4 border-[#d3a725] bg-[#edf4f3] p-6 outline-none focus-visible:ring-2 focus-visible:ring-[#ad8618] sm:p-8">
              <CheckCircle2 className="h-10 w-10 text-[#0d638b]" aria-hidden="true" />
              <p className="mt-6 sci-eyebrow">SCI 2027 · Request receipt</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#063760]">Request received</h2>
              <p className="mt-5 text-base leading-7 text-[#35536a]">Thank you. The SCI 2027 team will review your request and contact you to follow up.</p>
              <div className="mt-7 border-y border-[#063760]/15 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#35536a]">Your reference</p>
                <p className="mt-2 break-all font-mono text-lg font-bold text-[#063760]">{reference}</p>
                <p className="mt-2 text-sm leading-6 text-[#456374]">Please keep this reference for any follow-up about your request.</p>
              </div>
              <p className="mt-6 text-sm leading-7 text-[#35536a]">{successNotice}</p>
              <button type="button" onClick={startAnotherRequest} className="mt-8 inline-flex min-h-12 items-center justify-center border border-[#063760] px-5 py-3 text-sm font-bold text-[#063760] transition-colors hover:bg-[#063760] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad8618]">Submit another request</button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} onInvalid={handleNativeInvalid} aria-busy={pending} aria-labelledby={`${prefix}-form-title`}>
              <p className="sci-eyebrow">Your request</p>
              <h2 id={`${prefix}-form-title`} className="mt-3 font-serif text-3xl font-bold leading-tight text-[#063760]">{kind === "media" ? "Tell us about your coverage." : "Start a partnership conversation."}</h2>
              <p className="mt-4 text-sm leading-6 text-[#617986]">Fields marked <span className="font-bold text-[#063760]">*</span> are required. Website and additional notes are optional.</p>
              {Object.keys(errors).length > 0 && <p role="alert" className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">Please check the highlighted fields before submitting.</p>}
              <fieldset disabled={pending} className="mt-8 min-w-0 border-0 p-0">
                <legend className="sr-only">{kind === "media" ? "Media request details" : "Sponsor and partner request details"}</legend>
                <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
                  {fields.map((field) => {
                    const id = `${prefix}-${field.name}`;
                    const error = errors[field.name];
                    const describedBy = [field.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
                    const options = field.options ?? [];
                    const common = {
                      id, name: field.name, value: values[field.name], required: field.required,
                      "aria-invalid": Boolean(error), "aria-describedby": describedBy,
                      className: controlClassName,
                      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                        setValues((previous) => ({ ...previous, [field.name]: event.target.value }));
                        clearFieldError(field.name);
                      },
                    };
                    return (
                      <div key={field.name} className={field.fullWidth ? "min-w-0 sm:col-span-2" : "min-w-0"}>
                        <label htmlFor={id} className="mb-2 block text-sm font-bold text-[#063760]">
                          {field.label}{field.required ? <><span className="ml-1 text-[#906d0b]" aria-hidden="true">*</span><span className="sr-only"> (required)</span></> : <span className="ml-1 font-normal text-[#617986]">(optional)</span>}
                        </label>
                        {field.type === "select" ? (
                          <select {...common} required={field.required} name={field.name} aria-invalid={Boolean(error)} aria-describedby={describedBy}>
                            <option value="" disabled>Select {field.label.toLowerCase()}</option>
                            {options.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea {...common} rows={5} maxLength={field.maxLength} className={`${controlClassName} min-h-32 resize-y`} />
                        ) : (
                          <input {...common} type={field.type ?? "text"} autoComplete={field.autoComplete} maxLength={field.maxLength} />
                        )}
                        {field.hint && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-[#617986]">{field.hint}</p>}
                        {error && <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-red-800">{error}</p>}
                      </div>
                    );
                  })}
                </div>
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor={`${prefix}-contactWebsite`}>Leave this field empty</label>
                  <input id={`${prefix}-contactWebsite`} name="contactWebsite" type="text" tabIndex={-1} autoComplete="off" value={values.contactWebsite} onChange={(event) => setValues((previous) => ({ ...previous, contactWebsite: event.target.value }))} />
                </div>
                <div className="mt-8 border-t border-[#063760]/15 pt-6">
                  <div className="flex items-start gap-3">
                    <input id={`${prefix}-consent`} name="consent" type="checkbox" required checked={consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? `${prefix}-consent-error` : undefined} onChange={(event) => { setConsent(event.target.checked); clearFieldError("consent"); }} className="mt-1 h-5 w-5 shrink-0 accent-[#063760] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad8618]" />
                    <label htmlFor={`${prefix}-consent`} className="text-sm leading-6 text-[#35536a]">I agree that the SCI 2027 team may process my request and contact me about it. <span className="font-bold text-[#906d0b]" aria-hidden="true">*</span><span className="sr-only"> (required)</span></label>
                  </div>
                  {errors.consent && <p id={`${prefix}-consent-error`} className="mt-2 text-sm font-semibold text-red-800">{errors.consent}</p>}
                  <p className="mt-5 text-xs leading-6 text-[#617986]">{successNotice}</p>
                  {submitError && <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{submitError}</p>}
                  <button type="submit" disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#063760] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#0a507e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad8618] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                    {pending ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Submitting request…</> : <>{kind === "media" ? "Submit media request" : "Submit sponsorship request"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></>}
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
