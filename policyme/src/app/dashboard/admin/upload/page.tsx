"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [recentFiles, setRecentFiles] = useState([
        { name: "2026_Employee_Handbook_v2.pdf", status: "success", time: "10 mins ago" },
        { name: "IT_Security_Vendor_Policy.docx", status: "success", time: "2 hours ago" },
        { name: "Scanned_Legacy_Contracts_1999.pdf", status: "error", time: "Yesterday" },
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (!file) return;
        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", "admin@policyme-demo.com");

        try {
            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setUploadStatus("Document ingested successfully and queued for parsing.");
                setRecentFiles([{ name: file.name, status: "success", time: "Just now" }, ...recentFiles]);
            } else {
                setUploadStatus(`Error: ${data.error}`);
            }
        } catch (err) {
            setUploadStatus("Failed to connect to ingestion server.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="flex-1 p-6 md:p-10 max-w-4xl w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Ingest Documents</h1>
                <p className="text-muted-foreground text-lg">Upload corporate policies to expand the knowledge graph.</p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed bg-muted/10 p-12 text-center transition-all cursor-pointer group mb-4 ${isDragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-muted/20"
                    } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
            >
                <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 className="h-10 w-10 text-primary animate-spin" /> : <UploadCloud className="h-10 w-10 text-primary" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                    {isUploading ? "Uploading & Ingesting..." : "Click to Upload or Drag and Drop"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Supported formats: PDF, DOCX, TXT (Max size 50MB per file). Documents will be OCR scanned and parsed into Graph nodes automatically.
                </p>
                <Button disabled={isUploading} size="lg" className="px-8">
                    {isUploading ? "Processing..." : "Select Files from Computer"}
                </Button>
            </motion.div>

            {uploadStatus && (
                <div className={`mb-8 p-4 rounded-lg text-sm font-medium ${uploadStatus.includes("Error") || uploadStatus.includes("Failed") ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"}`}>
                    {uploadStatus}
                </div>
            )}

            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Recent Uploads
                </h3>

                <div className="space-y-3">
                    {recentFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                            <div className="flex items-center gap-4">
                                <File className="h-8 w-8 text-muted-foreground/50" />
                                <div>
                                    <p className="font-medium text-sm">{file.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{file.time}</p>
                                </div>
                            </div>
                            <div>
                                {file.status === "success" ? (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                        <CheckCircle2 className="h-4 w-4" /> Parsed successfully
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                                        <AlertCircle className="h-4 w-4" /> OCR Failed (Poor quality)
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
