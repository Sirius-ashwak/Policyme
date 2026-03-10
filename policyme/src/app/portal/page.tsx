"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

const claims = [
    {
        id: "CLM-2026-48291",
        type: "Auto — Collision",
        date: "Mar 2, 2026",
        status: "Approved",
        amount: "$4,250.00",
        description: "Rear-end collision at intersection of Main St & 5th Ave. Bumper and trunk damage.",
    },
    {
        id: "CLM-2026-48350",
        type: "Auto — Comprehensive",
        date: "Mar 3, 2026",
        status: "Under Review",
        amount: "$1,800.00",
        description: "Windshield cracked by fallen tree branch during storm.",
    },
    {
        id: "CLM-2026-48412",
        type: "Property — Water Damage",
        date: "Mar 4, 2026",
        status: "Pending",
        amount: "$12,500.00",
        description: "Basement flooding due to burst pipe. Damage to flooring and furniture.",
    },
];

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    Approved: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
    "Under Review": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
    Pending: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: AlertCircle },
};

export default function PortalHome() {
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, John</h1>
                <p className="text-slate-500 mt-1">Here's the latest on your insurance claims.</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Active Claims", value: "3", color: "from-blue-500 to-indigo-500" },
                    { label: "Approved", value: "1", color: "from-emerald-500 to-teal-500" },
                    { label: "Pending Review", value: "2", color: "from-amber-500 to-orange-500" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color}`} />
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Claims List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Your Claims</h2>
                    <Link href="/portal/submit"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                        File New Claim <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {claims.map((claim, i) => {
                        const config = statusConfig[claim.status];
                        const StatusIcon = config.icon;

                        return (
                            <motion.div
                                key={claim.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-mono text-slate-400">{claim.id}</span>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {claim.status}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-slate-900">{claim.type}</h3>
                                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{claim.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 sm:text-right">
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">{claim.amount}</p>
                                            <p className="text-xs text-slate-400">{claim.date}</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
