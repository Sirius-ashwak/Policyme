import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/config/supabaseServer";
import { recordGraphUploadRepository } from "@/lib/supabase-repository";

function sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

async function uploadToSupabaseStorage(file: File): Promise<{ bucket: string; path: string }> {
    const supabase = getSupabaseAdminClient();
    const bucket = process.env.SUPABASE_GRAPH_BUCKET || "graph-source-docs";
    const path = `ingest/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, bytes, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
        });

    if (error) {
        throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    return { bucket, path };
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "A file upload is required." },
                { status: 400 }
            );
        }

        const ingestionUrl = process.env.INGESTION_API_URL || "http://localhost:8081";
        let storageUpload: { bucket: string; path: string } | null = null;
        let storageWarning: string | null = null;

        try {
            storageUpload = await uploadToSupabaseStorage(file);
        } catch (storageError: unknown) {
            storageWarning = storageError instanceof Error ? storageError.message : "Supabase storage unavailable";
        }

        try {
            const response = await fetch(`${ingestionUrl}/api/documents/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ingestion Backend Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            const documentResult = await recordGraphUploadRepository({
                name: file.name,
                mimeType: file.type || "application/octet-stream",
                sizeBytes: file.size,
                source: "backend",
                storageBucket: storageUpload?.bucket,
                storagePath: storageUpload?.path,
            });

            return NextResponse.json({
                ...data,
                source: documentResult.source === "demo" ? "demo" : "backend",
                document: documentResult.data,
                warning: documentResult.warning || storageWarning,
                details: documentResult.details,
                storagePath: storageUpload?.path,
            });
        } catch (backendError: unknown) {
            const backendDetails = backendError instanceof Error ? backendError.message : "Backend unavailable";
            const desiredSource = storageUpload ? "supabase" : "demo";
            const documentResult = await recordGraphUploadRepository({
                name: file.name,
                mimeType: file.type || "application/octet-stream",
                sizeBytes: file.size,
                source: desiredSource,
                storageBucket: storageUpload?.bucket,
                storagePath: storageUpload?.path,
            });

            return NextResponse.json({
                message: storageUpload
                    ? "Ingestion backend unavailable. Document stored in Supabase and queued for later processing."
                    : "Ingestion backend unavailable. Document committed in demo mode.",
                details: backendDetails,
                source: documentResult.source === "demo" ? "demo" : desiredSource,
                warning: documentResult.warning || storageWarning,
                document: documentResult.data,
                storagePath: storageUpload?.path,
            });
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        console.error("API /upload Route Error:", error);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
