"use client";

export default function InsightsPage() {
    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">AI Insights</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                    GraphRAG-powered analytical findings across your claim portfolio.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: "Fraud Alerts", value: "4", icon: "warning", color: "text-red-600", bg: "bg-red-50" },
                    { label: "Pattern Matches", value: "12", icon: "pattern", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Cost Anomalies", value: "7", icon: "trending_up", color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-4`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-1">{stat.label}</p>
                        <p className="text-3xl font-extrabold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <span className="material-symbols-outlined text-3xl mb-4 block">auto_awesome</span>
                    <h3 className="text-xl font-bold mb-2">Weekly Intelligence Brief</h3>
                    <p className="text-blue-100 text-sm leading-relaxed mb-6">
                        GraphRAG analysis detected a 23% increase in water damage claims in the Northeast region this quarter. Cross-referencing with weather data shows correlation with above-average rainfall patterns.
                    </p>
                    <button className="px-6 py-3 bg-white text-[var(--primary)] rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all">
                        View Full Report
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50" />
            </div>
        </div>
    );
}
