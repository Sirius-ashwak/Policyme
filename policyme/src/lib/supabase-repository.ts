import { getSupabaseAdminClient } from "@/config/supabaseServer";
import {
    createApplication,
    createClaim,
    getApplicationById,
    getClaimById,
    getCustomerBilling,
    listApplications,
    listClaims,
    listCustomerPolicies,
    listCustomerSettings,
    listGraphDocuments,
    listGraphOperations,
    payCustomerBilling,
    recordGraphOperation,
    recordGraphUpload,
    refreshCustomerPaymentMethod,
    runCustomerSettingAction,
    saveApplicationAssessment,
    updateApplicationStatus,
    updateClaimStatus,
    type ApplicationStatus,
    type BillingHistoryEntry,
    type ClaimAnalysis,
    type ClaimEvidenceFile,
    type ClaimRecord,
    type ClaimStatus,
    type ClaimTimelineEntry,
    type CustomerBillingRecord,
    type CustomerPolicyCoverageItem,
    type CustomerPolicyRecord,
    type CustomerSettingId,
    type CustomerSettingRecord,
    type GraphDocumentRecord,
    type GraphOperationRecord,
    type GraphOperationType,
    type NewApplicationInput,
    type NewClaimInput,
    type UnderwritingApplication,
    type UnderwritingAssessment,
} from "@/lib/demo-store";

type Source = "supabase" | "demo";

export type RepositoryResult<T> = {
    data: T;
    source: Source;
    warning?: string;
    details?: string;
};

type CustomerAccountRow = {
    id: string;
    external_key: string;
    created_at: string;
};

type ClaimRow = {
    id: string;
    title: string;
    claim_type: string;
    icon: string;
    policy_id: string;
    policy_holder: string;
    status: ClaimStatus;
    incident_date: string;
    location: string;
    description: string;
    estimated_amount: string;
    created_at: string;
    updated_at: string;
    highlighted: boolean;
    timeline: unknown;
    analysis: unknown;
};

type ClaimEvidenceRow = {
    claim_id: string;
    file_name: string;
    size_bytes: number;
    mime_type: string;
};

type ApplicationRow = {
    id: string;
    applicant_name: string;
    applicant_email: string;
    applicant_organization: string;
    policy_type: string;
    policy_icon: string;
    submitted_at: string;
    status: ApplicationStatus;
    requested_coverage: string;
    asset_value: string;
    location: string;
    claims_history: string;
    description: string;
    customer_data: unknown;
};

type AssessmentRow = {
    application_id: string;
    risk_score: number;
    factors: unknown;
    recommend: "approve" | "reject";
    is_mock: boolean;
    generated_at: string;
};

type PolicyRow = {
    id: string;
    name: string;
    type: string;
    status: CustomerPolicyRecord["status"];
    premium: string;
    start_date: string;
    end_date: string;
    coverage: unknown;
};

type BillingProfileRow = {
    next_payment_amount: string;
    next_payment_date: string;
    auto_pay: boolean;
    payment_method: unknown;
};

type BillingHistoryRow = {
    id: string;
    payment_date: string;
    amount: string;
    status: BillingHistoryEntry["status"];
    reference: string;
};

type SettingRow = {
    setting_key: CustomerSettingId;
    icon: string;
    title: string;
    description: string;
    action_label: string;
    status_label: string;
    last_updated: string;
};

type GraphDocumentRow = {
    id: string;
    name: string;
    mime_type: string;
    size_bytes: number;
    size_label: string;
    pages: number;
    progress: number;
    stage: string;
    nodes_generated: number;
    edges_formed: number;
    duration_label: string;
    status: GraphDocumentRecord["status"];
    uploaded_at: string;
    source: GraphDocumentRecord["source"];
};

type GraphOperationRow = {
    id: string;
    type: GraphOperationType;
    detail: string;
    status: GraphOperationRecord["status"];
    executed_at: string;
};

type PaymentMethod = CustomerBillingRecord["paymentMethod"];

const PRIMARY_CUSTOMER_KEY = "demo-primary-customer";
const RUNTIME_ENV = (process.env.APP_ENV || process.env.NODE_ENV || "local").toLowerCase();
const DEMO_FALLBACK_ALLOWED =
    RUNTIME_ENV === "local" ||
    RUNTIME_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";

function errorDetails(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
}

function fallbackResult<T>(domain: string, error: unknown, data: T): RepositoryResult<T> {
    const details = errorDetails(error);
    console.error(`Supabase ${domain} repository error:`, details);

    if (!DEMO_FALLBACK_ALLOWED) {
        throw new Error(`Supabase ${domain} unavailable and demo fallback is disabled. ${details}`);
    }

    return {
        data,
        source: "demo",
        warning: `Supabase ${domain} unavailable. Serving demo data instead.`,
        details,
    };
}

function formatCurrency(input: string): string {
    const numeric = Number.parseFloat(input.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric)) {
        return input.trim() || "₹0";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(numeric);
}

function formatFileSize(sizeBytes: number): string {
    if (sizeBytes >= 1_000_000) {
        return `${(sizeBytes / 1_000_000).toFixed(1)} MB`;
    }
    if (sizeBytes >= 1_000) {
        return `${Math.round(sizeBytes / 1_000)} KB`;
    }

    return `${sizeBytes} B`;
}

