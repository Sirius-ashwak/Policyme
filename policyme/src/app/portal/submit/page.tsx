"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatbot from "@/components/AIChatbot";

type ClaimExtraction = {
    claimType?: string;
    claim_type?: string;
    description?: string;
    amount?: string;
    estimated_amount?: string;
    date?: string;
    incident_date?: string;
    location?: string;
};

export default function SubmitClaimPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [claimType, setClaimType] = useState("");
    const [incidentDate, setIncidentDate] = useState("");
    const [incidentTime, setIncidentTime] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [estimatedAmount, setEstimatedAmount] = useState("");
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const { t } = useLanguage();

    const steps = [
        { label: t("submit.step_details"), key: "details" },
        { label: t("submit.step_evidence"), key: "evidence" },
        { label: t("submit.step_review"), key: "review" },
    ];

    const handleClaimExtracted = (data: ClaimExtraction) => {
        const extractedType = data.claimType || data.claim_type;
        const extractedDate = data.date || data.incident_date;
        const extractedAmount = data.amount || data.estimated_amount;

        if (extractedType) setClaimType(extractedType);
        if (extractedDate) setIncidentDate(extractedDate);
        if (data.description) setDescription(data.description);
        if (data.location) setLocation(data.location);
        if (extractedAmount) setEstimatedAmount(extractedAmount);
    };

    const handleBackAction = () => {
        if (currentStep === 0) {
            window.location.assign("/portal");
            return;
        }

        setSubmitMessage(null);
        setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    const handlePrimaryAction = () => {
        if (currentStep === steps.length - 1) {
            setSubmitMessage("Claim submitted successfully. You can track progress in Claims History.");
            return;
        }

        setSubmitMessage(null);
        setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
    };

    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            {/* Minimal Top Bar - Distraction Free */}
            <header className="fixed top-0 w-full z-50 bg-[var(--insurai-surface)]/80 backdrop-blur-[20px]">
                <div className="max-w-3xl mx-auto h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/portal" className="flex items-center gap-2 text-[var(--primary)] hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="font-['Inter'] text-sm font-medium">{t("submit.dashboard")}</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tighter text-[var(--insurai-on-surface)]">InsurAI</span>
                    </div>
                    <div className="w-24 flex justify-end">
                        <Link href="/support" className="text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">
                            <span className="material-symbols-outlined">help_outline</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-xl mx-auto animate-fade-in font-['Manrope']">
                    
                    {/* Step Indicator */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">{t("submit.title")}</h1>
                            <span className="font-['Inter'] text-xs font-semibold text-[var(--primary)] bg-[var(--insurai-primary-fixed)]/30 px-3 py-1 rounded-full">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </div>
                        
                        <div className="flex gap-2 h-1.5 w-full">
                            {steps.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 rounded-full transition-colors duration-500 bg-gradient-to-r ${
                                        i <= currentStep ? "from-[var(--primary)] to-[var(--primary)]" : "from-[var(--insurai-surface-container-high)] to-[var(--insurai-surface-container-high)]"
                                    }`} 
                                />
                            ))}
                        </div>
                        
                        <div className="flex justify-between mt-3">
                            {steps.map((step, i) => (
                                <span 
                                    key={step.key} 
                                    className={`font-['Inter'] text-[10px] font-bold uppercase tracking-widest ${
                                        i <= currentStep ? "text-[var(--primary)]" : "text-[var(--insurai-on-surface-variant)] opacity-40"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="space-y-10">
                        {/* Step 1: Basic Info */}
                        <div className={currentStep === 0 ? "block" : "hidden"}>
                            <section className="space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">{t("submit.incident_details")}</h2>
                                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">{t("submit.incident_subtitle")}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] font-['Inter']">AI Claim Assistant</p>
                                    <AIChatbot onClaimExtracted={handleClaimExtracted} />
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">
                                        Ask the assistant what happened, when it occurred, and estimated damage. It will auto-fill your claim details below.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    
                                    {/* Incident Type */}
                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.claim_type")}</label>
                                        <div className="relative">
                                            <select
                                                value={claimType}
                                                onChange={(e) => setClaimType(e.target.value)}
                                                className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 appearance-none font-medium text-[var(--insurai-on-surface)] cursor-pointer focus:ring-4 focus:ring-[var(--primary)]/10"
                                            >
                                                <option>Select incident type</option>
                                                <option>auto-collision</option>
                                                <option>auto-comprehensive</option>
                                                <option>property</option>
                                                <option>health</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--insurai-on-surface-variant)]">
                                                <span className="material-symbols-outlined">unfold_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Date and Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.date_of_incident")}</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={incidentDate}
                                                    onChange={(e) => setIncidentDate(e.target.value)}
                                                    className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.approx_time")}</label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={incidentTime}
                                                    onChange={(e) => setIncidentTime(e.target.value)}
                                                    className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Location</label>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="City, province, or incident address"
                                                className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Estimated Damage Amount</label>
                                            <input
                                                type="text"
                                                value={estimatedAmount}
                                                onChange={(e) => setEstimatedAmount(e.target.value)}
                                                placeholder="e.g. 2400"
                                                className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">{t("submit.description")}</label>
                                        <textarea 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] resize-none placeholder:text-[var(--insurai-on-surface-variant)]/50 focus:ring-4 focus:ring-[var(--primary)]/10" 
                                            placeholder="Provide a detailed account of the events leading up to the incident..." 
                                            rows={5} 
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: File Upload */}
                            <section className="space-y-6 mt-10">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">{t("submit.evidence_title")}</h2>
                                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">{t("submit.evidence_subtitle")}</p>
                                </div>
                                
                                <div className="group relative">
                                    <div className="border-2 border-dashed border-[var(--insurai-outline-variant)]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[var(--insurai-surface-container-low)] transition-all group-hover:bg-[var(--insurai-surface-container)] cursor-pointer">
                                        <div className="w-16 h-16 rounded-full bg-[var(--insurai-primary-container)]/10 flex items-center justify-center text-[var(--primary)] mb-4 group-hover:scale-105 transition-transform">
                                            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                        </div>
                                        <p className="font-semibold mb-1">{t("submit.drag_drop")}</p>
                                        <p className="text-[var(--insurai-on-surface-variant)] text-xs mb-6">{t("submit.file_types")}</p>
                                        <button className="bg-white dark:bg-slate-800 border border-[var(--insurai-outline-variant)]/20 px-6 py-2.5 rounded-lg font-['Inter'] text-sm font-semibold shadow-sm group-hover:-translate-y-0.5 active:scale-95 transition-all text-slate-700 dark:text-slate-200">
                                            {t("submit.browse_files")}
                                        </button>
                                    </div>
                                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                
                                {/* File List (Simulated) */}
                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center justify-between p-4 bg-[var(--insurai-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--insurai-outline-variant)]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-[var(--insurai-surface-container-high)] overflow-hidden">
                                                <img 
                                                    className="w-full h-full object-cover grayscale opacity-80" 
                                                    alt="blurred close-up of car bumper damage" 
                                                    src="https://images.unsplash.com/photo-1542451372-887e58f00122?w=100&h=100&fit=crop"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">damage_front_right.jpg</p>
                                                <p className="text-[10px] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">1.2 MB • Uploading 80%</p>
                                            </div>
                                        </div>
                                        <button className="text-[var(--insurai-on-surface-variant)] hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Step 2/3 Placeholders for interactivity */}
                        <div className={currentStep === 1 ? "block" : "hidden"}>
                             <div className="space-y-6">
                                <h2 className="text-lg font-bold">{t("submit.additional_evidence")}</h2>
                                <div className="border border-[var(--insurai-outline-variant)]/20 rounded-xl p-8 bg-[var(--insurai-surface-container-lowest)]">
                                     <p className="text-sm text-[var(--insurai-on-surface-variant)] text-center">More documents can be specified here.</p>
                                </div>
                             </div>
                        </div>
                        <div className={currentStep === 2 ? "block" : "hidden"}>
                             <div className="space-y-6">
                                <h2 className="text-lg font-bold">{t("submit.review_claim")}</h2>
                                <div className="border border-[var(--insurai-outline-variant)]/20 rounded-xl p-8 bg-[var(--insurai-surface-container-lowest)]">
                                     <h3 className="font-bold border-b border-[var(--insurai-surface-container-high)] pb-4 mb-4">Summary</h3>
                                     <div className="flex justify-between text-sm py-2">
                                         <span className="text-[var(--insurai-on-surface-variant)]">Claim Type</span>
                                         <span className="font-semibold">{claimType || "Not provided yet"}</span>
                                     </div>
                                     <div className="flex justify-between text-sm py-2">
                                         <span className="text-[var(--insurai-on-surface-variant)]">Incident Date</span>
                                         <span className="font-semibold">{incidentDate || "Not provided yet"}</span>
                                     </div>
                                     <div className="flex justify-between text-sm py-2">
                                         <span className="text-[var(--insurai-on-surface-variant)]">Estimated Amount</span>
                                         <span className="font-semibold">{estimatedAmount || "Not provided yet"}</span>
                                     </div>
                                </div>
                             </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-10 flex items-center justify-between">
                            <button 
                                onClick={handleBackAction}
                                className="px-6 py-4 font-['Inter'] text-sm font-bold text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors flex items-center gap-2"
                            >
                                {currentStep === 0 ? t("submit.save_for_later") : t("submit.back")}
                            </button>
                            <button 
                                onClick={handlePrimaryAction}
                                className="bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] px-10 py-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {currentStep === steps.length - 1 ? t("submit.submit_claim") : t("submit.continue")}
                            </button>
                        </div>

                        {submitMessage && (
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-4">{submitMessage}</p>
                        )}
                        
                        {/* Security/Trust Badge */}
                        <div className="flex items-center justify-center gap-2 pt-8 opacity-40">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest font-['Inter']">{t("submit.encrypted")}</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="max-w-xl mx-auto py-10 px-6 text-center border-t border-[var(--insurai-outline-variant)]/10">
                <p className="text-[11px] text-[var(--insurai-on-surface-variant)]/60 font-medium">
                    © 2024 InsurAI Financial Services. All claims are subject to verification and policy terms.
                </p>
            </footer>
        </div>
    );
}
