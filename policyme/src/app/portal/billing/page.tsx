"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CustomerBillingRecord } from "@/lib/demo-store";

type BillingResponse = {
    billing?: CustomerBillingRecord;
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

export default function BillingPage() {
    const { t } = useLanguage();
    const [billing, setBilling] = useState<CustomerBillingRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeAction, setActiveAction] = useState<"pay_now" | "update_method" | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadBilling = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/customer/billing", { cache: "no-store" });
                const payload = (await response.json()) as BillingResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load billing data.");
                }

                if (isMounted) {
                    setBilling(payload.billing || null);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load billing data.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadBilling();

        return () => {
            isMounted = false;
        };
    }, []);

    const runAction = async (action: "pay_now" | "update_method") => {
        try {
            setActiveAction(action);
            const response = await fetch("/api/customer/billing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action }),
            });
            const payload = (await response.json()) as BillingResponse;

            if (!response.ok || !payload.billing) {
                throw new Error(payload.error || "Unable to update billing.");
            }

            setBilling(payload.billing);
            setError(null);
            toast.success(action === "pay_now" ? "Payment completed." : "Payment method updated.");
        } catch (actionError: unknown) {
            const message = actionError instanceof Error ? actionError.message : "Unable to update billing.";
            setError(message);
            toast.error(message);
        } finally {
            setActiveAction(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">{t("billing.title")}</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    {t("billing.subtitle")}
                </p>
            </header>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading || !billing ? (
                <div className="rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)] ambient-shadow ghost-border">
                    Loading billing data...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">{t("billing.next_payment")}</p>
                            <p className="text-3xl font-extrabold mb-1">{billing.nextPaymentAmount}</p>
                            <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                                Due {formatDateLabel(billing.nextPaymentDate)}
                            </p>
                            <p className="mt-2 text-xs text-[var(--insurai-on-surface-variant)]">
                                Auto-pay {billing.autoPay ? "enabled" : "disabled"}
                            </p>
                            <button
                                onClick={() => void runAction("pay_now")}
                                disabled={activeAction !== null}
                                className="mt-6 w-full py-3 primary-gradient text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {activeAction === "pay_now" ? "Processing..." : t("billing.pay_now")}
                            </button>
                        </div>
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">{t("billing.payment_method")}</p>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{billing.paymentMethod.brand}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">•••• •••• •••• {billing.paymentMethod.last4}</p>
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">
                                        Expires {billing.paymentMethod.expires}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => void runAction("update_method")}
                                disabled={activeAction !== null}
                                className="text-sm text-[var(--primary)] font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {activeAction === "update_method" ? "Updating..." : t("billing.update_method")}
                            </button>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-4">{t("billing.history")}</h2>
                    <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl ambient-shadow ghost-border overflow-hidden">
                        {billing.history.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                                <div>
                                    <span className="text-sm">{formatDateLabel(payment.date)}</span>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mt-1">
                                        {payment.reference}
                                    </p>
                                </div>
                                <span className="text-sm font-bold">{payment.amount}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    payment.status === "Paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}>
                                    {payment.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