function plusMonths(dateInput: string, months: number): string {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) {
        return new Date().toISOString();
    }

    date.setMonth(date.getMonth() + months);
    return date.toISOString();
}

function statusFromAmount(amount: string, claimType: string): ClaimStatus {
    const numeric = Number.parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (claimType.toLowerCase().includes("property") || numeric >= 10000) {
        return "Urgent";
    }

    return "Submitted";
}

function iconFromClaimType(claimType: string): string {
    const normalized = claimType.toLowerCase();
    if (normalized.includes("property") || normalized.includes("home")) {
        return "home";
    }
    if (normalized.includes("health")) {
        return "health_and_safety";
    }

    return "directions_car";
}

function titleFromClaim(input: NewClaimInput): string {
    const normalizedType = input.claimType.toLowerCase();
    if (normalizedType.includes("property") || normalizedType.includes("home")) {
        return "Property Damage Claim";
    }
    if (normalizedType.includes("health")) {
        return "Health Expense Claim";
    }
    if (normalizedType.includes("comprehensive")) {
        return "Comprehensive Auto Claim";
    }
    if (normalizedType.includes("collision")) {
        return "Collision Damage Claim";
    }

    return input.description.split(".")[0]?.slice(0, 48) || "New Claim";
}

function buildClaimAnalysis(claimType: string, estimatedAmount: string): ClaimAnalysis {
    const normalizedType = claimType.toLowerCase();
    const payoutEstimate = formatCurrency(estimatedAmount);

    if (normalizedType.includes("property") || normalizedType.includes("home")) {
        return {
            recommendation: "approve",
            payoutEstimate,
            reasoning: [
                "Damage description aligns with covered sudden and accidental property loss.",
                "Estimated repair scope is consistent with comparable residential property claims.",
                "No exclusion indicators were captured in the submitted incident summary.",
            ],
            policyMatches: [
                {
                    clauseId: "4B",
                    title: "Weather And Impact Damage",
                    excerpt: "Direct physical loss caused by wind, falling branches, and related water ingress is covered when the structure is first damaged by a covered peril.",
                    confidence: 0.99,
                },
                {
                    clauseId: "12.2",
                    title: "Ground Water Exclusion",
                    excerpt: "Rising ground water remains excluded unless a flood endorsement is active.",
                    confidence: 0.84,
                },
            ],
        };
    }

    if (normalizedType.includes("health")) {
        return {
            recommendation: "reject",
            payoutEstimate,
            reasoning: [
                "The incident summary lacks enough medical billing detail to validate coverage.",
                "No provider documents were attached with the initial submission.",
                "Manual review is required before payout can be recommended.",
            ],
            policyMatches: [
                {
                    clauseId: "7A",
                    title: "Eligible Emergency Treatment",
                    excerpt: "Emergency treatment is reimbursable when submitted with provider and billing records.",
                    confidence: 0.76,
                },
            ],
        };
    }

    return {
        recommendation: "approve",
        payoutEstimate,
        reasoning: [
            "The reported loss pattern matches standard covered auto damage.",
            "Estimated severity is within expected payout bands for similar claims.",
            "No fraud or exclusion flags were triggered from the structured intake fields.",
        ],
        policyMatches: [
            {
                clauseId: "3C",
                title: "Collision And Glass Coverage",
                excerpt: "Physical damage to insured vehicles, including windshield and body damage, is covered after the applicable deductible.",
                confidence: 0.97,
            },
            {
                clauseId: "9F",
                title: "Wear And Tear Exclusion",
                excerpt: "Progressive deterioration and pre-existing damage are excluded from payout calculations.",
                confidence: 0.82,
            },
        ],
    };
}

