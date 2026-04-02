"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ClaimRecord, ClaimStatus } from "@/lib/demo-store";

type ClaimResponse = {
    claim?: ClaimRecord;
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

function formatDateLabel(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function ClaimAnalysisPage() {
    const params = useParams<{ id: string }>();
    const claimId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [claim, setClaim] = useState<ClaimRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadClaim = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/claims/${claimId}`, { cache: "no-store" });
                const payload = (await response.json()) as ClaimResponse;

                if (!response.ok || !payload.claim) {
                    throw new Error(payload.error || "Claim not found.");
                }

                if (isMounted) {
                    setClaim(payload.claim);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Claim not found.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (claimId) {
            void loadClaim();
        }

        return () => {
            isMounted = false;
        };
    }, [claimId]);

    const updateStatus = async (status: ClaimStatus) => {
        if (!claim) {
            return;
        }

        try {
            setIsUpdating(true);
            const response = await fetch(`/api/claims/${claim.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            const payload = (await response.json()) as ClaimResponse;

            if (!response.ok || !payload.claim) {
                throw new Error(payload.details || payload.error || "Unable to update claim.");
            }

            setClaim(payload.claim);
            setError(null);
        } catch (updateError: unknown) {
            setError(updateError instanceof Error ? updateError.message : "Unable to update claim.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-8 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
                <div className="rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)]">
                    Loading claim analysis...
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="pt-8 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
                    {error || "Claim not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider font-['Inter']">
                            GraphRAG Enabled
                        </span>
                        <span className="text-[var(--insurai-on-surface-variant)] text-sm font-['Inter']">
                            Claim ID: {claim.id}
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] font-['Manrope']">
                        {claim.title}
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] font-medium text-sm mt-2">
                        Incident Date: {formatDateLabel(claim.incidentDate)} • Policy: {claim.policyId} • Holder: {claim.policyHolder}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void updateStatus("Rejected")}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container-low)] transition-all disabled:opacity-60"
                    >
                        Reject Claim
                    </button>
                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void updateStatus("Approved")}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] shadow-lg shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {isUpdating ? "Updating..." : "Approve for Payout"}
                    </button>
                </div>
            </header>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-8">
                    <section className="bg-[var(--insurai-surface-container-lowest)] rounded-xl p-8 shadow-sm border border-[var(--insurai-outline-variant)]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--primary)]">description</span>
                            <h2 className="text-lg font-bold tracking-tight">Incident Description</h2>
                        </div>
                        <div className="space-y-4 text-[var(--insurai-on-surface-variant)] leading-relaxed">
                            <p>{claim.description}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl bg-[var(--insurai-surface-container-low)] p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Location</p>
                                    <p className="mt-2 text-sm font-semibold text-[var(--insurai-on-surface)]">{claim.location}</p>
                                </div>
                                <div className="rounded-xl bg-[var(--insurai-surface-container-low)] p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Estimated Amount</p>
                                    <p className="mt-2 text-sm font-semibold text-[var(--insurai-on-surface)]">{claim.estimatedAmount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100/50">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-['Inter'] text-slate-400 mb-4">
                                Supporting Evidence
                            </h4>
                            <div className="space-y-3">
                                {claim.evidenceFiles.length > 0 ? (
                                    claim.evidenceFiles.map((file) => (
                                        <div key={file.name} className="flex items-center justify-between rounded-lg border border-[var(--insurai-outline-variant)]/10 px-4 py-3">
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">{file.name}</p>
                                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">{file.type}</p>
                                            </div>
                                            <span className="text-xs font-medium text-[var(--insurai-on-surface-variant)]">
                                                {Math.max(1, Math.round(file.sizeBytes / 1024))} KB
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">No evidence files were attached to this claim.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="bg-[var(--insurai-surface-container-low)] rounded-xl p-8 border border-[var(--insurai-outline-variant)]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--insurai-secondary)]">database</span>
                            <h2 className="text-lg font-bold tracking-tight">GraphRAG Policy Extraction</h2>
                        </div>
                        <div className="space-y-4">
                            {claim.analysis.policyMatches.map((match) => (
                                <div key={match.clauseId} className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-[var(--primary)] shadow-sm">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <span className="text-[10px] font-bold text-[var(--primary)] uppercase font-['Inter']">
                                            Clause {match.clauseId}: {match.title}
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-800">
                                            Match Confidence: {(match.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-[var(--insurai-on-surface)] mb-3">
                                        {match.excerpt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-7 space-y-8">
                    <section className="bg-[var(--insurai-surface-container-lowest)] rounded-xl p-8 shadow-[0_20px_40px_rgba(26,27,31,0.04)] ring-1 ring-[var(--primary)]/5">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[var(--primary)]">psychology</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">AI Recommendation</h2>
                                    <p className="text-sm text-[var(--insurai-on-surface-variant)] mt-1">
                                        Current workflow status: {claim.status}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                claim.analysis.recommendation === "approve" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {claim.analysis.recommendation}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-[var(--insurai-surface-container-low)] p-6 mb-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-3">Suggested Payout</p>
                            <p className="text-3xl font-extrabold text-[var(--insurai-on-surface)]">{claim.analysis.payoutEstimate}</p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-['Inter'] text-slate-400">Reasoning Chain</h4>
                            {claim.analysis.reasoning.map((reason) => (
                                <div key={reason} className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-lg">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] ring-4 ring-white dark:ring-slate-950" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--insurai-on-surface)]">{reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-8 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-[var(--insurai-on-surface)] mb-6">Claim Timeline</h2>
                        <div className="space-y-4">
                            {claim.timeline.map((entry) => (
                                <div key={`${entry.label}-${entry.timestamp}`} className="rounded-xl border border-[var(--insurai-outline-variant)]/10 px-4 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm font-bold text-[var(--insurai-on-surface)]">{entry.label}</p>
                                        <span className="text-xs text-[var(--insurai-on-surface-variant)]">{formatDateTime(entry.timestamp)}</span>
                                    </div>
                                    <p className="text-sm text-[var(--insurai-on-surface-variant)] mt-2">{entry.detail}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <footer className="mt-12 flex justify-center pb-8 border-b border-[var(--insurai-outline-variant)]/10">
                <div className="bg-[var(--insurai-surface-container-highest)]/50 backdrop-blur rounded-2xl p-1.5 inline-flex gap-1 shadow-sm border border-[var(--insurai-outline-variant)]/10">
                    <button className="px-6 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-[var(--primary)] shadow-sm transition-all focus:outline-none">All Analysis Results</button>
                    <Link href="/dashboard/adjuster" className="px-6 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[var(--insurai-on-surface)] transition-all focus:outline-none">
                        Back To Queue
                    </Link>
                </div>
            </footer>
        </div>
    );
}
