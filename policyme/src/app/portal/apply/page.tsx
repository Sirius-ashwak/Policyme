"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UnderwritingApplication } from "@/lib/demo-store";

const steps = [
    { num: "01", label: "Personal", key: "personal" },
    { num: "02", label: "Vehicle", key: "vehicle" },
    { num: "03", label: "Coverage", key: "coverage" },
    { num: "04", label: "Review", key: "review" },
];

const DRAFT_STORAGE_KEY = "policyme:auto-application-draft:v1";

type FormState = {
    applicantName: string;
    applicantEmail: string;
    applicantOrganization: string;
    driverAge: string;
    garagingCity: string;
    garagingState: string;
    vehicleYear: string;
    vehicleMake: string;
    vehicleModel: string;
    vin: string;
    licensePlate: string;
    annualMileage: string;
    primaryUse: "personal" | "business";
    coverageLevel: "standard" | "plus" | "premium";
    requestedCoverage: string;
    assetValue: string;
    deductible: string;
    claimsCount: string;
    notes: string;
};

type CreateApplicationResponse = {
    application?: UnderwritingApplication;
    error?: string;
};

const initialFormState: FormState = {
    applicantName: "",
    applicantEmail: "",
    applicantOrganization: "",
    driverAge: "34",
    garagingCity: "San Francisco",
    garagingState: "CA",
    vehicleYear: "2024",
    vehicleMake: "Tesla",
    vehicleModel: "Model Y",
    vin: "",
    licensePlate: "",
    annualMileage: "12000",
    primaryUse: "personal",
    coverageLevel: "plus",
    requestedCoverage: "$250,000",
    assetValue: "$52,000",
    deductible: "$500",
    claimsCount: "0",
    notes: "",
};

function parseNumber(value: string): number | null {
    const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
}

function progressForStep(step: number): number {
    return Math.round(((step + 1) / steps.length) * 100);
}

