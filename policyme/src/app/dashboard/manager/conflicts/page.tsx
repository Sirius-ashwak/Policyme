"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { ManagerConflictRecord, ManagerConflictResolution } from "@/lib/demo-store";

type ConflictsResponse = {
    conflicts?: ManagerConflictRecord[];
    error?: string;
};

type ConflictResponse = {
    conflict?: ManagerConflictRecord;
    error?: string;
};

export default function ConflictsPage() {
    const searchParams = useSearchParams();
    const focusedConflictId = searchParams.get("focus");
    const [conflicts, setConflicts] = useState<ManagerConflictRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isResolving, setIsResolving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadConflicts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/manager/conflicts", { cache: "no-store" });
                const payload = (await response.json()) as ConflictsResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load conflict data.");
                }

                if (isMounted) {
                    setConflicts(payload.conflicts || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load conflict data.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadConflicts();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!focusedConflictId) {
            return;
        }

        toast(`Focused conflict: ${focusedConflictId}`, {
            description: "Review this item and choose the preferred policy source.",
        });
    }, [focusedConflictId]);

    const handleResolve = async (id: string, resolution: ManagerConflictResolution) => {
        if (isResolving === id) {
            return;
        }

        try {
            setIsResolving(id);
            const response = await fetch(`/api/manager/conflicts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ resolution }),
            });
            const payload = (await response.json()) as ConflictResponse;

            if (!response.ok || !payload.conflict) {
                throw new Error(payload.error || "Unable to resolve conflict.");
            }

            setConflicts((current) =>
                current.map((conflict) =>
                    conflict.id === id ? payload.conflict as ManagerConflictRecord : conflict
                )
            );
            setError(null);
            toast.success(`${id} resolved with Source ${resolution}.`, {
                description: "Knowledge graph updates have been recorded.",
            });
        } catch (resolveError: unknown) {
            const message = resolveError instanceof Error ? resolveError.message : "Unable to resolve conflict.";
            setError(message);
            toast.error(message);
        } finally {
            setIsResolving(null);
        }
    };

    const openConflicts = conflicts.filter((conflict) => conflict.status === "Open");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Active Conflicts</h1>
                <p className="text-muted-foreground mt-2">
                    GraphRAG has detected contradictions and ambiguities in uploaded policy language. Resolve them to improve downstream AI accuracy.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="rounded-xl border border-border bg-card px-5 py-6 text-sm text-muted-foreground">
                        Loading conflict data...
                    </div>
                ) : openConflicts.length > 0 ? (
                    openConflicts.map((conflict, index) => (
                        <motion.div
                            key={conflict.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
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
                                        onClick={() => void handleResolve(conflict.id, "A")}
                                        disabled={isResolving === conflict.id}
                                        className="mt-4 w-full py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {isResolving === conflict.id ? "Resolving..." : "Enforce Source A"}
                                    </button>
                                </div>

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
                                        onClick={() => void handleResolve(conflict.id, "B")}
                                        disabled={isResolving === conflict.id}
                                        className="mt-4 w-full py-2 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-md hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {isResolving === conflict.id ? "Resolving..." : "Enforce Source B"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 text-center rounded-xl border border-dashed border-border"
                    >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">All Conflicts Resolved</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            The current contradiction register is clear. New findings will appear here as the knowledge graph is reprocessed.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
