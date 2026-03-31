"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function ClaimsHistoryPage() {
    const { t } = useLanguage();
    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">{t("claims.title")}</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    {t("claims.subtitle")}
                </p>
            </header>

            <div className="space-y-4">
                {[
                    { id: "CL-90122", title: "Windshield Damage", status: t("claims.status.review"), statusColor: "bg-blue-100 text-blue-700", date: "Oct 14, 2023", amount: "$1,250.00" },
                    { id: "CL-88401", title: "Rear-end Collision", status: t("claims.status.approved"), statusColor: "bg-green-100 text-green-700", date: "Aug 3, 2023", amount: "$4,250.00" },
                    { id: "CL-77219", title: "Hail Damage — Roof", status: t("claims.status.closed"), statusColor: "bg-slate-100 text-slate-600", date: "Mar 18, 2023", amount: "$8,900.00" },
                ].map((claim) => (
                    <div key={claim.id} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[var(--primary)]">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <div>
                                <h3 className="font-bold">{claim.title}</h3>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)] font-[Inter]">{claim.id} • {claim.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold">{claim.amount}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${claim.statusColor}`}>{claim.status}</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[var(--primary)] transition-colors">chevron_right</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
