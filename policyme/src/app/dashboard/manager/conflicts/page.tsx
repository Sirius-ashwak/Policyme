"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ConflictsPage() {
    const searchParams = useSearchParams();
    const [resolved, setResolved] = useState<string[]>([]);
    const focusedConflictId = searchParams.get("focus");

    const conflicts = [
        {
            id: "CONF-9281",
            severity: "High",
            description: "Contradiction in Rental Car Reimbursement limits.",
            sourceA: {
                doc: "Master Auto Policy 2026.pdf",
                section: "Section 4.1",
                text: "Rental car reimbursement is limited to $40/day for a maximum of 30 days."
            },
            sourceB: {
                doc: "Premium Rider Addendum.pdf",
                section: "Clause 2B",
                text: "Premium policyholders are entitled to unlimited rental car reimbursement up to $75/day."
            },
            affectedClaims: 14
        },
        {
            id: "CONF-9282",
            severity: "Medium",
            description: "Ambiguous definition of 'Flood Damage'.",
            sourceA: {
                doc: "Homeowners Policy Base.pdf",
                section: "Exclusions 3(a)",
                text: "Damage caused by surface water, waves, or tidal water is excluded."
            },
            sourceB: {
                doc: "Water Backup Endorsement.pdf",
                section: "Coverage",
                text: "Covers water backing up through sewers or drains, or overflowing from a sump."
            },
            affectedClaims: 3
        }
    ];

    const handleResolve = (id: string, resolution: "A" | "B") => {
        if (resolved.includes(id)) {
            return;
        }

        setResolved([...resolved, id]);
        toast.success(`${id} resolved with Source ${resolution}.`, {
            description: "Knowledge graph updates have been queued.",
        });
    };

    useEffect(() => {
        if (!focusedConflictId) {
            return;
        }

        toast(`Focused conflict: ${focusedConflictId}`, {
            description: "Review this item and choose the preferred policy source.",
        });
    }, [focusedConflictId]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Active Conflicts</h1>
                <p className="text-muted-foreground mt-2">
                    GraphRAG has detected potential contradictions in the uploaded policy documents. Resolve these to improve AI accuracy.
                </p>
            </div>

            <div className="space-y-4">
                {conflicts.map((conflict, i) => {
                    if (resolved.includes(conflict.id)) return null;

                    return (
                        <motion.div
                            key={conflict.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`rounded-xl border overflow-hidden ${
                                focusedConflictId === conflict.id
                                    ? "border-primary/40 ring-2 ring-primary/20"
                                    : "border-destructive/20"
                            } bg-destructive/5`}
                        >
                            <div className="p-4 border-b border-destructive/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-destructive">{conflict.description}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                                                {conflict.id}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Affects {conflict.affectedClaims} pending claims
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Source A */}
                                <div className="rounded-lg border bg-background p-4 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">Source A: {conflict.sourceA.doc}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">{conflict.sourceA.section}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic bg-muted p-3 rounded-md flex-1">
                                        &ldquo;{conflict.sourceA.text}&rdquo;
                                    </p>
                                    <button
                                        onClick={() => handleResolve(conflict.id, "A")}
                                        className="mt-4 w-full py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4" /> Enforce Source A
                                    </button>
                                </div>

                                {/* Source B */}
                                <div className="rounded-lg border bg-background p-4 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm font-medium">Source B: {conflict.sourceB.doc}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">{conflict.sourceB.section}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic bg-muted p-3 rounded-md flex-1">
                                        &ldquo;{conflict.sourceB.text}&rdquo;
                                    </p>
                                    <button
                                        onClick={() => handleResolve(conflict.id, "B")}
                                        className="mt-4 w-full py-2 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-md hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4" /> Enforce Source B
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {resolved.length === conflicts.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 text-center rounded-xl border border-dashed border-border"
                    >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">All Conflicts Resolved!</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            The GraphRAG knowledge base has been updated across the organization. AI accuracy is now optimal.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
