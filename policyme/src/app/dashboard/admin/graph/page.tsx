"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { GraphDocumentRecord, GraphOperationRecord } from "@/lib/demo-store";

type GraphResponse = {
    documents?: GraphDocumentRecord[];
    operations?: GraphOperationRecord[];
    error?: string;
};

function formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function statusTone(status: GraphDocumentRecord["status"]): string {
    if (status === "Committed") {
        return "text-emerald-600";
    }
    if (status === "Failed") {
        return "text-red-600";
    }

    return "text-amber-600";
}

export default function KnowledgeGraphPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [documents, setDocuments] = useState<GraphDocumentRecord[]>([]);
    const [operations, setOperations] = useState<GraphOperationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReindexing, setIsReindexing] = useState(false);
    const [isRefreshingVectors, setIsRefreshingVectors] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadGraphData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/graph", { cache: "no-store" });
            const payload = (await response.json()) as GraphResponse;

            if (!response.ok) {
                throw new Error(payload.error || "Unable to load graph activity.");
            }

            setDocuments(payload.documents || []);
            setOperations(payload.operations || []);
            setError(null);
        } catch (loadError: unknown) {
            setError(loadError instanceof Error ? loadError.message : "Unable to load graph activity.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadGraphData();
    }, []);

    const runGraphOperation = async (action: "reindex" | "refresh_vectors") => {
        const setPending = action === "reindex" ? setIsReindexing : setIsRefreshingVectors;

        try {
            setPending(true);
            const response = await fetch("/api/graph/operations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action }),
            });
            const payload = (await response.json()) as {
                operation?: GraphOperationRecord;
                error?: string;
            };

            if (!response.ok || !payload.operation) {
                throw new Error(payload.error || "Unable to complete graph operation.");
            }

            await loadGraphData();
            toast.success(payload.operation.detail);
        } catch (operationError: unknown) {
            const message = operationError instanceof Error ? operationError.message : "Unable to complete graph operation.";
            setError(message);
            toast.error(message);
        } finally {
            setPending(false);
        }
    };

    const uploadDocuments = () => {
        fileInputRef.current?.click();
    };

    const onFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        try {
            setIsUploading(true);
            const uploads = Array.from(files);

            for (const file of uploads) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("userId", "admin@policyme-demo.com");

                const response = await fetch("/api/documents/upload", {
                    method: "POST",
                    body: formData,
                });
                const payload = (await response.json()) as {
                    error?: string;
                    source?: string;
                };

                if (!response.ok) {
                    throw new Error(payload.error || `Unable to upload ${file.name}.`);
                }

                if (payload.source === "demo") {
                    toast.message(`${file.name} ingested in demo mode.`);
                }
            }

            await loadGraphData();
            toast.success(`Queued ${files.length} document(s) for ingestion.`);
        } catch (uploadError: unknown) {
            const message = uploadError instanceof Error ? uploadError.message : "Unable to upload documents.";
            setError(message);
            toast.error(message);
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const openProcessingHistory = () => {
        router.push("/dashboard/admin/audit");
    };

    const pipelineDocuments = documents.filter((document) => document.status !== "Committed").slice(0, 3);
    const recentDocuments = documents.slice(0, 6);
    const latestOperation = operations[0] || null;

    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(event) => void onFilesSelected(event)}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">
                        Knowledge Graph Operations
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed max-w-xl">
                        Upload policy documents, monitor ingestion progress, and trigger graph maintenance actions from one live console.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => void runGraphOperation("reindex")}
                        disabled={isReindexing || isUploading}
                        className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest bg-[var(--insurai-surface-container-low)] text-[var(--insurai-on-surface)] border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container)] transition-colors uppercase flex items-center gap-2 disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                        {isReindexing ? "Reindexing..." : "Reindex Nodes"}
                    </button>
                    <button
                        onClick={uploadDocuments}
                        disabled={isUploading}
                        className="px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest bg-[var(--primary)] text-white hover:bg-[var(--insurai-primary-container)] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-[var(--primary)]/20 uppercase border border-[var(--primary)]/50 disabled:opacity-70"
                    >
                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                        {isUploading ? "Uploading..." : "Upload Documents"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-[#0a0f18] rounded-2xl border border-[var(--primary)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col min-h-[500px] relative">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between text-white/80 absolute w-full z-20 backdrop-blur-md bg-[#0a0f18]/40">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-sm text-[var(--primary)]">hub</span>
                            <span className="text-xs font-bold tracking-wider">NETWORK TOPOLOGY SIMULATION</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            ACTIVE RENDER
                        </div>
                    </div>

                    <div className="flex-1 relative w-full h-[500px]">
                        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 800 500">
                            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#graph-grid)" />
                            <path d="M400,250 L200,150" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4"></path>
                            <path d="M400,250 L600,150" stroke="rgba(0,82,209,0.3)" strokeWidth="3"></path>
                            <path d="M400,250 L300,400" stroke="rgba(0,82,209,0.3)" strokeWidth="3"></path>
                            <path d="M400,250 L550,380" stroke="rgba(255,255,255,0.1)" strokeWidth="2"></path>
                            <circle cx="400" cy="250" r="28" fill="rgba(8,15,31,0.8)" stroke="rgba(0,82,209,0.8)" strokeWidth="4"></circle>
                            <circle cx="400" cy="250" r="14" fill="var(--primary)" className="animate-pulse"></circle>
                            <circle cx="200" cy="150" r="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"></circle>
                            <circle cx="600" cy="150" r="22" fill="rgba(0,82,209,0.1)" stroke="var(--primary)" strokeWidth="2"></circle>
                            <circle cx="300" cy="400" r="20" fill="rgba(0,82,209,0.1)" stroke="var(--primary)" strokeWidth="2"></circle>
                            <circle cx="550" cy="380" r="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"></circle>
                        </svg>

                        <div className="absolute top-[52%] left-[46%] w-min whitespace-nowrap text-[10px] font-bold text-white/90 bg-[#0a0f18]/80 px-2 py-1 rounded border border-white/10 backdrop-blur-sm pointer-events-none">
                            Policy_HO4_Master
                        </div>
                        <div className="absolute top-[28%] left-[76%] text-[9px] font-bold text-[var(--primary)] uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/30 pointer-events-none">
                            Water Damage
                        </div>
                        <div className="absolute top-[82%] left-[34%] text-[9px] font-bold text-[var(--primary)] uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/30 pointer-events-none">
                            Schedule A
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-[#0a0f18]/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center text-white">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Active Cluster</p>
                            <p className="text-sm font-bold">prod-graph-alpha-1</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Documents</p>
                                <p className="text-sm font-bold text-[var(--primary)]">{documents.length}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Latest Operation</p>
                                <p className="text-sm font-bold text-emerald-400">
                                    {latestOperation ? formatDateTime(latestOperation.executedAt) : "Idle"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl p-6 border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex-1">
                        <div className="flex items-center justify-between border-b border-[var(--insurai-outline-variant)]/10 pb-4 mb-4">
                            <h3 className="font-bold text-lg">Ingestion Pipeline</h3>
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-[pulse_2s_infinite]"></span>
                        </div>

                        {isLoading ? (
                            <p className="text-sm text-[var(--insurai-on-surface-variant)]">Loading pipeline activity...</p>
                        ) : pipelineDocuments.length > 0 ? (
                            <div className="space-y-6">
                                {pipelineDocuments.map((document) => (
                                    <div key={document.id}>
                                        <div className="flex justify-between items-start mb-2 gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-[18px]">description</span>
                                                <p className="text-xs font-bold truncate">{document.name}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-[var(--primary)]">{document.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden mb-2">
                                            <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${document.progress}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-[var(--insurai-on-surface-variant)] uppercase tracking-wider">
                                            {document.stage}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                                No documents are currently in progress.
                            </p>
                        )}

                        <button
                            onClick={openProcessingHistory}
                            className="w-full mt-6 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-xs font-bold text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-colors"
                        >
                            View Processing History
                        </button>
                    </div>

                    <button
                        onClick={() => void runGraphOperation("refresh_vectors")}
                        disabled={isRefreshingVectors || isUploading}
                        className="bg-gradient-to-br from-[#003B91] to-[#0054d6] rounded-2xl p-6 relative overflow-hidden text-white shadow-[0_15px_30px_rgba(0,82,209,0.3)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group disabled:opacity-70 disabled:hover:scale-100"
                    >
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <span className="material-symbols-outlined text-4xl mb-4">cached</span>
                            <div>
                                <h4 className="text-xl font-bold mb-1">Global Vector Refresh</h4>
                                <p className="text-xs font-medium opacity-80 leading-snug">
                                    {isRefreshingVectors
                                        ? "Refreshing embeddings across all clusters..."
                                        : "Sync vector metadata and capture a completed operation record."}
                                </p>
                            </div>
                        </div>
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute right-4 bottom-4 w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px]">arrow_forward</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="mt-6 bg-[var(--insurai-surface-container-lowest)] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 border-b border-[var(--insurai-surface-container-high)]">
                    <h3 className="text-lg font-bold">Recent Graph Conversions</h3>
                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">
                        Uploaded documents and their latest ingestion status.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--insurai-surface-container-low)]/50 border-b border-[var(--insurai-outline-variant)]/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Document Origin</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Nodes Gen</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Edges Formed</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Duration</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--insurai-surface-container-highest)]/30">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-sm text-[var(--insurai-on-surface-variant)]">
                                        Loading graph conversions...
                                    </td>
                                </tr>
                            ) : recentDocuments.length > 0 ? (
                                recentDocuments.map((document) => (
                                    <tr key={document.id} className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                                                    <span className="material-symbols-outlined text-[16px]">description</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[var(--insurai-on-surface)]">{document.name}</p>
                                                    <p className="text-[10px] text-[var(--insurai-on-surface-variant)] mt-0.5">
                                                        {document.sizeLabel} • {document.pages} Pages • {document.source}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--primary)]">{document.nodesGenerated.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--primary)]">{document.edgesFormed.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-[var(--insurai-on-surface-variant)]">{document.durationLabel}</td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 text-[10px] uppercase font-bold ${statusTone(document.status)}`}>
                                                <span className="material-symbols-outlined text-[14px]">
                                                    {document.status === "Committed" ? "check_circle" : document.status === "Failed" ? "error" : "hourglass_top"}
                                                </span>
                                                {document.status}
                                            </span>
                                            <p className="mt-1 text-[10px] text-[var(--insurai-on-surface-variant)]">
                                                {formatDateTime(document.uploadedAt)}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-sm text-[var(--insurai-on-surface-variant)]">
                                        No document conversions are available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
