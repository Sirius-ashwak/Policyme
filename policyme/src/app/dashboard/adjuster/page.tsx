"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, Eye, AlertCircle, CheckCircle2,
    X, FileText, Activity, ShieldAlert, CreditCard, Clock
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import force graph for the evidence panel
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface Claim {
    id: string;
    customer: string;
    type: string;
    amount: string;
    date: string;
    description: string;
    aiStatus: "Approve" | "Review" | "Deny";
    confidence: number;
    evidenceText: string;
    graphData: any;
}

// Mock Database of Claims
const claimsData: Claim[] = [
    {
        id: "CLM-2026-48450",
        customer: "John Doe",
        type: "Vehicle Collision",
        amount: "$4,000.00",
        date: "Mar 3, 2026",
        description: "I was in a car accident yesterday on Main Street. My bumper is damaged.",
        aiStatus: "Approve",
        confidence: 95,
        evidenceText: "Policy 2026-001 Section 3.2.1 explicitly covers collision damage with a $500 deductible. The reported $4,000 damage is well within the $50,000 limit.",
        graphData: {
            nodes: [
                { id: "Claim", group: "claim", label: "Claim 48450", val: 10 },
                { id: "Policy", group: "policy", label: "Policy 2026-001", val: 8 },
                { id: "Clause", group: "clause", label: "Sec 3.2.1 (Collision)", val: 6 },
                { id: "Limit", group: "limit", label: "Limit: $50k", val: 4 }
            ],
            links: [
                { source: "Claim", target: "Policy", label: "filed_under" },
                { source: "Policy", target: "Clause", label: "contains" },
                { source: "Claim", target: "Clause", label: "evaluated_against" },
                { source: "Clause", target: "Limit", label: "has_constraint" }
            ]
        }
    },
    {
        id: "CLM-2026-48350",
        customer: "John Doe",
        type: "Comprehensive Damage",
        amount: "$1,800.00",
        date: "Mar 3, 2026",
        description: "Windshield cracked by a fallen tree branch during storm.",
        aiStatus: "Review",
        confidence: 72,
        evidenceText: "Comprehensive coverage applies, but the 'Act of God' storm documentation requires adjuster verification of local weather reports for Mar 3.",
        graphData: {
            nodes: [
                { id: "Claim", group: "claim", label: "Claim 48350", val: 10 },
                { id: "Policy", group: "policy", label: "Policy 2026-001", val: 8 },
                { id: "Clause", group: "clause", label: "Sec 4.1 (Weather)", val: 6 },
                { id: "Exception", group: "exception", label: "Act of God Check", val: 8 }
            ],
            links: [
                { source: "Claim", target: "Policy", label: "filed_under" },
                { source: "Policy", target: "Clause", label: "contains" },
                { source: "Clause", target: "Exception", label: "requires" },
                { source: "Claim", target: "Exception", label: "triggers" }
            ]
        }
    },
    {
        id: "CLM-2026-48112",
        customer: "Sarah Jenkins",
        type: "Property & Casualty",
        amount: "$12,500.00",
        date: "Mar 1, 2026",
        description: "Basement flooded due to burst pipe.",
        aiStatus: "Approve",
        confidence: 89,
        evidenceText: "Interior water damage from plumbing failure is covered under standard Dwelling Coverage (Coverage A).",
        graphData: { nodes: [], links: [] } // Omitted for brevity
    },
    {
        id: "CLM-2026-48099",
        customer: "Michael Chen",
        type: "Health / Medical",
        amount: "$8,200.00",
        date: "Feb 28, 2026",
        description: "Emergency room visit for broken arm.",
        aiStatus: "Deny",
        confidence: 98,
        evidenceText: "Incident occurred outside network coverage area without prior authorization. Out-of-network ER claims require life-threatening condition verification.",
        graphData: { nodes: [], links: [] }
    }
];

