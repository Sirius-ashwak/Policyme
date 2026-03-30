"use client";

export default function AdjudicationsPage() {
    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">Active Adjudications</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                    Claims currently under formal adjudication with assigned resolution workflows.
                </p>
            </section>

            <div className="space-y-4">
                {[
                    { id: "ADJ-2291", title: "Disputed liability — Multi-vehicle collision", status: "In Mediation", statusColor: "bg-orange-100 text-orange-700", assignee: "SC", days: 12 },
                    { id: "ADJ-2284", title: "Subrogation claim — Third-party negligence", status: "Evidence Review", statusColor: "bg-blue-100 text-blue-700", assignee: "MT", days: 8 },
                    { id: "ADJ-2271", title: "Contested valuation — Classic vehicle", status: "Awaiting Appraisal", statusColor: "bg-purple-100 text-purple-700", assignee: "ER", days: 21 },
                ].map((adj) => (
                    <div key={adj.id} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl ambient-shadow ghost-border flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600">
                                <span className="material-symbols-outlined">gavel</span>
                            </div>
                            <div>
                                <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">{adj.title}</h3>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)] font-[Inter]">{adj.id} • {adj.days} days active</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${adj.statusColor}`}>{adj.status}</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[var(--primary)]">arrow_forward</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
