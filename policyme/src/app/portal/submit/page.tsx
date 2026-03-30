"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
    { label: "Incident Details", key: "details" },
    { label: "Evidence", key: "evidence" },
    { label: "Review", key: "review" },
];

export default function SubmitClaimPage() {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            {/* Minimal Top Bar */}
            <nav className="sticky top-0 z-50 glass-header shadow-[0_1px_0_0_rgba(0,0,0,0.05)] h-16 flex items-center justify-between px-6">
                <Link href="/portal" className="flex items-center gap-2 text-[var(--primary)] font-medium text-sm hover:underline">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Dashboard
                </Link>
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">InsurAI</span>
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </nav>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-[Manrope]">
                            File New Claim
                        </h1>
                    </div>
                    <span className="text-sm font-[Inter] font-semibold text-[var(--primary)]">
                        Step {currentStep + 1} of {steps.length}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex w-full gap-2 mb-3">
                        {steps.map((_, i) => (
                            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-[var(--insurai-surface-container-high)]">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        i <= currentStep ? "bg-[var(--primary)] w-full" : "w-0"
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        {steps.map((step, i) => (
                            <span
                                key={step.key}
                                className={`text-xs font-bold uppercase tracking-widest font-[Inter] ${
                                    i <= currentStep
                                        ? "text-[var(--primary)]"
                                        : "text-slate-400"
                                }`}
                            >
                                {step.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Step 1: Incident Details */}
                {currentStep === 0 && (
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Incident Details</h2>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                                Tell us what happened with your protected asset.
                            </p>
                        </div>

                        {/* Type of Claim */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                Type of Claim
                            </label>
                            <select className="w-full p-4 bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all appearance-none">
                                <option>Select incident type</option>
                                <option>Auto — Collision</option>
                                <option>Auto — Comprehensive</option>
                                <option>Property — Water Damage</option>
                                <option>Property — Fire</option>
                                <option>Property — Theft</option>
                            </select>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                    Date of Incident
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-4 bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/20 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                    Approx. Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-4 bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/20 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                Incident Description
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Provide a detailed account of the events leading up to the incident..."
                                className="w-full p-4 bg-[var(--insurai-surface-container-low)] border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--insurai-surface-container-lowest)] focus:border-blue-100 outline-none transition-all resize-none placeholder:text-slate-400"
                            />
                        </div>

                        {/* Supporting Evidence */}
                        <div>
                            <h2 className="text-xl font-bold mb-2">Supporting Evidence</h2>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm mb-6">
                                Upload photos of the damage or relevant documents.
                            </p>
                            <div className="border-2 border-dashed border-[var(--insurai-outline-variant)]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[var(--insurai-surface-container-low)] hover:bg-[var(--insurai-surface-container)] transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-[var(--primary)] text-2xl">cloud_upload</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                    Drag and drop files here
                                </p>
                                <p className="text-xs text-slate-400 mb-4">PNG, JPG or PDF up to 10MB each</p>
                                <button className="px-6 py-2 border border-[var(--insurai-outline-variant)]/30 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    Browse Files
                                </button>
                            </div>

                            {/* Uploaded file example */}
                            <div className="mt-4 flex items-center gap-4 p-4 bg-[var(--insurai-surface-container-lowest)] rounded-xl ghost-border">
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-500 text-lg">image</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">damage_front_right.jpg</p>
                                    <p className="text-xs text-slate-400">1.2 MB • UPLOADING 80%</p>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Evidence (simplified) */}
                {currentStep === 1 && (
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Additional Photos</h2>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                                Upload additional evidence photos to strengthen your claim.
                            </p>
                        </div>
                        <div className="border-2 border-dashed border-[var(--insurai-outline-variant)]/30 rounded-2xl p-16 flex flex-col items-center justify-center bg-[var(--insurai-surface-container-low)]">
                            <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">add_photo_alternate</span>
                            <p className="text-sm text-slate-500">Drag and drop additional photos here</p>
                        </div>
                    </div>
                )}

                {/* Step 3: Review (simplified) */}
                {currentStep === 2 && (
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Review Your Claim</h2>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm">
                                Please review the details before submitting.
                            </p>
                        </div>
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ghost-border space-y-4">
                            <div className="flex justify-between py-3 border-b border-[var(--insurai-surface-container-high)]">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Claim Type</span>
                                <span className="text-sm font-bold">Auto — Collision</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-[var(--insurai-surface-container-high)]">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Date</span>
                                <span className="text-sm font-bold">Oct 14, 2023</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-[var(--insurai-surface-container-high)]">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Documents</span>
                                <span className="text-sm font-bold">3 files uploaded</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Status</span>
                                <span className="text-sm font-bold text-[var(--primary)]">Ready to Submit</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-16">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        className={`flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors ${
                            currentStep === 0 ? "opacity-0 pointer-events-none" : ""
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Save for later
                    </button>
                    <button
                        onClick={() => {
                            if (currentStep < steps.length - 1) {
                                setCurrentStep(currentStep + 1);
                            }
                        }}
                        className="px-10 py-4 primary-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {currentStep === steps.length - 1 ? "Submit Claim" : "Continue to " + steps[currentStep + 1]?.label}
                    </button>
                </div>

                {/* Security Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        End-to-end encrypted secure submission
                    </p>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-[var(--insurai-surface-container-high)] text-center">
                    <p className="text-xs text-slate-400">
                        © 2024 InsurAI Financial Services. All claims are subject to verification and policy terms.
                    </p>
                </div>
            </main>
        </div>
    );
}
