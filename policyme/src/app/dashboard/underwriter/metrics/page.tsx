"use client";

export default function MetricsPage() {
    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">Performance Metrics</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                    Track underwriting throughput, accuracy, and portfolio risk distribution.
                </p>
            </section>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Processed This Week", value: "48", change: "+8%", changeColor: "text-green-600" },
                    { label: "Approval Rate", value: "72%", change: "+3%", changeColor: "text-green-600" },
                    { label: "Avg. Processing Time", value: "2.4h", change: "-12%", changeColor: "text-green-600" },
                    { label: "AI Accuracy", value: "94.2%", change: "+1.5%", changeColor: "text-green-600" },
                ].map((kpi) => (
                    <div key={kpi.label} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border">
                        <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2">{kpi.label}</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold">{kpi.value}</span>
                            <span className={`text-sm font-bold ${kpi.changeColor} mb-1`}>{kpi.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                    <h3 className="text-xl font-bold mb-6">Weekly Throughput</h3>
                    <div className="flex items-end gap-3 h-48">
                        {[40, 65, 50, 80, 70, 90, 48].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-[var(--primary)] rounded-t-lg transition-all" style={{ height: `${val}%` }} />
                                <span className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)]">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                    <h3 className="text-xl font-bold mb-6">Risk Category Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Low Risk (Score > 75)", pct: 62, color: "bg-green-500" },
                            { label: "Medium Risk (Score 40-75)", pct: 28, color: "bg-orange-500" },
                            { label: "High Risk (Score < 40)", pct: 10, color: "bg-red-500" },
                        ].map((cat) => (
                            <div key={cat.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{cat.label}</span>
                                    <span className="font-bold">{cat.pct}%</span>
                                </div>
                                <div className="w-full h-3 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden">
                                    <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${cat.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
