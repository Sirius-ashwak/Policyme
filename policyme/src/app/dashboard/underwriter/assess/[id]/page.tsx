"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ApplicationStatus, UnderwritingApplication } from "@/lib/demo-store";

type ApplicationResponse = {
    application?: UnderwritingApplication;
    error?: string;
    details?: string;
};

function formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function scoreTone(score: number | null): string {
    if (score === null) {
        return "text-slate-400";
    }
    if (score >= 75) {
        return "text-emerald-600 dark:text-emerald-400";
    }
    if (score >= 40) {
        return "text-amber-600 dark:text-amber-400";
    }

    return "text-red-600 dark:text-red-400";
}

export default function RiskAssessorPage() {
    const params = useParams<{ id: string }>();
    const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [application, setApplication] = useState<UnderwritingApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssessing, setIsAssessing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadApplication = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/applications/${applicationId}`, { cache: "no-store" });
                const payload = (await response.json()) as ApplicationResponse;

                if (!response.ok || !payload.application) {
                    throw new Error(payload.error || "Application not found.");
                }

                if (isMounted) {
                    setApplication(payload.application);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Application not found.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (applicationId) {
            void loadApplication();
        }

        return () => {
            isMounted = false;
        };
    }, [applicationId]);

    const runAssessment = async () => {
        if (!application) {
            return;
        }

        try {
            setIsAssessing(true);
            const response = await fetch(`/api/applications/${application.id}/assess`, {
                method: "POST",
            });
            const payload = (await response.json()) as ApplicationResponse;

            if (!response.ok || !payload.application) {
                throw new Error(payload.details || payload.error || "Unable to run assessment.");
            }

            setApplication(payload.application);
            setError(null);
        } catch (assessmentError: unknown) {
            setError(assessmentError instanceof Error ? assessmentError.message : "Unable to run assessment.");
        } finally {
            setIsAssessing(false);
        }
    };

    const updateStatus = async (status: ApplicationStatus) => {
        if (!application) {
            return;
        }

        try {
            setIsUpdating(true);
            const response = await fetch(`/api/applications/${application.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            const payload = (await response.json()) as ApplicationResponse;

            if (!response.ok || !payload.application) {
                throw new Error(payload.details || payload.error || "Unable to update status.");
            }

            setApplication(payload.application);
            setError(null);
        } catch (updateError: unknown) {
            setError(updateError instanceof Error ? updateError.message : "Unable to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-8 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
                <div className="rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)]">
                    Loading assessment...
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="pt-8 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
                    {error || "Application not found."}
                </div>
            </div>
        );
    }

    const score = application.assessment?.riskScore ?? null;
    const recommendation = application.assessment?.recommend ?? null;

    return (
        <div className="pt-8 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-sm font-['Inter'] text-[var(--insurai-on-surface-variant)] opacity-80 mb-2">
                        <Link href="/dashboard/underwriter/assessments">Assessments</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>{application.policyType}</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-1 text-[var(--insurai-on-surface)]">
                        {application.id}: {application.applicantOrganization}
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] font-medium text-sm">
                        Submission Date: {application.submittedAt} • Applicant: {application.applicantName}
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void updateStatus("Under Review")}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/30 font-semibold text-sm hover:bg-[var(--insurai-surface-container-low)] transition-colors active:scale-95 disabled:opacity-60"
                    >
                        Mark Review
                    </button>
                    <button
                        type="button"
                        disabled={isAssessing}
                        onClick={() => void runAssessment()}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] text-white font-semibold text-sm shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {isAssessing ? "Assessing..." : "Run Fresh Assessment"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-6">AI Confidence Score</span>

                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                                <circle className="text-[var(--insurai-surface-container-high)]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                                <circle
                                    className={scoreTone(score)}
                                    cx="96"
                                    cy="96"
                                    fill="transparent"
                                    r="88"
                                    stroke="currentColor"
                                    strokeDasharray="552.92"
                                    strokeDashoffset={score === null ? "552.92" : `${552.92 - (552.92 * Math.max(0, Math.min(score, 100))) / 100}`}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                ></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-extrabold ${scoreTone(score)}`}>{score ?? "--"}</span>
                                <span className="font-['Inter'] text-sm font-medium text-[var(--insurai-on-surface-variant)]/60">/ 100</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                recommendation === "approve"
                                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                    : recommendation === "reject"
                                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        : "bg-slate-100 text-slate-600"
                            }`}>
                                {recommendation ? `Recommendation: ${recommendation}` : "Awaiting assessment"}
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                            {application.assessment
                                ? `Last generated ${formatDateTime(application.assessment.generatedAt)}${application.assessment.isMock ? " in mock mode." : "."}`
                                : "No underwriting assessment has been generated yet."}
                        </p>
                    </div>

                    <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--insurai-on-surface)]">Entity Profile</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Requested Coverage</span>
                                <span className="text-sm font-bold">{application.requestedCoverage}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Asset Value</span>
                                <span className="text-sm font-bold">{application.assetValue}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Location</span>
                                <span className="text-sm font-bold">{application.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Claims History</span>
                                <span className="text-sm font-bold">{application.claimsHistory}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-8 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">Risk Factors Analysis</h2>
                            <button
                                type="button"
                                onClick={() => void runAssessment()}
                                className="text-[var(--primary)] text-sm font-semibold flex items-center gap-1 hover:underline"
                            >
                                Refresh Assessment <span className="material-symbols-outlined text-sm">refresh</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-lg border border-[var(--insurai-outline-variant)]/10 bg-[var(--insurai-surface-container-low)]">
                                <h4 className="font-bold text-[var(--insurai-on-surface)] mb-2">Application Summary</h4>
                                <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                    {application.description}
                                </p>
                            </div>

                            {application.assessment ? (
                                application.assessment.factors.map((factor) => (
                                    <div key={factor} className="p-5 rounded-lg border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-1">info</span>
                                            <div>
                                                <h4 className="font-bold text-[var(--insurai-on-surface)] mb-1">Assessment Factor</h4>
                                                <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                                    {factor}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-5 rounded-lg border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10">
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-1">warning</span>
                                        <div>
                                            <h4 className="font-bold text-[var(--insurai-on-surface)] mb-1">Assessment Required</h4>
                                            <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                                Run a fresh underwriting assessment to populate live factors from the backend model.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[var(--primary)] p-8 rounded-xl text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Automated Recommendation</h3>
                                <p className="text-white/80 text-sm max-w-lg leading-relaxed">
                                    {recommendation
                                        ? `The underwriting engine recommends ${recommendation} for this application based on the current customer data payload.`
                                        : "No recommendation is available yet. Run the backend assessment to generate one."}
                                </p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void updateStatus("Rejected")}
                                    className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 disabled:opacity-60"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void updateStatus("Approved")}
                                    className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-white text-[var(--primary)] font-bold shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                                >
                                    {isUpdating ? "Saving..." : "Approve Policy"}
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl">
                            <h5 className="font-bold text-sm text-[var(--insurai-on-surface)] mb-2">Applicant</h5>
                            <p className="text-sm text-[var(--insurai-on-surface-variant)]">{application.applicantName}</p>
                            <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">{application.applicantEmail}</p>
                        </div>

                        <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl">
                            <h5 className="font-bold text-sm text-[var(--insurai-on-surface)] mb-2">Current Decision State</h5>
                            <p className="text-sm text-[var(--insurai-on-surface-variant)]">{application.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
