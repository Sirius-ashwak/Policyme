"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CustomerSettingId, CustomerSettingRecord } from "@/lib/demo-store";

type SettingsResponse = {
    settings?: CustomerSettingRecord[];
    error?: string;
};

function formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export default function SettingsPage() {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<CustomerSettingRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSettingId, setActiveSettingId] = useState<CustomerSettingId | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/customer/settings", { cache: "no-store" });
                const payload = (await response.json()) as SettingsResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load security settings.");
                }

                if (isMounted) {
                    setSettings(payload.settings || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load security settings.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleAction = async (settingId: CustomerSettingId) => {
        try {
            setActiveSettingId(settingId);
            const response = await fetch("/api/customer/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ settingId }),
            });
            const payload = (await response.json()) as SettingsResponse;

            if (!response.ok) {
                throw new Error(payload.error || "Unable to update security settings.");
            }

            setSettings(payload.settings || []);
            setError(null);
            toast.success("Security setting updated.");
        } catch (actionError: unknown) {
            const message = actionError instanceof Error ? actionError.message : "Unable to update security settings.";
            setError(message);
            toast.error(message);
        } finally {
            setActiveSettingId(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">{t("settings.title")}</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    {t("settings.subtitle")}
                </p>
            </header>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="max-w-3xl rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)] ambient-shadow ghost-border">
                    Loading security settings...
                </div>
            ) : (
                <div className="space-y-6 max-w-3xl">
                    {settings.map((item) => (
                        <div key={item.id} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[var(--insurai-surface-container-low)] rounded-xl flex items-center justify-center text-[var(--insurai-on-surface-variant)]">
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="font-bold text-sm">{item.title}</h3>
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                                            {item.statusLabel}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">{item.description}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mt-2">
                                        Updated {formatDateTime(item.lastUpdated)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => void handleAction(item.id)}
                                disabled={activeSettingId !== null}
                                className="text-sm text-[var(--primary)] font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {activeSettingId === item.id ? "Updating..." : item.actionLabel}
                            </button>
                        </div>
                    ))}

                    {settings.length === 0 && (
                        <div className="rounded-2xl bg-[var(--insurai-surface-container-lowest)] p-8 text-sm text-[var(--insurai-on-surface-variant)] ambient-shadow ghost-border">
                            No security settings are available for this account yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
