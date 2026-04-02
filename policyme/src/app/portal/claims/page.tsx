"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ClaimRecord } from "@/lib/demo-store";

type ClaimsResponse = {
    claims?: ClaimRecord[];
    error?: string;
};

function statusClasses(status: string): string {
    if (status === "Approved") {
        return "bg-green-100 text-green-700";
    }
    if (status === "Closed") {
        return "bg-slate-100 text-slate-600";
    }
    if (status === "Urgent") {
        return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
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

export default function ClaimsHistoryPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const createdClaimId = searchParams.get("created");
    const [claims, setClaims] = useState<ClaimRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadClaims = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/claims", { cache: "no-store" });
                const payload = (await response.json()) as ClaimsResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load claims.");
                }

                if (isMounted) {
                    setClaims(payload.claims || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load claims.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadClaims();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">{t("claims.title")}</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    {t("claims.subtitle")}
                </p>
            </header>

            {createdClaimId && (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                    Claim {createdClaimId} was submitted successfully and is now visible in your history.
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)]">
                    Loading claims...
                </div>
            ) : (
                <div className="space-y-4">
                    {claims.map((claim) => {
                        const isNewlyCreated = claim.id === createdClaimId;

                        return (
                            <div
                                key={claim.id}
                                className={`bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border flex items-center justify-between group transition-all ${
                                    isNewlyCreated ? "ring-2 ring-emerald-400/60" : ""
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[var(--primary)]">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{claim.title}</h3>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] font-[Inter]">
                                            {claim.id} • {formatDateLabel(claim.incidentDate)}
                                        </p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">
                                            {claim.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold">{claim.estimatedAmount}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusClasses(claim.status)}`}>
                                        {claim.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {claims.length === 0 && (
                        <div className="rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)]">
                            No claims have been submitted yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
