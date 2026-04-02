"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatbot from "@/components/AIChatbot";
import type { ClaimEvidenceFile } from "@/lib/demo-store";

type ClaimExtraction = {
    claimType?: string;
    claim_type?: string;
    description?: string;
    amount?: string;
    estimated_amount?: string;
    date?: string;
    incident_date?: string;
    location?: string;
};

type ClaimCreateResponse = {
    claim?: {
        id: string;
    };
    error?: string;
    details?: string;
};

export default function SubmitClaimPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [claimType, setClaimType] = useState("");
    const [incidentDate, setIncidentDate] = useState("");
    const [incidentTime, setIncidentTime] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [estimatedAmount, setEstimatedAmount] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<ClaimEvidenceFile[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { label: t("submit.step_details"), key: "details" },
        { label: t("submit.step_evidence"), key: "evidence" },
        { label: t("submit.step_review"), key: "review" },
    ];

    const handleClaimExtracted = (data: ClaimExtraction) => {
        const extractedType = data.claimType || data.claim_type;
        const extractedDate = data.date || data.incident_date;
        const extractedAmount = data.amount || data.estimated_amount;

        if (extractedType) {
            setClaimType(extractedType);
        }
        if (extractedDate) {
            setIncidentDate(extractedDate);
        }
        if (data.description) {
            setDescription(data.description);
        }
        if (data.location) {
            setLocation(data.location);
        }
        if (extractedAmount) {
            setEstimatedAmount(extractedAmount);
        }
    };

    const handleFileSelection = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const nextFiles = Array.from(files).map((file) => ({
            name: file.name,
            sizeBytes: file.size,
            type: file.type || "application/octet-stream",
        }));

        setSelectedFiles((current) => [...current, ...nextFiles]);
    };

    const removeFile = (fileName: string) => {
        setSelectedFiles((current) => current.filter((file) => file.name !== fileName));
    };

    const handleBackAction = () => {
        setSubmitError(null);
        if (currentStep === 0) {
            router.push("/portal");
            return;
        }

        setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    const handlePrimaryAction = async () => {
        setSubmitError(null);

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
            return;
        }

        if (!claimType || !incidentDate || !description.trim() || !location.trim() || !estimatedAmount.trim()) {
            setSubmitError("Complete the claim details before submitting.");
            setCurrentStep(0);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/claims", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    claimType,
                    incidentDate,
                    incidentTime,
                    description,
                    location,
                    estimatedAmount,
                    evidenceFiles: selectedFiles,
                }),
            });

            const payload = (await response.json()) as ClaimCreateResponse;
            if (!response.ok || !payload.claim) {
                throw new Error(payload.details || payload.error || "Unable to submit claim.");
            }

            router.push(`/portal/claims?created=${encodeURIComponent(payload.claim.id)}`);
        } catch (error: unknown) {
            setSubmitError(error instanceof Error ? error.message : "Unable to submit claim.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            <header className="fixed top-0 w-full z-50 bg-[var(--insurai-surface)]/80 backdrop-blur-[20px]">
                <div className="max-w-3xl mx-auto h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/portal" className="flex items-center gap-2 text-[var(--primary)] hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="font-['Inter'] text-sm font-medium">{t("submit.dashboard")}</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tighter text-[var(--insurai-on-surface)]">InsurAI</span>
                    </div>
                    <div className="w-24 flex justify-end">
                        <Link href="/support" className="text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">
                            <span className="material-symbols-outlined">help_outline</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-xl mx-auto animate-fade-in font-['Manrope']">
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">{t("submit.title")}</h1>
                            <span className="font-['Inter'] text-xs font-semibold text-[var(--primary)] bg-[var(--insurai-primary-fixed)]/30 px-3 py-1 rounded-full">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </div>

                        <div className="flex gap-2 h-1.5 w-full">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 rounded-full transition-colors duration-500 bg-gradient-to-r ${
                                        index <= currentStep
                                            ? "from-[var(--primary)] to-[var(--primary)]"
                                            : "from-[var(--insurai-surface-container-high)] to-[var(--insurai-surface-container-high)]"
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between mt-3">
                            {steps.map((step, index) => (
                                <span
                                    key={step.key}
                                    className={`font-['Inter'] text-[10px] font-bold uppercase tracking-widest ${
                                        index <= currentStep ? "text-[var(--primary)]" : "text-[var(--insurai-on-surface-variant)] opacity-40"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className={currentStep === 0 ? "block" : "hidden"}>
                            <section className="space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">{t("submit.incident_details")}</h2>
                                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">{t("submit.incident_subtitle")}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] font-['Inter']">AI Claim Assistant</p>
                                    <AIChatbot onClaimExtracted={handleClaimExtracted} />
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">
                                        Ask the assistant what happened, when it occurred, and estimated damage. It will auto-fill your claim details below.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.claim_type")}</label>
                                        <div className="relative">
                                            <select
                                                value={claimType}
                                                onChange={(event) => setClaimType(event.target.value)}
                                                className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 appearance-none font-medium text-[var(--insurai-on-surface)] cursor-pointer focus:ring-4 focus:ring-[var(--primary)]/10"
                                            >
                                                <option value="">Select incident type</option>
                                                <option value="auto-collision">auto-collision</option>
                                                <option value="auto-comprehensive">auto-comprehensive</option>
                                                <option value="property">property</option>
                                                <option value="health">health</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.date_of_incident")}</label>
                                            <input
                                                type="date"
                                                value={incidentDate}
                                                onChange={(event) => setIncidentDate(event.target.value)}
                                                className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.approx_time")}</label>
                                            <input
                                                type="time"
                                                value={incidentTime}
                                                onChange={(event) => setIncidentTime(event.target.value)}
                                                className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Location</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(event) => setLocation(event.target.value)}
                                            className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                            placeholder="City, province, or incident address"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Estimated Amount</label>
                                        <input
                                            type="text"
                                            value={estimatedAmount}
                                            onChange={(event) => setEstimatedAmount(event.target.value)}
                                            className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                            placeholder="e.g. 2400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.description")}</label>
                                        <textarea
                                            value={description}
                                            onChange={(event) => setDescription(event.target.value)}
                                            className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] resize-none placeholder:text-[var(--insurai-on-surface-variant)]/50 focus:ring-4 focus:ring-[var(--primary)]/10"
                                            placeholder="Provide a detailed account of the events leading up to the incident..."
                                            rows={5}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 mt-10">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">{t("submit.evidence_title")}</h2>
                                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">{t("submit.evidence_subtitle")}</p>
                                </div>

                                <label className="group relative block">
                                    <div className="border-2 border-dashed border-[var(--insurai-outline-variant)]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[var(--insurai-surface-container-low)] transition-all group-hover:bg-[var(--insurai-surface-container)] cursor-pointer">
                                        <div className="w-16 h-16 rounded-full bg-[var(--insurai-primary-container)]/10 flex items-center justify-center text-[var(--primary)] mb-4 group-hover:scale-105 transition-transform">
                                            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                        </div>
                                        <p className="font-semibold mb-1">{t("submit.drag_drop")}</p>
                                        <p className="text-[var(--insurai-on-surface-variant)] text-xs mb-6">{t("submit.file_types")}</p>
                                        <span className="bg-white dark:bg-slate-800 border border-[var(--insurai-outline-variant)]/20 px-6 py-2.5 rounded-lg font-['Inter'] text-sm font-semibold shadow-sm group-hover:-translate-y-0.5 transition-all text-slate-700 dark:text-slate-200">
                                            {t("submit.browse_files")}
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(event) => handleFileSelection(event.target.files)}
                                    />
                                </label>

                                <div className="space-y-2 mt-4">
                                    {selectedFiles.length === 0 ? (
                                        <div className="p-4 rounded-xl bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 text-sm text-[var(--insurai-on-surface-variant)]">
                                            No evidence files selected yet. You can still submit the claim and add files later.
                                        </div>
                                    ) : (
                                        selectedFiles.map((file) => (
                                            <div key={file.name} className="flex items-center justify-between p-4 bg-[var(--insurai-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--insurai-outline-variant)]/10">
                                                <div>
                                                    <p className="text-sm font-semibold">{file.name}</p>
                                                    <p className="text-[10px] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">
                                                        {Math.max(1, Math.round(file.sizeBytes / 1024))} KB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(file.name)}
                                                    className="text-[var(--insurai-on-surface-variant)] hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className={currentStep === 1 ? "block" : "hidden"}>
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold">{t("submit.additional_evidence")}</h2>
                                <div className="border border-[var(--insurai-outline-variant)]/20 rounded-xl p-8 bg-[var(--insurai-surface-container-lowest)] space-y-4">
                                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                                        Review the evidence package before final submission.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-[var(--insurai-surface-container-low)]">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Files Attached</p>
                                            <p className="text-2xl font-extrabold mt-2">{selectedFiles.length}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[var(--insurai-surface-container-low)]">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Estimated Amount</p>
                                            <p className="text-2xl font-extrabold mt-2">{estimatedAmount || "Not set"}</p>
                                        </div>
                                    </div>
                                    {selectedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            {selectedFiles.map((file) => (
                                                <div key={file.name} className="flex items-center justify-between rounded-lg border border-[var(--insurai-outline-variant)]/10 px-4 py-3">
                                                    <span className="text-sm font-medium">{file.name}</span>
                                                    <span className="text-xs text-[var(--insurai-on-surface-variant)]">
                                                        {Math.max(1, Math.round(file.sizeBytes / 1024))} KB
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={currentStep === 2 ? "block" : "hidden"}>
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold">{t("submit.review_claim")}</h2>
                                <div className="border border-[var(--insurai-outline-variant)]/20 rounded-xl p-8 bg-[var(--insurai-surface-container-lowest)]">
                                    <h3 className="font-bold border-b border-[var(--insurai-surface-container-high)] pb-4 mb-4">Summary</h3>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-[var(--insurai-on-surface-variant)]">Claim Type</span>
                                        <span className="font-semibold">{claimType || "Not provided yet"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-[var(--insurai-on-surface-variant)]">Incident Date</span>
                                        <span className="font-semibold">{incidentDate || "Not provided yet"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-[var(--insurai-on-surface-variant)]">Location</span>
                                        <span className="font-semibold">{location || "Not provided yet"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-[var(--insurai-on-surface-variant)]">Estimated Amount</span>
                                        <span className="font-semibold">{estimatedAmount || "Not provided yet"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-[var(--insurai-on-surface-variant)]">Evidence Files</span>
                                        <span className="font-semibold">{selectedFiles.length}</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-[var(--insurai-surface-container-high)]">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-2">Incident Summary</p>
                                        <p className="text-sm text-[var(--insurai-on-surface)] leading-relaxed">
                                            {description || "No description captured yet."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleBackAction}
                                className="px-6 py-4 font-['Inter'] text-sm font-bold text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors flex items-center gap-2"
                            >
                                {currentStep === 0 ? t("submit.save_for_later") : t("submit.back")}
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => void handlePrimaryAction()}
                                className="bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] px-10 py-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : currentStep === steps.length - 1
                                        ? t("submit.submit_claim")
                                        : t("submit.continue")}
                            </button>
                        </div>

                        {submitError && (
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-4">{submitError}</p>
                        )}

                        <div className="flex items-center justify-center gap-2 pt-8 opacity-40">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest font-['Inter']">{t("submit.encrypted")}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
