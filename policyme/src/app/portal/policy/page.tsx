"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Calendar, DollarSign, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";

const policies = [
    {
        id: "POL-AUTO-2026-001",
        name: "Comprehensive Auto Insurance",
        type: "Auto",
        status: "Active",
        premium: "$142/mo",
        startDate: "Jan 1, 2026",
        endDate: "Dec 31, 2026",
        coverage: [
            { item: "Collision Damage", limit: "$50,000", deductible: "$500" },
            { item: "Comprehensive (Theft, Weather)", limit: "$50,000", deductible: "$250" },
            { item: "Bodily Injury Liability", limit: "$100,000 per person", deductible: "None" },
            { item: "Property Damage Liability", limit: "$50,000", deductible: "None" },
            { item: "Windshield Replacement", limit: "Full coverage", deductible: "$0" },
            { item: "Rental Car Reimbursement", limit: "$40/day, 30 days max", deductible: "None" },
        ],
    },
    {
        id: "POL-PROP-2026-003",
        name: "Homeowner's Insurance",
        type: "Property",
        status: "Active",
        premium: "$210/mo",
        startDate: "Mar 1, 2026",
        endDate: "Feb 28, 2027",
        coverage: [
            { item: "Dwelling Coverage", limit: "$350,000", deductible: "$1,000" },
            { item: "Personal Property", limit: "$175,000", deductible: "$500" },
            { item: "Liability Protection", limit: "$300,000", deductible: "None" },
            { item: "Water Damage (Non-Flood)", limit: "$50,000", deductible: "$1,000" },
        ],
    },
];

export default function MyPolicyPage() {
    const [expandedPolicy, setExpandedPolicy] = useState<string | null>(policies[0].id);

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-900">My Policies</h1>
                <p className="text-slate-500 mt-1">View your active insurance policies and coverage details.</p>
            </motion.div>

            <div className="space-y-4">
                {policies.map((policy, i) => {
                    const isExpanded = expandedPolicy === policy.id;

                    return (
                        <motion.div
                            key={policy.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                        >
                            {/* Policy Header */}
                            <button
                                onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-100">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{policy.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-mono text-slate-400">{policy.id}</span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                                                <CheckCircle2 className="h-3 w-3" /> {policy.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-lg font-bold text-slate-900">{policy.premium}</p>
                                        <p className="text-xs text-slate-400">Monthly Premium</p>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="border-t border-slate-100"
                                >
                                    {/* Meta Info */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50/50">
                                        {[
                                            { icon: FileText, label: "Type", value: policy.type },
                                            { icon: DollarSign, label: "Premium", value: policy.premium },
                                            { icon: Calendar, label: "Start", value: policy.startDate },
                                            { icon: Calendar, label: "End", value: policy.endDate },
                                        ].map((meta) => (
                                            <div key={meta.label} className="flex items-center gap-2">
                                                <meta.icon className="h-4 w-4 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-400">{meta.label}</p>
                                                    <p className="text-sm font-medium text-slate-700">{meta.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Coverage Table */}
                                    <div className="p-5">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Coverage Details</h4>
                                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-500">
                                                        <th className="text-left px-4 py-2.5 font-medium">Coverage Item</th>
                                                        <th className="text-left px-4 py-2.5 font-medium">Limit</th>
                                                        <th className="text-left px-4 py-2.5 font-medium">Deductible</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {policy.coverage.map((item, j) => (
                                                        <tr key={j} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                                                            <td className="px-4 py-3 text-slate-700 font-medium">{item.item}</td>
                                                            <td className="px-4 py-3 text-slate-600">{item.limit}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.deductible === "None" || item.deductible === "$0"
                                                                        ? "bg-emerald-50 text-emerald-700"
                                                                        : "bg-slate-100 text-slate-600"
                                                                    }`}>
                                                                    {item.deductible}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
