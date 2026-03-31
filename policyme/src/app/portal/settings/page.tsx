"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function SettingsPage() {
    const { t } = useLanguage();

    const settings = [
        { icon: "lock", title: t("settings.password"), desc: t("settings.password_desc"), action: t("settings.update") },
        { icon: "security", title: t("settings.twofa"), desc: t("settings.twofa_desc"), action: t("settings.manage") },
        { icon: "notifications", title: t("settings.notifications"), desc: t("settings.notifications_desc"), action: t("settings.configure") },
        { icon: "visibility", title: t("settings.privacy"), desc: t("settings.privacy_desc"), action: t("settings.review") },
    ];

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">{t("settings.title")}</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    {t("settings.subtitle")}
                </p>
            </header>

            <div className="space-y-6 max-w-2xl">
                {settings.map((item) => (
                    <div key={item.title} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[var(--insurai-surface-container-low)] rounded-xl flex items-center justify-center text-[var(--insurai-on-surface-variant)]">
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{item.title}</h3>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">{item.desc}</p>
                            </div>
                        </div>
                        <button className="text-sm text-[var(--primary)] font-semibold hover:underline">{item.action}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
