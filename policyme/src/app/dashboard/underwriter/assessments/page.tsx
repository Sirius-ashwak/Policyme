"use client";

export default function AssessmentsPage() {
    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">Risk Assessments</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                    Completed and in-progress risk assessments with AI confidence scoring.
                </p>
            </section>

            <div className="space-y-4">
                {[
                    { id: "APP-94281", name: "Meridian Plaza", type: "Commercial Property", score: 85, scoreColor: "text-green-600", status: "Approved" },
                    { id: "APP-93102", name: "Tesla Model S — Fleet", type: "Commercial Auto", score: 45, scoreColor: "text-orange-500", status: "Under Review" },
                    { id: "APP-92884", name: "Oakwood Residence", type: "Residential Premium", score: 92, scoreColor: "text-green-600", status: "Approved" },
                    { id: "APP-91203", name: "Harbor Medical", type: "Health Comprehensive", score: 28, scoreColor: "text-red-500", status: "Rejected" },
                ].map((assessment) => (
                    <div key={assessment.id} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl ambient-shadow ghost-border flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--insurai-surface-container-low)] rounded-xl flex items-center justify-center">
                                <span className={`text-lg font-extrabold ${assessment.scoreColor}`}>{assessment.score}</span>
                            </div>
                            <div>
                                <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">{assessment.name}</h3>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)] font-[Inter]">{assessment.id} • {assessment.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                assessment.status === "Approved" ? "bg-green-100 text-green-700" :
                                assessment.status === "Rejected" ? "bg-red-100 text-red-700" :
                                "bg-blue-100 text-blue-700"
                            }`}>{assessment.status}</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[var(--primary)]">arrow_forward</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
