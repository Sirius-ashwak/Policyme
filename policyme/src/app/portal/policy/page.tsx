"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Calendar, IndianRupee, CheckCircle2, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CustomerPolicyRecord } from "@/lib/demo-store";

type PoliciesResponse = {
    policies?: CustomerPolicyRecord[];
    error?: string;
};

function formatDateLabel(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function statusClasses(status: CustomerPolicyRecord["status"]): string {
    if (status === "Renewing Soon") {
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
    if (status === "Pending") {
        return "bg-slate-100 border-slate-200 text-slate-700";
    }

    return "bg-emerald-50 border-emerald-200 text-emerald-700";
}

export default function MyPolicyPage() {
    const { t } = useLanguage();
    const [policies, setPolicies] = useState<CustomerPolicyRecord[]>([]);
    const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadPolicies = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/customer/policies", { cache: "no-store" });
                const payload = (await response.json()) as PoliciesResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load policies.");
                }

                if (isMounted) {
                    const nextPolicies = payload.policies || [];
                    setPolicies(nextPolicies);
                    setExpandedPolicy(nextPolicies[0]?.id || null);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load policies.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadPolicies();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-900">{t("policy.title")}</h1>
                <p className="text-slate-500 mt-1">{t("policy.subtitle")}</p>
            </motion.div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-6 text-sm text-slate-500 shadow-sm">
                    Loading policy data...
                </div>
            ) : (
                <div className="space-y-4">
                    {policies.map((policy, i) => {
                        const isExpanded = expandedPolicy === policy.id;

                        return (
                            <motion.div
                                key={policy.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-100">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{policy.name}</h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <span className="text-xs font-mono text-slate-400">{policy.id}</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${statusClasses(policy.status)}`}>
                                                    <CheckCircle2 className="h-3 w-3" /> {policy.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-lg font-bold text-slate-900">{policy.premium}</p>
                                            <p className="text-xs text-slate-400">{t("policy.monthly_premium")}</p>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                </button>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="border-t border-slate-100"
                                    >
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50/50">
                                            {[
                                                { icon: FileText, label: "Type", value: policy.type },
                                                { icon: IndianRupee, label: "Premium", value: policy.premium },
                                                { icon: Calendar, label: "Start", value: formatDateLabel(policy.startDate) },
                                                { icon: Calendar, label: "End", value: formatDateLabel(policy.endDate) },
                                            ].map((meta) => (
                                                <div key={meta.label} className="flex items-center gap-2">
                                                    <meta.icon className="h-4 w-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">{meta.label}</p>
                                                        <p className="text-sm font-medium text-slate-700">{meta.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-5">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3">{t("policy.coverage_details")}</h4>
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-slate-500">
                                                            <th className="text-left px-4 py-2.5 font-medium">{t("policy.coverage_item")}</th>
                                                            <th className="text-left px-4 py-2.5 font-medium">{t("policy.limit")}</th>
                                                            <th className="text-left px-4 py-2.5 font-medium">{t("policy.deductible")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {policy.coverage.map((item) => (
                                                            <tr key={`${policy.id}-${item.item}`} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                                                                <td className="px-4 py-3 text-slate-700 font-medium">{item.item}</td>
                                                                <td className="px-4 py-3 text-slate-600">{item.limit}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                                        item.deductible === "None" || item.deductible === "₹0"
                                                                            ? "bg-emerald-50 text-emerald-700"
                                                                            : "bg-slate-100 text-slate-600"
                                                                    }`}>
                                                                        {item.deductible}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}

                    {policies.length === 0 && (
                        <div className="rounded-2xl bg-white border border-slate-200 p-6 text-sm text-slate-500 shadow-sm">
                            No policy records are available for this account yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
