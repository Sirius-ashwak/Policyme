"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇮🇳" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeLang = languages.find((l) => l.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {activeLang.flag}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {activeLang.code.toUpperCase()}
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                    expand_more
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 glass-dropdown rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                                    language === lang.code
                                        ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold opacity-70">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </div>
                                {language === lang.code && (
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
