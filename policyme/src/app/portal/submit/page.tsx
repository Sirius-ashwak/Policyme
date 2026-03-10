"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, FileText, CheckCircle2, AlertCircle, Car, Home, Heart, Sparkles, ArrowRight } from "lucide-react";
import AIChatbot from "@/components/AIChatbot";

const policyTypeLabels: Record<string, string> = {
    "auto-collision": "Vehicle Collision",
    "auto-comprehensive": "Comprehensive Damage",
    "property": "Property & Casualty",
    "health": "Health / Medical",
};

const policyTypeIcons: Record<string, any> = {
    "auto-collision": Car,
    "auto-comprehensive": Car,
    "property": Home,
    "health": Heart,
};

interface ExtractedData {
    claimType?: string;
    description?: string;
    amount?: string;
    date?: string;
    location?: string;
}

export default function SubmitClaimPage() {
    const [submitted, setSubmitted] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData>({});
    const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleClaimExtracted = (data: ExtractedData) => {
        setExtractedData(data);
        // Trigger auto-fill animation
        setTimeout(() => setIsAutoFilled(true), 500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Claim Submitted!</h2>
                    <p className="text-slate-500 mb-2">Your AI-assisted claim has been sent for processing.</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                        <p className="text-sm text-blue-700 font-medium">Claim ID: CLM-2026-48450</p>
                        <p className="text-xs text-blue-500 mt-1">Estimated AI processing time: 2 minutes</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 text-left">
                        <p className="text-xs text-slate-500 font-medium mb-2">What happens next:</p>
                        <div className="space-y-2">
                            {["AI GraphRAG engine analyzes your claim against policy rules", "Claims adjuster reviews AI recommendation", "You'll be notified of the decision on your dashboard"].map((step, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                                    <p className="text-xs text-slate-600">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const TypeIcon = extractedData.claimType ? policyTypeIcons[extractedData.claimType] : null;

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">AI-Assisted</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">File a New Claim</h1>
                <p className="text-slate-500 mt-1">Chat with our AI assistant, it will auto-fill your claim form in seconds.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: AI Chatbot */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <AIChatbot onClaimExtracted={handleClaimExtracted} />
                </motion.div>

                {/* Right: Auto-Filling Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden" style={{ height: "480px" }}>
                        {/* Form Header */}
                        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-slate-700">Claim Form</h3>
                            <AnimatePresence>
                                {isAutoFilled && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
                                    >
                                        <Sparkles className="h-3 w-3" /> AI Auto-Filled
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: "420px" }}>
                            {/* Claim Type */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Claim Type</label>
                                <motion.div
                                    animate={isAutoFilled ? { borderColor: "#3b82f6", backgroundColor: "#eff6ff" } : {}}
                                    transition={{ duration: 0.5 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                                >
                                    {TypeIcon ? <TypeIcon className="h-5 w-5 text-blue-600" /> : <Car className="h-5 w-5 text-slate-300" />}
                                    <select
                                        value={extractedData.claimType || ""}
                                        onChange={(e) => setExtractedData({ ...extractedData, claimType: e.target.value })}
                                        className={`flex-1 bg-transparent text-sm font-medium focus:outline-none appearance-none cursor-pointer ${extractedData.claimType ? "text-slate-900" : "text-slate-400"}`}
                                    >
                                        <option value="" disabled>Waiting for AI or select manually...</option>
                                        {Object.entries(policyTypeLabels).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                    {isAutoFilled && <CheckCircle2 className="h-4 w-4 text-blue-500 ml-auto" />}
                                </motion.div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date of Incident</label>
                                <motion.div
                                    animate={isAutoFilled ? { borderColor: "#3b82f6", backgroundColor: "#eff6ff" } : {}}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex"
                                >
                                    <input
                                        type="text"
                                        value={extractedData.date || ""}
                                        onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                                        placeholder="Waiting for AI or enter date..."
                                        className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                                    />
                                </motion.div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                                <motion.div
                                    animate={isAutoFilled ? { borderColor: "#3b82f6", backgroundColor: "#eff6ff" } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white min-h-[60px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex"
                                >
                                    <textarea
                                        value={extractedData.description || ""}
                                        onChange={(e) => setExtractedData({ ...extractedData, description: e.target.value })}
                                        placeholder="Waiting for AI or describe here..."
                                        rows={2}
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                                    />
                                </motion.div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Estimated Amount</label>
                                <motion.div
                                    animate={isAutoFilled ? { borderColor: "#3b82f6", backgroundColor: "#eff6ff" } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex items-center gap-2"
                                >
                                    <span className="text-slate-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        value={extractedData.amount || ""}
                                        onChange={(e) => setExtractedData({ ...extractedData, amount: e.target.value })}
                                        placeholder="0.00 (Waiting for AI or enter amount)"
                                        className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                                    />
                                </motion.div>
                            </div>

                            {/* Photo Upload (manual) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Evidence Photos (Optional)</label>
                                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                                        <p className="text-xs text-slate-500 font-medium">
                                            {files.length > 0 ? `${files.length} file(s) attached` : "Click to upload photos"}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!extractedData.claimType || !extractedData.description}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Submit Claim
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