function buildClaimRecord(input: NewClaimInput): ClaimRecord {
    const id = `CL-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();
    const estimatedAmount = formatCurrency(input.estimatedAmount);

    return {
        id,
        title: titleFromClaim(input),
        claimType: input.claimType,
        icon: iconFromClaimType(input.claimType),
        policyId: input.claimType.toLowerCase().includes("property") ? "HM-44012-BY" : "AU-82910-XM",
        policyHolder: "Sarah Mitchell",
        status: statusFromAmount(estimatedAmount, input.claimType),
        incidentDate: input.incidentDate,
        location: input.location,
        description: input.description,
        estimatedAmount,
        createdAt: timestamp,
        updatedAt: timestamp,
        highlighted: true,
        evidenceFiles: input.evidenceFiles,
        timeline: [
            {
                label: "Claim Submitted",
                detail: "Customer completed the guided intake form.",
                timestamp,
            },
            {
                label: "Queued For Review",
                detail: "Claim is available to the adjuster queue.",
                timestamp,
            },
        ],
        analysis: buildClaimAnalysis(input.claimType, estimatedAmount),
    };
}

function iconFromPolicyType(policyType: string): string {
    const normalized = policyType.toLowerCase();
    if (normalized.includes("auto") || normalized.includes("vehicle")) {
        return "directions_car";
    }
    if (normalized.includes("property") || normalized.includes("home")) {
        return "home";
    }
    if (normalized.includes("health")) {
        return "favorite";
    }

    return "shield";
}

function buildApplicationRecord(input: NewApplicationInput): UnderwritingApplication {
    return {
        id: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
        applicantName: input.applicantName,
        applicantEmail: input.applicantEmail,
        applicantOrganization: input.applicantOrganization,
        policyType: input.policyType,
        policyIcon: iconFromPolicyType(input.policyType),
        submittedAt: new Date().toISOString().slice(0, 10),
        status: "Pending Review",
        requestedCoverage: formatCurrency(input.requestedCoverage),
        assetValue: formatCurrency(input.assetValue),
        location: input.location,
        claimsHistory: input.claimsHistory,
        description: input.description,
        customerData: structuredClone(input.customerData),
        assessment: null,
    };
}

function buildGraphDocumentRecord(input: {
    name: string;
    mimeType: string;
    sizeBytes: number;
    source: GraphDocumentRecord["source"];
    storageBucket?: string | null;
    storagePath?: string | null;
}): GraphDocumentRecord {
    const pages = Math.max(8, Math.round(input.sizeBytes / 70_000));
    const nodesGenerated = Math.max(120, Math.round(pages * 9.4));
    const edgesFormed = Math.max(640, Math.round(nodesGenerated * 7.2));
    const uploadedAt = new Date().toISOString();

    return {
        id: `DOC-${Math.floor(10000 + Math.random() * 90000)}`,
        name: input.name,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        sizeLabel: formatFileSize(input.sizeBytes),
        pages,
        progress: 100,
        stage: input.source === "backend"
            ? "Committed by ingestion backend"
            : input.source === "supabase"
                ? "Stored in Supabase Storage"
                : "Committed in demo mode",
        nodesGenerated,
        edgesFormed,
        durationLabel: `${String(Math.max(1, Math.round(pages / 40))).padStart(2, "0")}m ${String(Math.max(8, Math.round(pages / 3))).padStart(2, "0")}s`,
        status: "Committed",
        uploadedAt,
        source: input.source,
    };
}

function buildGraphOperationRecord(type: GraphOperationType): GraphOperationRecord {
    return {
        id: `GRAPH-OP-${Math.floor(10000 + Math.random() * 90000)}`,
        type,
        detail: type === "reindex"
            ? "Node reindex completed and cache warmed."
            : "Global vector refresh completed across active clusters.",
        status: "Completed",
        executedAt: new Date().toISOString(),
    };
}

function asClaimTimeline(value: unknown): ClaimTimelineEntry[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
        .map((entry) => ({
            label: typeof entry.label === "string" ? entry.label : "Timeline Event",
            detail: typeof entry.detail === "string" ? entry.detail : "",
            timestamp: typeof entry.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
        }));
}

function asClaimAnalysis(value: unknown): ClaimAnalysis {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return buildClaimAnalysis("auto", "₹0");
    }

    const entry = value as Record<string, unknown>;
    return {
        recommendation: entry.recommendation === "reject" ? "reject" : "approve",
        payoutEstimate: typeof entry.payoutEstimate === "string" ? entry.payoutEstimate : "₹0",
        reasoning: Array.isArray(entry.reasoning)
            ? entry.reasoning.filter((item): item is string => typeof item === "string")
            : [],
        policyMatches: Array.isArray(entry.policyMatches)
            ? entry.policyMatches
                .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
                .map((item) => ({
                    clauseId: typeof item.clauseId === "string" ? item.clauseId : "N/A",
                    title: typeof item.title === "string" ? item.title : "Policy Match",
                    excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
                    confidence: typeof item.confidence === "number" ? item.confidence : 0,
                }))
            : [],
    };
}

function asCustomerData(value: unknown): Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
}

function asCoverageItems(value: unknown): CustomerPolicyCoverageItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
        .map((entry) => ({
            item: typeof entry.item === "string" ? entry.item : "Coverage",
            limit: typeof entry.limit === "string" ? entry.limit : "N/A",
            deductible: typeof entry.deductible === "string" ? entry.deductible : "N/A",
        }));
}

function asPaymentMethod(value: unknown): PaymentMethod {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return {
            brand: "VISA",
            last4: "0000",
            expires: "01/2030",
            holderName: "Policy Holder",
        };
    }

    const entry = value as Record<string, unknown>;
    return {
        brand: typeof entry.brand === "string" ? entry.brand : "VISA",
        last4: typeof entry.last4 === "string" ? entry.last4 : "0000",
        expires: typeof entry.expires === "string" ? entry.expires : "01/2030",
        holderName: typeof entry.holderName === "string" ? entry.holderName : "Policy Holder",
    };
}

function asAssessment(row: AssessmentRow | null | undefined): UnderwritingAssessment | null {
    if (!row) {
        return null;
    }

    return {
        riskScore: row.risk_score,
        factors: Array.isArray(row.factors)
            ? row.factors.filter((entry): entry is string => typeof entry === "string")
            : [],
        recommend: row.recommend,
        isMock: row.is_mock,
        generatedAt: row.generated_at,
    };
}

function mapClaim(row: ClaimRow, evidenceFiles: ClaimEvidenceFile[]): ClaimRecord {
    return {
        id: row.id,
        title: row.title,
        claimType: row.claim_type,
        icon: row.icon,
        policyId: row.policy_id,
        policyHolder: row.policy_holder,
        status: row.status,
        incidentDate: row.incident_date,
        location: row.location,
        description: row.description,
        estimatedAmount: row.estimated_amount,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        highlighted: row.highlighted,
        evidenceFiles,
        timeline: asClaimTimeline(row.timeline),
        analysis: asClaimAnalysis(row.analysis),
    };
}

function mapApplication(row: ApplicationRow, assessment: UnderwritingAssessment | null): UnderwritingApplication {
    return {
        id: row.id,
        applicantName: row.applicant_name,
        applicantEmail: row.applicant_email,
        applicantOrganization: row.applicant_organization,
        policyType: row.policy_type,
        policyIcon: row.policy_icon,
        submittedAt: row.submitted_at,
        status: row.status,
        requestedCoverage: row.requested_coverage,
        assetValue: row.asset_value,
        location: row.location,
        claimsHistory: row.claims_history,
        description: row.description,
        customerData: asCustomerData(row.customer_data),
        assessment,
    };
}

function mapPolicy(row: PolicyRow): CustomerPolicyRecord {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        status: row.status,
        premium: row.premium,
        startDate: row.start_date,
        endDate: row.end_date,
        coverage: asCoverageItems(row.coverage),
    };
}

function mapBillingHistory(row: BillingHistoryRow): BillingHistoryEntry {
    return {
        id: row.id,
        date: row.payment_date,
        amount: row.amount,
        status: row.status,
        reference: row.reference,
    };
}

function mapSetting(row: SettingRow): CustomerSettingRecord {
    return {
        id: row.setting_key,
        icon: row.icon,
        title: row.title,
        description: row.description,
        actionLabel: row.action_label,
        statusLabel: row.status_label,
        lastUpdated: row.last_updated,
    };
}

function mapGraphDocument(row: GraphDocumentRow): GraphDocumentRecord {
    return {
        id: row.id,
        name: row.name,
        mimeType: row.mime_type,
        sizeBytes: row.size_bytes,
        sizeLabel: row.size_label,
        pages: row.pages,
        progress: row.progress,
        stage: row.stage,
        nodesGenerated: row.nodes_generated,
        edgesFormed: row.edges_formed,
        durationLabel: row.duration_label,
        status: row.status,
        uploadedAt: row.uploaded_at,
        source: row.source,
    };
}

function mapGraphOperation(row: GraphOperationRow): GraphOperationRecord {
    return {
        id: row.id,
        type: row.type,
        detail: row.detail,
        status: row.status,
        executedAt: row.executed_at,
    };
}

async function getPrimaryCustomerAccount(supabase: ReturnType<typeof getSupabaseAdminClient>): Promise<CustomerAccountRow> {
    const preferred = await supabase
        .from("customer_accounts")
        .select("id, external_key, created_at")
        .eq("external_key", PRIMARY_CUSTOMER_KEY)
        .limit(1)
        .maybeSingle();

    if (preferred.error) {
        throw new Error(`Primary customer lookup failed: ${preferred.error.message}`);
    }

    if (preferred.data) {
        return preferred.data as CustomerAccountRow;
    }

    const fallback = await supabase
        .from("customer_accounts")
        .select("id, external_key, created_at")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (fallback.error) {
        throw new Error(`Fallback customer lookup failed: ${fallback.error.message}`);
    }

    if (!fallback.data) {
        throw new Error("No customer accounts are available in Supabase.");
    }

    return fallback.data as CustomerAccountRow;
}

async function loadClaimsFromSupabase(): Promise<ClaimRecord[]> {
    const supabase = getSupabaseAdminClient();
    const claimsResult = await supabase
        .from("claims")
        .select("id, title, claim_type, icon, policy_id, policy_holder, status, incident_date, location, description, estimated_amount, created_at, updated_at, highlighted, timeline, analysis")
        .order("updated_at", { ascending: false });

    if (claimsResult.error) {
        throw new Error(`Claims query failed: ${claimsResult.error.message}`);
    }

    const claimRows = (claimsResult.data ?? []) as ClaimRow[];
    if (claimRows.length === 0) {
        return [];
    }

    const evidenceResult = await supabase
        .from("claim_evidence_files")
        .select("claim_id, file_name, size_bytes, mime_type")
        .in("claim_id", claimRows.map((row) => row.id));

    if (evidenceResult.error) {
        throw new Error(`Claim evidence query failed: ${evidenceResult.error.message}`);
    }

    const evidenceRows = (evidenceResult.data ?? []) as ClaimEvidenceRow[];
    const evidenceByClaim = new Map<string, ClaimEvidenceFile[]>();
    for (const row of evidenceRows) {
        const current = evidenceByClaim.get(row.claim_id) || [];
        current.push({
            name: row.file_name,
            sizeBytes: row.size_bytes,
            type: row.mime_type,
        });
        evidenceByClaim.set(row.claim_id, current);
    }

    return claimRows.map((row) => mapClaim(row, evidenceByClaim.get(row.id) || []));
}

async function loadClaimByIdFromSupabase(id: string): Promise<ClaimRecord | null> {
    const supabase = getSupabaseAdminClient();
    const claimResult = await supabase
        .from("claims")
        .select("id, title, claim_type, icon, policy_id, policy_holder, status, incident_date, location, description, estimated_amount, created_at, updated_at, highlighted, timeline, analysis")
        .eq("id", id)
        .maybeSingle();

    if (claimResult.error) {
        throw new Error(`Claim lookup failed: ${claimResult.error.message}`);
    }

    if (!claimResult.data) {
        return null;
    }

    const evidenceResult = await supabase
        .from("claim_evidence_files")
        .select("claim_id, file_name, size_bytes, mime_type")
        .eq("claim_id", id);

    if (evidenceResult.error) {
        throw new Error(`Claim evidence lookup failed: ${evidenceResult.error.message}`);
    }

    const evidence = ((evidenceResult.data ?? []) as ClaimEvidenceRow[]).map((row) => ({
        name: row.file_name,
        sizeBytes: row.size_bytes,
        type: row.mime_type,
    }));

    return mapClaim(claimResult.data as ClaimRow, evidence);
}

async function insertClaimIntoSupabase(claim: ClaimRecord): Promise<ClaimRecord> {
    const supabase = getSupabaseAdminClient();
    const { data: customer } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq("external_key", PRIMARY_CUSTOMER_KEY)
        .limit(1)
        .maybeSingle();

    const claimInsert = await supabase
        .from("claims")
        .insert({
            id: claim.id,
            customer_account_id: customer?.id ?? null,
            title: claim.title,
            claim_type: claim.claimType,
            icon: claim.icon,
            policy_id: claim.policyId,
            policy_holder: claim.policyHolder,
            status: claim.status,
            incident_date: claim.incidentDate,
            location: claim.location,
            description: claim.description,
            estimated_amount: claim.estimatedAmount,
            created_at: claim.createdAt,
            updated_at: claim.updatedAt,
            highlighted: claim.highlighted,
            timeline: claim.timeline,
            analysis: claim.analysis,
        });

    if (claimInsert.error) {
        throw new Error(`Claim insert failed: ${claimInsert.error.message}`);
    }

    if (claim.evidenceFiles.length > 0) {
        const evidenceInsert = await supabase
            .from("claim_evidence_files")
            .insert(claim.evidenceFiles.map((file) => ({
                claim_id: claim.id,
                file_name: file.name,
                size_bytes: file.sizeBytes,
                mime_type: file.type,
            })));

        if (evidenceInsert.error) {
            await supabase.from("claims").delete().eq("id", claim.id);
            throw new Error(`Claim evidence insert failed: ${evidenceInsert.error.message}`);
        }
    }

    return claim;
}

async function loadApplicationsFromSupabase(): Promise<UnderwritingApplication[]> {
    const supabase = getSupabaseAdminClient();
    const appResult = await supabase
        .from("applications")
        .select("id, applicant_name, applicant_email, applicant_organization, policy_type, policy_icon, submitted_at, status, requested_coverage, asset_value, location, claims_history, description, customer_data")
        .order("submitted_at", { ascending: false });

    if (appResult.error) {
        throw new Error(`Applications query failed: ${appResult.error.message}`);
    }

    const appRows = (appResult.data ?? []) as ApplicationRow[];
    if (appRows.length === 0) {
        return [];
    }

    const assessmentResult = await supabase
        .from("underwriting_assessments")
        .select("application_id, risk_score, factors, recommend, is_mock, generated_at")
        .in("application_id", appRows.map((row) => row.id));

    if (assessmentResult.error) {
        throw new Error(`Assessment query failed: ${assessmentResult.error.message}`);
    }

    const assessments = new Map<string, AssessmentRow>();
    for (const row of (assessmentResult.data ?? []) as AssessmentRow[]) {
        assessments.set(row.application_id, row);
    }

    return appRows.map((row) => mapApplication(row, asAssessment(assessments.get(row.id))));
}

async function loadApplicationByIdFromSupabase(id: string): Promise<UnderwritingApplication | null> {
    const supabase = getSupabaseAdminClient();
    const appResult = await supabase
        .from("applications")
        .select("id, applicant_name, applicant_email, applicant_organization, policy_type, policy_icon, submitted_at, status, requested_coverage, asset_value, location, claims_history, description, customer_data")
        .eq("id", id)
        .maybeSingle();

    if (appResult.error) {
        throw new Error(`Application lookup failed: ${appResult.error.message}`);
    }

    if (!appResult.data) {
        return null;
    }

    const assessmentResult = await supabase
        .from("underwriting_assessments")
        .select("application_id, risk_score, factors, recommend, is_mock, generated_at")
        .eq("application_id", id)
        .maybeSingle();

    if (assessmentResult.error) {
        throw new Error(`Application assessment lookup failed: ${assessmentResult.error.message}`);
    }

    return mapApplication(appResult.data as ApplicationRow, asAssessment(assessmentResult.data as AssessmentRow | null));
}

async function insertApplicationIntoSupabase(application: UnderwritingApplication): Promise<UnderwritingApplication> {
    const supabase = getSupabaseAdminClient();
    const insertResult = await supabase
        .from("applications")
        .insert({
            id: application.id,
            applicant_name: application.applicantName,
            applicant_email: application.applicantEmail,
            applicant_organization: application.applicantOrganization,
            policy_type: application.policyType,
            policy_icon: application.policyIcon,
            submitted_at: application.submittedAt,
            status: application.status,
            requested_coverage: application.requestedCoverage,
            asset_value: application.assetValue,
            location: application.location,
            claims_history: application.claimsHistory,
            description: application.description,
            customer_data: application.customerData,
        });

    if (insertResult.error) {
        throw new Error(`Application insert failed: ${insertResult.error.message}`);
    }

    return application;
}

async function loadPoliciesFromSupabase(): Promise<CustomerPolicyRecord[]> {
    const supabase = getSupabaseAdminClient();
    const customer = await getPrimaryCustomerAccount(supabase);
    const result = await supabase
        .from("customer_policies")
        .select("id, name, type, status, premium, start_date, end_date, coverage")
        .eq("customer_account_id", customer.id)
        .order("start_date", { ascending: true });

    if (result.error) {
        throw new Error(`Policies query failed: ${result.error.message}`);
    }

    return ((result.data ?? []) as PolicyRow[]).map(mapPolicy);
}

async function loadBillingFromSupabase(): Promise<CustomerBillingRecord> {
    const supabase = getSupabaseAdminClient();
    const customer = await getPrimaryCustomerAccount(supabase);

    const profileResult = await supabase
        .from("customer_billing_profiles")
        .select("next_payment_amount, next_payment_date, auto_pay, payment_method")
        .eq("customer_account_id", customer.id)
        .maybeSingle();

    if (profileResult.error) {
        throw new Error(`Billing profile query failed: ${profileResult.error.message}`);
    }

    if (!profileResult.data) {
        throw new Error("No billing profile exists for the active customer.");
    }

    const historyResult = await supabase
        .from("customer_billing_history")
        .select("id, payment_date, amount, status, reference")
        .eq("customer_account_id", customer.id)
        .order("payment_date", { ascending: false });

    if (historyResult.error) {
        throw new Error(`Billing history query failed: ${historyResult.error.message}`);
    }

    const profile = profileResult.data as BillingProfileRow;
    return {
        nextPaymentAmount: profile.next_payment_amount,
        nextPaymentDate: profile.next_payment_date,
        autoPay: profile.auto_pay,
        paymentMethod: asPaymentMethod(profile.payment_method),
        history: ((historyResult.data ?? []) as BillingHistoryRow[]).map(mapBillingHistory),
    };
}

async function loadSettingsFromSupabase(): Promise<CustomerSettingRecord[]> {
    const supabase = getSupabaseAdminClient();
    const customer = await getPrimaryCustomerAccount(supabase);
    const result = await supabase
        .from("customer_settings")
        .select("setting_key, icon, title, description, action_label, status_label, last_updated")
        .eq("customer_account_id", customer.id)
        .order("created_at", { ascending: true });

    if (result.error) {
        throw new Error(`Customer settings query failed: ${result.error.message}`);
    }

    return ((result.data ?? []) as SettingRow[]).map(mapSetting);
}

async function loadGraphDocumentsFromSupabase(): Promise<GraphDocumentRecord[]> {
    const supabase = getSupabaseAdminClient();
    const result = await supabase
        .from("graph_documents")
        .select("id, name, mime_type, size_bytes, size_label, pages, progress, stage, nodes_generated, edges_formed, duration_label, status, uploaded_at, source")
        .order("uploaded_at", { ascending: false });

    if (result.error) {
        throw new Error(`Graph documents query failed: ${result.error.message}`);
    }

    return ((result.data ?? []) as GraphDocumentRow[]).map(mapGraphDocument);
}

async function loadGraphOperationsFromSupabase(): Promise<GraphOperationRecord[]> {
    const supabase = getSupabaseAdminClient();
    const result = await supabase
        .from("graph_operations")
        .select("id, type, detail, status, executed_at")
        .order("executed_at", { ascending: false });

    if (result.error) {
        throw new Error(`Graph operations query failed: ${result.error.message}`);
    }

    return ((result.data ?? []) as GraphOperationRow[]).map(mapGraphOperation);
}

export async function listClaimsRepository(): Promise<RepositoryResult<ClaimRecord[]>> {
    try {
        return { data: await loadClaimsFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("claims", error, listClaims());
    }
}

export async function getClaimRepository(id: string): Promise<RepositoryResult<ClaimRecord | null>> {
    try {
        return { data: await loadClaimByIdFromSupabase(id), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("claims", error, getClaimById(id));
    }
}

export async function createClaimRepository(input: NewClaimInput): Promise<RepositoryResult<ClaimRecord>> {
    const claim = buildClaimRecord(input);

    try {
        return { data: await insertClaimIntoSupabase(claim), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("claims", error, createClaim(input));
    }
}

export async function updateClaimStatusRepository(id: string, status: ClaimStatus): Promise<RepositoryResult<ClaimRecord | null>> {
    try {
        const current = await loadClaimByIdFromSupabase(id);
        if (!current) {
            return { data: null, source: "supabase" };
        }

        const updatedTimeline: ClaimTimelineEntry[] = [
            {
                label: `Status Updated: ${status}`,
                detail: `Claim status changed to ${status}.`,
                timestamp: new Date().toISOString(),
            },
            ...current.timeline,
        ];

        const supabase = getSupabaseAdminClient();
        const updateResult = await supabase
            .from("claims")
            .update({
                status,
                updated_at: updatedTimeline[0].timestamp,
                timeline: updatedTimeline,
            })
            .eq("id", id);

        if (updateResult.error) {
            throw new Error(`Claim update failed: ${updateResult.error.message}`);
        }

        return { data: await loadClaimByIdFromSupabase(id), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("claims", error, updateClaimStatus(id, status));
    }
}

export async function listApplicationsRepository(): Promise<RepositoryResult<UnderwritingApplication[]>> {
    try {
        return { data: await loadApplicationsFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("applications", error, listApplications());
    }
}

export async function getApplicationRepository(id: string): Promise<RepositoryResult<UnderwritingApplication | null>> {
    try {
        return { data: await loadApplicationByIdFromSupabase(id), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("applications", error, getApplicationById(id));
    }
}

export async function createApplicationRepository(input: NewApplicationInput): Promise<RepositoryResult<UnderwritingApplication>> {
    const application = buildApplicationRecord(input);

    try {
        return { data: await insertApplicationIntoSupabase(application), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("applications", error, createApplication(input));
    }
}

export async function updateApplicationStatusRepository(
    id: string,
    status: ApplicationStatus
): Promise<RepositoryResult<UnderwritingApplication | null>> {
    try {
        const current = await loadApplicationByIdFromSupabase(id);
        if (!current) {
            return { data: null, source: "supabase" };
        }

        const supabase = getSupabaseAdminClient();
        const updateResult = await supabase
            .from("applications")
            .update({ status })
            .eq("id", id);

        if (updateResult.error) {
            throw new Error(`Application status update failed: ${updateResult.error.message}`);
        }

        return { data: await loadApplicationByIdFromSupabase(id), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("applications", error, updateApplicationStatus(id, status));
    }
}

export async function saveApplicationAssessmentRepository(
    id: string,
    assessment: UnderwritingAssessment
): Promise<RepositoryResult<UnderwritingApplication | null>> {
    try {
        const current = await loadApplicationByIdFromSupabase(id);
        if (!current) {
            return { data: null, source: "supabase" };
        }

        const supabase = getSupabaseAdminClient();
        const assessmentUpsert = await supabase
            .from("underwriting_assessments")
            .upsert({
                application_id: id,
                risk_score: assessment.riskScore,
                factors: assessment.factors,
                recommend: assessment.recommend,
                is_mock: assessment.isMock ?? false,
                generated_at: assessment.generatedAt,
            });

        if (assessmentUpsert.error) {
            throw new Error(`Assessment save failed: ${assessmentUpsert.error.message}`);
        }

        const appStatus = current.status === "Pending Review" ? "Under Review" : current.status;
        const appUpdate = await supabase
            .from("applications")
            .update({ status: appStatus })
            .eq("id", id);

        if (appUpdate.error) {
            throw new Error(`Application review status update failed: ${appUpdate.error.message}`);
        }

        return { data: await loadApplicationByIdFromSupabase(id), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("applications", error, saveApplicationAssessment(id, assessment));
    }
}

export async function listCustomerPoliciesRepository(): Promise<RepositoryResult<CustomerPolicyRecord[]>> {
    try {
        return { data: await loadPoliciesFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("customer policies", error, listCustomerPolicies());
    }
}

export async function getCustomerBillingRepository(): Promise<RepositoryResult<CustomerBillingRecord>> {
    try {
        return { data: await loadBillingFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("customer billing", error, getCustomerBilling());
    }
}

export async function payCustomerBillingRepository(): Promise<RepositoryResult<CustomerBillingRecord>> {
    try {
        const supabase = getSupabaseAdminClient();
        const customer = await getPrimaryCustomerAccount(supabase);
        const billing = await loadBillingFromSupabase();
        const paidAt = new Date().toISOString().slice(0, 10);
        const reference = `INV-${billing.nextPaymentDate.slice(0, 7)}`;
        const historyId = `PAY-${Date.now()}`;

        const historyInsert = await supabase
            .from("customer_billing_history")
            .insert({
                id: historyId,
                customer_account_id: customer.id,
                payment_date: paidAt,
                amount: billing.nextPaymentAmount,
                status: "Paid",
                reference,
            });

        if (historyInsert.error) {
            throw new Error(`Billing history insert failed: ${historyInsert.error.message}`);
        }

        const nextPaymentDate = plusMonths(billing.nextPaymentDate, 1).slice(0, 10);
        const profileUpdate = await supabase
            .from("customer_billing_profiles")
            .update({
                next_payment_date: nextPaymentDate,
            })
            .eq("customer_account_id", customer.id);

        if (profileUpdate.error) {
            throw new Error(`Billing profile update failed: ${profileUpdate.error.message}`);
        }

        return { data: await loadBillingFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("customer billing", error, payCustomerBilling());
    }
}

export async function refreshCustomerPaymentMethodRepository(): Promise<RepositoryResult<CustomerBillingRecord>> {
    try {
        const supabase = getSupabaseAdminClient();
        const customer = await getPrimaryCustomerAccount(supabase);
        const billing = await loadBillingFromSupabase();
        const nextMethod: PaymentMethod = billing.paymentMethod.brand === "VISA"
            ? {
                brand: "AMEX",
                last4: "1183",
                expires: "02/2029",
                holderName: billing.paymentMethod.holderName,
            }
            : {
                brand: "VISA",
                last4: "4291",
                expires: "09/2027",
                holderName: billing.paymentMethod.holderName,
            };

        const updateResult = await supabase
            .from("customer_billing_profiles")
            .update({
                payment_method: nextMethod,
            })
            .eq("customer_account_id", customer.id);

        if (updateResult.error) {
            throw new Error(`Payment method update failed: ${updateResult.error.message}`);
        }

        return { data: await loadBillingFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("customer billing", error, refreshCustomerPaymentMethod());
    }
}

export async function listCustomerSettingsRepository(): Promise<RepositoryResult<CustomerSettingRecord[]>> {
    try {
        return { data: await loadSettingsFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("customer settings", error, listCustomerSettings());
    }
}

export async function runCustomerSettingActionRepository(
    id: CustomerSettingId
): Promise<RepositoryResult<CustomerSettingRecord[]>> {
    try {
        const supabase = getSupabaseAdminClient();
        const customer = await getPrimaryCustomerAccount(supabase);
        const settings = await loadSettingsFromSupabase();
        const setting = settings.find((entry) => entry.id === id);

        if (!setting) {
            return { data: settings, source: "supabase" };
        }

        const nextSetting = structuredClone(setting);
        const timestamp = new Date().toISOString();
        nextSetting.lastUpdated = timestamp;

        if (id === "password") {
            nextSetting.statusLabel = "Reset link issued";
            nextSetting.actionLabel = "Reissue";
        } else if (id === "twofa") {
            const enabled = nextSetting.statusLabel === "Enabled";
            nextSetting.statusLabel = enabled ? "Disabled" : "Enabled";
            nextSetting.description = enabled
                ? "Second-factor enrollment is currently paused."
                : "Authenticator app challenge is required at sign-in.";
            nextSetting.actionLabel = enabled ? "Enable" : "Manage";
        } else if (id === "notifications") {
            const smsEnabled = nextSetting.statusLabel === "Email + SMS";
            nextSetting.statusLabel = smsEnabled ? "Email only" : "Email + SMS";
            nextSetting.description = smsEnabled
                ? "Only primary email alerts will be sent for account changes."
                : "Delivery channels for billing, claims, and account alerts.";
            nextSetting.actionLabel = smsEnabled ? "Add SMS" : "Configure";
        } else {
            const strict = nextSetting.statusLabel === "Strict";
            nextSetting.statusLabel = strict ? "Standard" : "Strict";
            nextSetting.description = strict
                ? "Sharing controls for account activity and claim updates."
                : "Only essential service events will be shared with partner systems.";
            nextSetting.actionLabel = "Review";
        }

        const updateResult = await supabase
            .from("customer_settings")
            .update({
                description: nextSetting.description,
                action_label: nextSetting.actionLabel,
                status_label: nextSetting.statusLabel,
                last_updated: nextSetting.lastUpdated,
            })
            .eq("customer_account_id", customer.id)
            .eq("setting_key", id);

        if (updateResult.error) {
            throw new Error(`Customer setting update failed: ${updateResult.error.message}`);
        }

        return { data: await loadSettingsFromSupabase(), source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("customer settings", error, runCustomerSettingAction(id));
    }
}

export async function getGraphSnapshotRepository(): Promise<RepositoryResult<{
    documents: GraphDocumentRecord[];
    operations: GraphOperationRecord[];
}>> {
    try {
        return {
            data: {
                documents: await loadGraphDocumentsFromSupabase(),
                operations: await loadGraphOperationsFromSupabase(),
            },
            source: "supabase",
        };
    } catch (error: unknown) {
        return fallbackResult("graph", error, {
            documents: listGraphDocuments(),
            operations: listGraphOperations(),
        });
    }
}

export async function recordGraphOperationRepository(
    type: GraphOperationType
): Promise<RepositoryResult<{ operation: GraphOperationRecord; operations: GraphOperationRecord[] }>> {
    const operation = buildGraphOperationRecord(type);

    try {
        const supabase = getSupabaseAdminClient();
        const insertResult = await supabase
            .from("graph_operations")
            .insert({
                id: operation.id,
                type: operation.type,
                detail: operation.detail,
                status: operation.status,
                executed_at: operation.executedAt,
            });

        if (insertResult.error) {
            throw new Error(`Graph operation insert failed: ${insertResult.error.message}`);
        }

        return {
            data: {
                operation,
                operations: await loadGraphOperationsFromSupabase(),
            },
            source: "supabase",
        };
    } catch (error: unknown) {
        const fallbackOperation = recordGraphOperation(type);
        return fallbackResult("graph operations", error, {
            operation: fallbackOperation,
            operations: listGraphOperations(),
        });
    }
}

export async function recordGraphUploadRepository(input: {
    name: string;
    mimeType: string;
    sizeBytes: number;
    source: GraphDocumentRecord["source"];
    storageBucket?: string | null;
    storagePath?: string | null;
}): Promise<RepositoryResult<GraphDocumentRecord>> {
    const document = buildGraphDocumentRecord(input);

    try {
        const supabase = getSupabaseAdminClient();
        const insertResult = await supabase
            .from("graph_documents")
            .insert({
                id: document.id,
                name: document.name,
                mime_type: document.mimeType,
                size_bytes: document.sizeBytes,
                size_label: document.sizeLabel,
                pages: document.pages,
                progress: document.progress,
                stage: document.stage,
                nodes_generated: document.nodesGenerated,
                edges_formed: document.edgesFormed,
                duration_label: document.durationLabel,
                status: document.status,
                uploaded_at: document.uploadedAt,
                source: document.source,
                storage_bucket: input.storageBucket ?? null,
                storage_path: input.storagePath ?? null,
            });

        if (insertResult.error) {
            throw new Error(`Graph document insert failed: ${insertResult.error.message}`);
        }

        return { data: document, source: "supabase" };
    } catch (error: unknown) {
        return fallbackResult("graph documents", error, recordGraphUpload({
            name: input.name,
            mimeType: input.mimeType,
            sizeBytes: input.sizeBytes,
            source: input.source === "demo" ? "demo" : "backend",
        }));
    }
}