export default function NewApplicationPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [form, setForm] = useState<FormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedApplication, setSubmittedApplication] = useState<UnderwritingApplication | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
            if (!rawDraft) {
                return;
            }

            const parsedDraft = JSON.parse(rawDraft) as Partial<FormState>;
            setForm((current) => ({ ...current, ...parsedDraft }));
            toast.message("Saved application draft restored.");
        } catch {
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
    }, []);

    const updateField = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const saveDraft = () => {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
        toast.success("Draft saved on this device.");
    };

    const resetForm = () => {
        setForm(initialFormState);
        setCurrentStep(0);
        setSubmittedApplication(null);
        setError(null);
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    };

    const validateStep = (stepIndex: number): string | null => {
        if (stepIndex === 0) {
            if (!form.applicantName.trim() || !form.applicantEmail.trim() || !form.garagingCity.trim() || !form.garagingState.trim()) {
                return "Complete the applicant and garaging details before continuing.";
            }
            if (!form.applicantEmail.includes("@")) {
                return "Enter a valid email address.";
            }
        }

        if (stepIndex === 1) {
            if (!form.vin.trim() || !form.licensePlate.trim() || !form.vehicleYear.trim() || !form.vehicleMake.trim() || !form.vehicleModel.trim()) {
                return "Complete the vehicle details before continuing.";
            }
        }

        if (stepIndex === 2) {
            if (!form.requestedCoverage.trim() || !form.assetValue.trim() || !form.deductible.trim() || !form.claimsCount.trim()) {
                return "Complete the coverage and claims history fields before continuing.";
            }
        }

        return null;
    };

    const handleNext = () => {
        const validationError = validateStep(currentStep);
        if (validationError) {
            setError(validationError);
            toast.error(validationError);
            return;
        }

        setError(null);
        setCurrentStep((current) => Math.min(steps.length - 1, current + 1));
    };

    const handleSubmit = async () => {
        const validationError = validateStep(2);
        if (validationError) {
            setError(validationError);
            toast.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            const location = `${form.garagingCity}, ${form.garagingState}`;
            const claimsHistory =
                form.claimsCount === "0"
                    ? "No prior claims"
                    : `${form.claimsCount} prior claim(s) in the last five years`;
            const description = [
                `${form.vehicleYear} ${form.vehicleMake} ${form.vehicleModel}`,
                form.primaryUse === "business" ? "business/rideshare use" : "personal commute use",
                `deductible ${form.deductible}`,
                form.notes.trim() ? form.notes.trim() : "",
            ]
                .filter(Boolean)
                .join(" • ");

            const response = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicantName: form.applicantName,
                    applicantEmail: form.applicantEmail,
                    applicantOrganization: form.applicantOrganization || form.applicantName,
                    policyType:
                        form.coverageLevel === "premium"
                            ? "Personal Auto Premium"
                            : form.coverageLevel === "plus"
                                ? "Personal Auto Plus"
                                : "Personal Auto Standard",
                    requestedCoverage: form.requestedCoverage,
                    assetValue: form.assetValue,
                    location,
                    claimsHistory,
                    description,
                    customerData: {
                        applicant_name: form.applicantName,
                        applicant_email: form.applicantEmail,
                        applicant_organization: form.applicantOrganization || form.applicantName,
                        driver_age: parseNumber(form.driverAge),
                        vehicle_year: parseNumber(form.vehicleYear),
                        vehicle_make: form.vehicleMake,
                        vehicle_model: form.vehicleModel,
                        vin: form.vin,
                        license_plate: form.licensePlate,
                        annual_mileage: parseNumber(form.annualMileage),
                        primary_use: form.primaryUse,
                        requested_coverage: parseNumber(form.requestedCoverage),
                        asset_value: parseNumber(form.assetValue),
                        deductible: parseNumber(form.deductible),
                        claims_last_5_years: parseNumber(form.claimsCount),
                        location,
                        notes: form.notes.trim(),
                    },
                }),
            });
            const payload = (await response.json()) as CreateApplicationResponse;

            if (!response.ok || !payload.application) {
                throw new Error(payload.error || "Unable to submit the application.");
            }

            setSubmittedApplication(payload.application);
            setError(null);
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
            toast.success(`Application ${payload.application.id} submitted for underwriting review.`);
        } catch (submitError: unknown) {
            const message = submitError instanceof Error ? submitError.message : "Unable to submit the application.";
            setError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        if (currentStep === 0) {
            return (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Applicant Information</h2>
                        <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                            Capture the core contact and garaging information needed for underwriting.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Applicant Name</label>
                            <input value={form.applicantName} onChange={(event) => updateField("applicantName", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Email Address</label>
                            <input value={form.applicantEmail} onChange={(event) => updateField("applicantEmail", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Organization</label>
                            <input value={form.applicantOrganization} onChange={(event) => updateField("applicantOrganization", event.target.value)} placeholder="Optional for personal policies" className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Driver Age</label>
                            <input value={form.driverAge} onChange={(event) => updateField("driverAge", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Garaging City</label>
                            <input value={form.garagingCity} onChange={(event) => updateField("garagingCity", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">State</label>
                            <input value={form.garagingState} onChange={(event) => updateField("garagingState", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 1) {
            return (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Vehicle Information</h2>
                        <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                            Provide the insured vehicle details used for rating and loss history checks.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">VIN</label>
                            <input value={form.vin} onChange={(event) => updateField("vin", event.target.value)} placeholder="17-digit VIN" className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">License Plate</label>
                            <input value={form.licensePlate} onChange={(event) => updateField("licensePlate", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Year</label>
                            <input value={form.vehicleYear} onChange={(event) => updateField("vehicleYear", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Make</label>
                            <input value={form.vehicleMake} onChange={(event) => updateField("vehicleMake", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Model</label>
                            <input value={form.vehicleModel} onChange={(event) => updateField("vehicleModel", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Annual Mileage</label>
                            <input value={form.annualMileage} onChange={(event) => updateField("annualMileage", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-3 block">Primary Use</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: "personal", title: "Personal & Commute", subtitle: "Daily driving and errands" },
                                    { value: "business", title: "Business / Rideshare", subtitle: "Commercial or paid use" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => updateField("primaryUse", option.value as FormState["primaryUse"])}
                                        className={`p-5 rounded-xl border text-left transition-all ${
                                            form.primaryUse === option.value
                                                ? "border-[var(--primary)] bg-blue-50/50"
                                                : "border-[var(--insurai-outline-variant)]/20 hover:border-[var(--insurai-outline-variant)]/50"
                                        }`}
                                    >
                                        <p className="font-bold text-sm">{option.title}</p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">{option.subtitle}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Coverage & Claims History</h2>
                        <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                            Set the requested coverage profile and declare recent prior losses.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { value: "standard", title: "Standard", subtitle: "Entry protection with leaner limits" },
                            { value: "plus", title: "Plus", subtitle: "Balanced liability and collision coverage" },
                            { value: "premium", title: "Premium", subtitle: "Higher limits and concierge service" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => updateField("coverageLevel", option.value as FormState["coverageLevel"])}
                                className={`rounded-2xl border p-5 text-left transition-all ${
                                    form.coverageLevel === option.value
                                        ? "border-[var(--primary)] bg-blue-50/60 shadow-md"
                                        : "border-[var(--insurai-outline-variant)]/20 hover:border-[var(--insurai-outline-variant)]/40"
                                }`}
                            >
                                <p className="font-bold">{option.title}</p>
                                <p className="text-sm text-[var(--insurai-on-surface-variant)] mt-2">{option.subtitle}</p>
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Requested Coverage</label>
                            <input value={form.requestedCoverage} onChange={(event) => updateField("requestedCoverage", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Estimated Vehicle Value</label>
                            <input value={form.assetValue} onChange={(event) => updateField("assetValue", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Deductible</label>
                            <input value={form.deductible} onChange={(event) => updateField("deductible", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Claims In Last 5 Years</label>
                            <input value={form.claimsCount} onChange={(event) => updateField("claimsCount", event.target.value)} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2 block">Additional Notes</label>
                        <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={4} className="w-full p-4 rounded-xl bg-[var(--insurai-surface-container-highest)]/40 border border-transparent focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none" placeholder="Optional context for the underwriter" />
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                        Confirm the intake summary before sending the application to the underwriting queue.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        ["Applicant", form.applicantName],
                        ["Email", form.applicantEmail],
                        ["Vehicle", `${form.vehicleYear} ${form.vehicleMake} ${form.vehicleModel}`],
                        ["Location", `${form.garagingCity}, ${form.garagingState}`],
                        ["Coverage", `${form.coverageLevel} • ${form.requestedCoverage}`],
                        ["Claims History", form.claimsCount === "0" ? "No prior claims" : `${form.claimsCount} prior claims`],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-[var(--insurai-outline-variant)]/15 bg-[var(--insurai-surface-container-low)]/40 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">{label}</p>
                            <p className="mt-2 text-sm font-semibold">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (submittedApplication) {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="rounded-3xl bg-[var(--insurai-surface-container-lowest)] border border-emerald-200 p-8 ambient-shadow ghost-border">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Submitted
                    </span>
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Application {submittedApplication.id} is in review</h1>
                    <p className="mt-3 max-w-2xl text-[var(--insurai-on-surface-variant)]">
                        The underwriting queue now has your application. You can start a new draft or return to the portal while the review is in progress.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white/70 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Policy Type</p>
                            <p className="mt-2 font-semibold">{submittedApplication.policyType}</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Requested Coverage</p>
                            <p className="mt-2 font-semibold">{submittedApplication.requestedCoverage}</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Status</p>
                            <p className="mt-2 font-semibold">{submittedApplication.status}</p>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <button onClick={resetForm} className="px-5 py-3 rounded-xl primary-gradient text-white font-semibold shadow-lg">
                            Start Another Application
                        </button>
                        <Link href="/portal" className="px-5 py-3 rounded-xl border border-[var(--insurai-outline-variant)]/20 text-sm font-semibold hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                            Return to Portal
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[var(--insurai-surface-container-high)] text-[var(--insurai-on-surface-variant)] text-xs font-bold rounded-full uppercase tracking-wider">
                            Draft Auto Submission
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            {steps[currentStep].label}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-[Manrope]">
                        Auto Policy Application
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] text-sm mt-2 max-w-2xl">
                        Complete the four steps below to create a live underwriting application instead of a local-only draft.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={saveDraft} className="px-5 py-2.5 border border-[var(--insurai-outline-variant)]/20 rounded-lg text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-all">
                        Save Draft
                    </button>
                    <Link href="/portal" className="px-5 py-2.5 border border-[var(--insurai-outline-variant)]/20 rounded-lg text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-all">
                        Exit
                    </Link>
                </div>
            </div>

            <div className="flex items-center">
                {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                index < currentStep
                                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                                    : index === currentStep
                                        ? "bg-white border-[var(--primary)] text-[var(--primary)]"
                                        : "bg-white border-[var(--insurai-outline-variant)]/30 text-slate-400"
                            }`}>
                                {index < currentStep ? <span className="material-symbols-outlined text-lg">check</span> : step.num}
                            </div>
                            <span className={`text-xs font-semibold mt-2 ${index <= currentStep ? "text-[var(--primary)]" : "text-slate-400"}`}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-4 mt-[-20px]">
                                <div className={`h-full rounded-full ${index < currentStep ? "bg-[var(--primary)]" : "bg-[var(--insurai-surface-container-high)]"}`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-8 md:p-10 rounded-2xl ambient-shadow ghost-border">
                        {renderStepContent()}
                    </div>
                    <div className="flex items-center justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => setCurrentStep((current) => Math.max(0, current - 1))}
                            disabled={currentStep === 0 || isSubmitting}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-40"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Previous Step
                        </button>
                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-10 py-4 primary-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => void handleSubmit()}
                                disabled={isSubmitting}
                                className="px-10 py-4 primary-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>
                        )}
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Underwriting Snapshot</h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Coverage plan: {form.coverageLevel}. Estimated asset value: {form.assetValue}. Declared claims: {form.claimsCount}.
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50" />
                    </div>

                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-4">
                            Application Summary
                        </p>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[var(--insurai-on-surface-variant)]">Applicant</span>
                                <span className="font-semibold text-right">{form.applicantName || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[var(--insurai-on-surface-variant)]">Vehicle</span>
                                <span className="font-semibold text-right">{`${form.vehicleYear} ${form.vehicleMake} ${form.vehicleModel}`.trim()}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[var(--insurai-on-surface-variant)]">Use</span>
                                <span className="font-semibold capitalize">{form.primaryUse}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[var(--insurai-on-surface-variant)]">Coverage</span>
                                <span className="font-semibold">{form.requestedCoverage}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden h-48 relative shadow-lg">
                        <Image
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            alt="front view of a modern electric car parked in a showroom"
                            src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase mb-1">Progress</span>
                            <h4 className="text-white font-bold text-lg">{progressForStep(currentStep)}% complete</h4>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="pt-4 border-t border-[var(--insurai-surface-container-high)] flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider">
                        Auto Policy Progress: {progressForStep(currentStep)}%
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Draft Storage: Browser local</span>
                    <Link href="/support#faq" className="text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline">
                        View FAQ
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
