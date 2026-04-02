"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UnderwritingApplication } from "@/lib/demo-store";

type ApplicationsResponse = {
    applications?: UnderwritingApplication[];
    error?: string;
};

function scoreColor(score: number | null): string {
    if (score === null) {
        return "text-slate-400";
    }
    if (score >= 75) {
        return "text-green-600";
    }
    if (score >= 40) {
        return "text-orange-500";
    }

    return "text-red-500";
}

export default function AssessmentsPage() {
    const [applications, setApplications] = useState<UnderwritingApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadApplications = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/applications", { cache: "no-store" });
                const payload = (await response.json()) as ApplicationsResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load assessments.");
                }

                if (isMounted) {
                    setApplications(payload.applications || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load assessments.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadApplications();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">Risk Assessments</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                    Completed and in-progress risk assessments with live underwriting refresh support.
                </p>
            </section>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="rounded-xl bg-[var(--insurai-surface-container-lowest)] p-6 text-sm text-[var(--insurai-on-surface-variant)]">
                        Loading assessments...
                    </div>
                ) : (
                    applications.map((application) => {
                        const score = application.assessment?.riskScore ?? null;

                        return (
                            <Link
                                key={application.id}
                                href={`/dashboard/underwriter/assess/${application.id}`}
                                className="block bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl ambient-shadow ghost-border group hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[var(--insurai-surface-container-low)] rounded-xl flex items-center justify-center">
                                            <span className={`text-lg font-extrabold ${scoreColor(score)}`}>{score ?? "--"}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">{application.applicantOrganization}</h3>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] font-[Inter]">
                                                {application.id} • {application.policyType}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            application.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : application.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {application.status}
                                        </span>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-[var(--primary)]">arrow_forward</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
