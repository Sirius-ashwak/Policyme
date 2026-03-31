"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function BillingPage() {
    const { t } = useLanguage();
    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">{t("billing.title")}</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    {t("billing.subtitle")}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">{t("billing.next_payment")}</p>
                    <p className="text-3xl font-extrabold mb-1">$247.50</p>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">Due Oct 24, 2023</p>
                    <button className="mt-6 w-full py-3 primary-gradient text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                        {t("billing.pay_now")}
                    </button>
                </div>
                <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">{t("billing.payment_method")}</p>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">•••• •••• •••• 4291</p>
                            <p className="text-xs text-[var(--insurai-on-surface-variant)]">Expires 09/2025</p>
                        </div>
                    </div>
                    <button className="text-sm text-[var(--primary)] font-semibold hover:underline">{t("billing.update_method")}</button>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">{t("billing.history")}</h2>
            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl ambient-shadow ghost-border overflow-hidden">
                {[
                    { date: "Sep 24, 2023", amount: "$247.50", status: "Paid" },
                    { date: "Aug 24, 2023", amount: "$247.50", status: "Paid" },
                    { date: "Jul 24, 2023", amount: "$247.50", status: "Paid" },
                ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                        <span className="text-sm">{payment.date}</span>
                        <span className="text-sm font-bold">{payment.amount}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">{payment.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
