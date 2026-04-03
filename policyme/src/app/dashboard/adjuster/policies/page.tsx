"use client";

export default function PoliciesPage() {
    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">Policy Database</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                    Search and browse the complete policy knowledge base indexed by GraphRAG.
                </p>
            </section>

            <div className="relative max-w-lg mb-10">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input type="text" placeholder="Search policies by ID, holder name, or coverage type..." className="w-full pl-12 pr-4 py-3.5 bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/15 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" />
            </div>

            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl ambient-shadow ghost-border overflow-hidden">
                <table className="w-full insurai-table">
                    <thead>
                        <tr className="border-b border-[var(--insurai-surface-container-high)]">
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">Policy ID</th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">Holder</th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">Type</th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">Coverage</th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: "POL-8829-XJ", holder: "Sarah Mitchell", type: "Auto — Comprehensive", coverage: "₹100,000", status: "Active" },
                            { id: "POL-1102-BQ", holder: "James Harrison", type: "Residential Premium", coverage: "₹450,000", status: "Active" },
                            { id: "POL-4491-ZT", holder: "Aria Khel", type: "Auto — Liability", coverage: "₹50,000", status: "Active" },
                            { id: "POL-9921-AM", holder: "Thomas Baxter", type: "Commercial Property", coverage: "₹2,400,000", status: "Under Review" },
                        ].map((pol) => (
                            <tr key={pol.id} className="hover:bg-[var(--insurai-surface-container-low)] transition-colors cursor-pointer">
                                <td className="px-6 py-4 text-sm font-bold text-[var(--primary)]">{pol.id}</td>
                                <td className="px-6 py-4 text-sm">{pol.holder}</td>
                                <td className="px-6 py-4 text-sm">{pol.type}</td>
                                <td className="px-6 py-4 text-sm font-bold">{pol.coverage}</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">{pol.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
