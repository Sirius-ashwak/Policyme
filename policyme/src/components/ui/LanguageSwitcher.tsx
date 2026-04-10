"use client";

import { useEffect, useRef, useState } from "react";
import { Language, useLanguage } from "@/contexts/LanguageContext";

const GOOGLE_TRANSLATE_MAX_SYNC_ATTEMPTS = 12;
const GOOGLE_TRANSLATE_RETRY_MS = 250;

type LanguageOption = {
    code: Language;
    name: string;
    region: string;
    flag: string;
};

const languages: LanguageOption[] = [
    { code: "en", name: "English", region: "Global", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", region: "India", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", region: "India", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", region: "India", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", region: "India", flag: "🇮🇳" },
];

function syncGoogleTranslateLanguage(language: Language, attempt = 0): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return;
    }

    const targetLanguage = language;
    const googTransValue = `/en/${targetLanguage}`;

    document.cookie = `googtrans=${googTransValue};path=/`;
    if (window.location.hostname) {
        document.cookie = `googtrans=${googTransValue};path=/;domain=${window.location.hostname}`;
    }

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!combo) {
        if (attempt < GOOGLE_TRANSLATE_MAX_SYNC_ATTEMPTS) {
            window.setTimeout(() => {
                syncGoogleTranslateLanguage(language, attempt + 1);
            }, GOOGLE_TRANSLATE_RETRY_MS);
        }
        return;
    }

    const nextValue = targetLanguage === "en" ? "en" : targetLanguage;
    if (combo.value !== nextValue) {
        combo.value = nextValue;
        combo.dispatchEvent(new Event("change"));
    }

    if (targetLanguage === "en" && combo.value !== "en") {
        combo.selectedIndex = 0;
        combo.dispatchEvent(new Event("change"));
    }
}

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        syncGoogleTranslateLanguage(language);
    }, [language]);

    const activeLang = languages.find((item) => item.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((current) => !current)}
                className="group relative flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-md transition-all hover:border-blue-300/70 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/60 dark:hover:border-blue-500/40"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-400/5 to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm ring-1 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700/60">
                        {activeLang.flag}
                    </span>
                    <span className="hidden min-w-[86px] text-left sm:block">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                            Language
                        </span>
                        <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {activeLang.name}
                        </span>
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 ring-1 ring-blue-200/70 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-700/60">
                        {activeLang.code}
                    </span>
                </span>
                <span
                    className={`material-symbols-outlined relative text-[18px] text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95"
                >
                    <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Select Interface Language
                    </p>
                    {languages.map((lang) => {
                        const isActive = language === lang.code;
                        return (
                            <button
                                key={lang.code}
                                role="menuitemradio"
                                aria-checked={isActive}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/70 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-700/60"
                                        : "text-slate-700 hover:bg-slate-100/90 dark:text-slate-300 dark:hover:bg-slate-800/80"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm ring-1 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700/60">
                                        {lang.flag}
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold leading-tight">{lang.name}</span>
                                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">{lang.region}</span>
                                    </span>
                                </span>
                                {isActive && <span className="material-symbols-outlined text-[18px]">check</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