export default function ClaimsQueuePage() {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    const getStatusBadge = (status: string, confidence: number) => {
        if (status === "Approve") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve ({confidence}%)
                </span>
            );
        }
        if (status === "Review") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Needs Review ({confidence}%)
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                <ShieldAlert className="h-3.5 w-3.5" />
                Deny ({confidence}%)
            </span>
        );
    };

    return (
        <div className="relative h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Priority Claims Queue</h1>
                    <p className="text-muted-foreground mt-1">Review AI-pre-processed claims requiring adjuster authorization.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search ID, Name..."
                            className="bg-background border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                        />
                    </div>
                    <button className="p-2 border border-border rounded-md bg-background hover:bg-muted transition-colors">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Claim ID</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Customer</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Type</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">AI Status</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {claimsData.map((claim) => (
                            <tr
                                key={claim.id}
                                onClick={() => setSelectedClaim(claim)}
                                className={`group cursor-pointer transition-colors ${selectedClaim?.id === claim.id ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                            >
                                <td className="px-6 py-4 font-mono font-medium">{claim.id}</td>
                                <td className="px-6 py-4 font-medium text-foreground">{claim.customer}</td>
                                <td className="px-6 py-4 text-muted-foreground">{claim.type}</td>
                                <td className="px-6 py-4 font-medium">{claim.amount}</td>
                                <td className="px-6 py-4">{getStatusBadge(claim.aiStatus, claim.confidence)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); setSelectedClaim(claim); }}
                                    >
                                        <Eye className="h-3.5 w-3.5" /> Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Slide-out Panel (Sheet) */}
            <AnimatePresence>
                {selectedClaim && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedClaim(null)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                                        PolicyMe Evidence Engine
                                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest border border-primary/30">
                                            GraphRAG v2
                                        </span>
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1 font-mono">Examining {selectedClaim.id} • {selectedClaim.customer}</p>
                                </div>
                                <button onClick={() => setSelectedClaim(null)} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Panel Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                                {/* 1. Customer Claim Data */}
                                <section>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> 1. Customer Submission
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Incident Type</p>
                                            <p className="text-sm font-medium">{selectedClaim.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Date</p>
                                            <p className="text-sm font-medium">{selectedClaim.date}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-muted-foreground mb-1">Damage Description</p>
                                            <p className="text-sm italic text-foreground bg-background p-3 rounded-md border border-border">"{selectedClaim.description}"</p>
                                        </div>
                                    </div>
                                </section>

                                {/* 2. AI Decision */}
                                <section>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                                        <Activity className="h-4 w-4" /> 2. AI Evaluation
                                    </h3>
                                    <div className={`p-5 rounded-xl border ${selectedClaim.aiStatus === 'Approve' ? 'bg-emerald-500/10 border-emerald-500/30' : selectedClaim.aiStatus === 'Review' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold uppercase tracking-wider">Recommended Action</span>
                                            {getStatusBadge(selectedClaim.aiStatus, selectedClaim.confidence)}
                                        </div>
                                        <p className="text-sm leading-relaxed">
                                            {selectedClaim.evidenceText}
                                        </p>
                                    </div>
                                </section>

                                {/* 3. Mathematical Proof (Graph) */}
                                <section>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                                        <Activity className="h-4 w-4" /> 3. Mathematical Proof (Micro-Graph)
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        The AI generated this topological path through the policy document to arrive at its conclusion. Hover over nodes to see connections.
                                    </p>
                                    <div className="h-[250px] w-full rounded-xl border border-border overflow-hidden bg-[#0A0A0A] relative flex items-center justify-center">
                                        {selectedClaim.graphData.nodes.length > 0 ? (
                                            <ForceGraph2D
                                                graphData={selectedClaim.graphData}
                                                width={650}
                                                height={250}
                                                backgroundColor="#0A0A0A"
                                                nodeLabel="label"
                                                nodeColor={(node: any) => {
                                                    if (node.group === "claim") return "#3b82f6";
                                                    if (node.group === "policy") return "#8b5cf6";
                                                    if (node.group === "clause") return "#10b981";
                                                    return "#ef4444";
                                                }}
                                                nodeRelSize={6}
                                                linkColor={() => "rgba(255,255,255,0.2)"}
                                                linkWidth={2}
                                                linkDirectionalArrowLength={3.5}
                                                linkDirectionalArrowRelPos={1}
                                            />
                                        ) : (
                                            <div className="text-muted-foreground text-sm flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4" /> Graph visualization unavailable for this claim type
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Sticky Action Footer */}
                            <div className="p-6 border-t border-border bg-card flex items-center gap-4">
                                <button className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
                                    <CreditCard className="h-4 w-4" /> Authorize Payment
                                </button>
                                <button className="flex-1 py-3 px-4 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold flex items-center justify-center gap-2 transition-all">
                                    <Clock className="h-4 w-4" /> Request Adjuster Review
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
