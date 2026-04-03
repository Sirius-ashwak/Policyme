export type ClaimStatus =
    | "Submitted"
    | "Under Review"
    | "Urgent"
    | "Approved"
    | "Rejected"
    | "Closed";

export type ApplicationStatus =
    | "Pending Review"
    | "Under Review"
    | "Approved"
    | "Rejected";

export type ClaimEvidenceFile = {
    name: string;
    sizeBytes: number;
    type: string;
};

export type ClaimTimelineEntry = {
    label: string;
    detail: string;
    timestamp: string;
};

export type ClaimPolicyMatch = {
    clauseId: string;
    title: string;
    excerpt: string;
    confidence: number;
};

export type ClaimAnalysis = {
    recommendation: "approve" | "reject";
    payoutEstimate: string;
    reasoning: string[];
    policyMatches: ClaimPolicyMatch[];
};

export type ClaimRecord = {
    id: string;
    title: string;
    claimType: string;
    icon: string;
    policyId: string;
    policyHolder: string;
    status: ClaimStatus;
    incidentDate: string;
    location: string;
    description: string;
    estimatedAmount: string;
    createdAt: string;
    updatedAt: string;
    highlighted: boolean;
    evidenceFiles: ClaimEvidenceFile[];
    timeline: ClaimTimelineEntry[];
    analysis: ClaimAnalysis;
};

export type UnderwritingAssessment = {
    riskScore: number;
    factors: string[];
    recommend: "approve" | "reject";
    isMock?: boolean;
    generatedAt: string;
};

export type UnderwritingApplication = {
    id: string;
    applicantName: string;
    applicantEmail: string;
    applicantOrganization: string;
    policyType: string;
    policyIcon: string;
    submittedAt: string;
    status: ApplicationStatus;
    requestedCoverage: string;
    assetValue: string;
    location: string;
    claimsHistory: string;
    description: string;
    customerData: Record<string, unknown>;
    assessment: UnderwritingAssessment | null;
};

export type CustomerPolicyCoverageItem = {
    item: string;
    limit: string;
    deductible: string;
};

export type CustomerPolicyRecord = {
    id: string;
    name: string;
    type: string;
    status: "Active" | "Renewing Soon" | "Pending";
    premium: string;
    startDate: string;
    endDate: string;
    coverage: CustomerPolicyCoverageItem[];
};

export type BillingPaymentMethod = {
    brand: string;
    last4: string;
    expires: string;
    holderName: string;
};

export type BillingHistoryEntry = {
    id: string;
    date: string;
    amount: string;
    status: "Paid" | "Scheduled";
    reference: string;
};

export type CustomerBillingRecord = {
    nextPaymentAmount: string;
    nextPaymentDate: string;
    autoPay: boolean;
    paymentMethod: BillingPaymentMethod;
    history: BillingHistoryEntry[];
};

export type CustomerSettingId = "password" | "twofa" | "notifications" | "privacy";

export type CustomerSettingRecord = {
    id: CustomerSettingId;
    icon: string;
    title: string;
    description: string;
    actionLabel: string;
    statusLabel: string;
    lastUpdated: string;
};

export type AdminUserRecord = {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: string;
    lastActivityAt: string | null;
};

export type GraphDocumentStatus = "Committed" | "Processing" | "Failed";

export type GraphDocumentRecord = {
    id: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
    sizeLabel: string;
    pages: number;
    progress: number;
    stage: string;
    nodesGenerated: number;
    edgesFormed: number;
    durationLabel: string;
    status: GraphDocumentStatus;
    uploadedAt: string;
    source: "backend" | "demo" | "supabase";
};

export type GraphOperationType = "reindex" | "refresh_vectors";

export type GraphOperationRecord = {
    id: string;
    type: GraphOperationType;
    detail: string;
    status: "Completed";
    executedAt: string;
};

export type ManagerConflictResolution = "A" | "B";

export type ManagerConflictSourceRecord = {
    doc: string;
    section: string;
    text: string;
};

export type ManagerConflictRecord = {
    id: string;
    name: string;
    description: string;
    type: "Contradiction" | "Ambiguity";
    severity: "High" | "Medium" | "Low";
    docs: string;
    sourceA: ManagerConflictSourceRecord;
    sourceB: ManagerConflictSourceRecord;
    affectedClaims: number;
    lastDetectedAt: string;
    status: "Open" | "Resolved";
    resolution: ManagerConflictResolution | null;
};

export type ManagerReportCategory = "policies" | "compliance" | "searches" | "conflicts";

export type ManagerReportRecord = {
    id: number;
    name: string;
    date: string;
    status: "Generated" | "Archived";
    type: "PDF" | "CSV";
    category: ManagerReportCategory;
    generatedBy: string;
    summary: string;
};

export type ManagerOverviewRecord = {
    totalPolicies: number;
    complianceScore: number;
    searches30d: number;
};

export type AuditMetricsRecord = {
    authEvents: number;
    graphWrites: number;
    overrides: number;
    anomalies: number;
    totalEntries: number;
};

export type AuditLogRecord = {
    sequence: number;
    timestamp: string;
    timezoneLabel: string;
    actorName: string;
    actorBadge: string;
    actorMeta: string;
    actorKind: "system" | "ai" | "user";
    action: string;
    hash: string;
    statusLabel: string;
    outcome: "blocked" | "success" | "recorded";
    anomaly: boolean;
};

export type NewClaimInput = {
    claimType: string;
    incidentDate: string;
    incidentTime?: string;
    description: string;
    location: string;
    estimatedAmount: string;
    evidenceFiles: ClaimEvidenceFile[];
};

export type NewApplicationInput = {
    applicantName: string;
    applicantEmail: string;
    applicantOrganization: string;
    policyType: string;
    requestedCoverage: string;
    assetValue: string;
    location: string;
    claimsHistory: string;
    description: string;
    customerData: Record<string, unknown>;
};

type DemoStore = {
    claims: ClaimRecord[];
    applications: UnderwritingApplication[];
    customerPolicies: CustomerPolicyRecord[];
    customerBilling: CustomerBillingRecord;
    customerSettings: CustomerSettingRecord[];
    adminUsers: AdminUserRecord[];
    graphDocuments: GraphDocumentRecord[];
    graphOperations: GraphOperationRecord[];
    managerOverview: ManagerOverviewRecord;
    managerConflicts: ManagerConflictRecord[];
    managerReports: ManagerReportRecord[];
    auditMetrics: AuditMetricsRecord;
    auditLogs: AuditLogRecord[];
};

declare global {
    var __policymeDemoStore: DemoStore | undefined;
}

function clone<T>(value: T): T {
    return structuredClone(value);
}

function createTimestamp(date: string): string {
    return new Date(date).toISOString();
}

function formatCurrency(input: string): string {
    const numeric = Number.parseFloat(input.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric)) {
        return input.trim() || "$0";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
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
    const status = statusFromAmount(estimatedAmount, input.claimType);

    return {
        id,
        title: titleFromClaim(input),
        claimType: input.claimType,
        icon: iconFromClaimType(input.claimType),
        policyId: input.claimType.toLowerCase().includes("property") ? "HM-44012-BY" : "AU-82910-XM",
        policyHolder: "Sarah Mitchell",
        status,
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
        customerData: clone(input.customerData),
        assessment: null,
    };
}

function makeSeedClaims(): ClaimRecord[] {
    return [
        {
            id: "CL-90122",
            title: "Windshield Damage",
            claimType: "auto-comprehensive",
            icon: "directions_car",
            policyId: "AU-82910-XM",
            policyHolder: "Sarah Mitchell",
            status: "Under Review",
            incidentDate: "2023-10-14",
            location: "San Francisco, CA",
            description: "A highway rock struck the front windshield during evening traffic and created a full-width crack that requires replacement.",
            estimatedAmount: "$1,250",
            createdAt: createTimestamp("2023-10-14T09:42:00Z"),
            updatedAt: createTimestamp("2023-10-14T13:20:00Z"),
            highlighted: false,
            evidenceFiles: [
                { name: "windshield_photo.jpg", sizeBytes: 1240000, type: "image/jpeg" },
            ],
            timeline: [
                {
                    label: "Claim Submitted",
                    detail: "Customer uploaded windshield photos and incident summary.",
                    timestamp: createTimestamp("2023-10-14T09:42:00Z"),
                },
                {
                    label: "Quote Verification",
                    detail: "Safelite estimate is under review by the adjuster team.",
                    timestamp: createTimestamp("2023-10-14T13:20:00Z"),
                },
            ],
            analysis: buildClaimAnalysis("auto-comprehensive", "$1250"),
        },
        {
            id: "CL-88401",
            title: "Rear-end Collision",
            claimType: "auto-collision",
            icon: "directions_car",
            policyId: "AU-55081-QN",
            policyHolder: "James Harrison",
            status: "Approved",
            incidentDate: "2023-08-03",
            location: "Oakland, CA",
            description: "Vehicle sustained rear bumper and trunk damage after being struck at a stoplight.",
            estimatedAmount: "$4,250",
            createdAt: createTimestamp("2023-08-03T16:10:00Z"),
            updatedAt: createTimestamp("2023-08-05T11:00:00Z"),
            highlighted: false,
            evidenceFiles: [
                { name: "collision_report.pdf", sizeBytes: 220000, type: "application/pdf" },
                { name: "rear_bumper.jpg", sizeBytes: 980000, type: "image/jpeg" },
            ],
            timeline: [
                {
                    label: "Claim Submitted",
                    detail: "Police report and repair estimate received.",
                    timestamp: createTimestamp("2023-08-03T16:10:00Z"),
                },
                {
                    label: "Approved For Payout",
                    detail: "Repair reimbursement was approved after liability validation.",
                    timestamp: createTimestamp("2023-08-05T11:00:00Z"),
                },
            ],
            analysis: buildClaimAnalysis("auto-collision", "$4250"),
        },
        {
            id: "CL-77219",
            title: "Residential Water Damage",
            claimType: "property",
            icon: "home",
            policyId: "HM-44012-BY",
            policyHolder: "Aria Khel",
            status: "Urgent",
            incidentDate: "2023-03-18",
            location: "San Jose, CA",
            description: "A burst supply line flooded the kitchen and adjacent hallway, damaging cabinetry and flooring.",
            estimatedAmount: "$8,900",
            createdAt: createTimestamp("2023-03-18T07:25:00Z"),
            updatedAt: createTimestamp("2023-03-18T08:00:00Z"),
            highlighted: true,
            evidenceFiles: [
                { name: "kitchen_overview.jpg", sizeBytes: 1320000, type: "image/jpeg" },
                { name: "mitigation_invoice.pdf", sizeBytes: 410000, type: "application/pdf" },
            ],
            timeline: [
                {
                    label: "Emergency Intake",
                    detail: "Property claim routed to priority review.",
                    timestamp: createTimestamp("2023-03-18T07:25:00Z"),
                },
                {
                    label: "Priority Escalation",
                    detail: "Potential secondary water ingress flagged for same-day review.",
                    timestamp: createTimestamp("2023-03-18T08:00:00Z"),
                },
            ],
            analysis: buildClaimAnalysis("property", "$8900"),
        },
    ];
}

function makeSeedApplications(): UnderwritingApplication[] {
    return [
        {
            id: "APP-94281",
            applicantName: "Sarah Mitchell",
            applicantEmail: "sm.design@email.com",
            applicantOrganization: "Sterling Real Estate Holdings",
            policyType: "Commercial Property",
            policyIcon: "home",
            submittedAt: "2023-10-24",
            status: "Under Review",
            requestedCoverage: "$2,500,000",
            assetValue: "$14.2M",
            location: "452 Meridian Avenue, San Francisco, CA",
            claimsHistory: "1 low-severity property claim in 8 years",
            description: "Mixed-use commercial plaza with upgraded fire suppression and strong tenant credit profile.",
            customerData: {
                applicant_name: "Sterling Real Estate Holdings",
                policy_type: "Commercial Property",
                requested_coverage: 2500000,
                asset_value: 14200000,
                occupancy_rate: 94,
                years_in_portfolio: 8,
                claims_last_5_years: 1,
                flood_zone: "secondary",
                fire_suppression_upgrade: true,
                location: "San Francisco, CA",
            },
            assessment: {
                riskScore: 85,
                factors: [
                    "Modernized fire suppression lowers fire-related exposure.",
                    "Secondary flood zone requires structural review.",
                    "Strong tenant credit mix improves revenue stability.",
                ],
                recommend: "approve",
                isMock: true,
                generatedAt: createTimestamp("2023-10-24T14:00:00Z"),
            },
        },
        {
            id: "APP-93102",
            applicantName: "James Harrison",
            applicantEmail: "j.harrison@corp.net",
            applicantOrganization: "Northline Fleet Services",
            policyType: "Commercial Auto",
            policyIcon: "directions_car",
            submittedAt: "2023-10-23",
            status: "Pending Review",
            requestedCoverage: "$750,000",
            assetValue: "$480,000",
            location: "Oakland, CA",
            claimsHistory: "3 collision losses in 24 months",
            description: "Fleet coverage request for executive and courier vehicles operating across the Bay Area.",
            customerData: {
                applicant_name: "Northline Fleet Services",
                policy_type: "Commercial Auto",
                requested_coverage: 750000,
                fleet_size: 12,
                garaging_location: "Oakland, CA",
                claims_last_24_months: 3,
                telematics_enabled: false,
                driver_training_program: false,
            },
            assessment: {
                riskScore: 45,
                factors: [
                    "Claims frequency is elevated for the fleet size.",
                    "No telematics or formal driver training controls were declared.",
                    "Urban operating footprint increases collision exposure.",
                ],
                recommend: "reject",
                isMock: true,
                generatedAt: createTimestamp("2023-10-23T11:30:00Z"),
            },
        },
        {
            id: "APP-92884",
            applicantName: "Aria Khel",
            applicantEmail: "aria.k@cloud.com",
            applicantOrganization: "Oakwood Residence Trust",
            policyType: "Residential Premium",
            policyIcon: "shield",
            submittedAt: "2023-10-23",
            status: "Under Review",
            requestedCoverage: "$900,000",
            assetValue: "$1.1M",
            location: "San Francisco, CA",
            claimsHistory: "No prior losses",
            description: "Primary residence with recent roof replacement and monitored security system.",
            customerData: {
                applicant_name: "Aria Khel",
                policy_type: "Residential Premium",
                requested_coverage: 900000,
                property_value: 1100000,
                roof_replaced_in_last_5_years: true,
                monitored_security_system: true,
                claims_last_5_years: 0,
                location: "San Francisco, CA",
            },
            assessment: {
                riskScore: 94,
                factors: [
                    "Recent roof replacement reduces near-term structural exposure.",
                    "No prior losses reported in the last five years.",
                    "Monitored security system lowers theft risk.",
                ],
                recommend: "approve",
                isMock: true,
                generatedAt: createTimestamp("2023-10-23T10:15:00Z"),
            },
        },
        {
            id: "APP-91203",
            applicantName: "Thomas Baxter",
            applicantEmail: "tbaxter@consultancy.io",
            applicantOrganization: "Harbor Medical",
            policyType: "Health Comprehensive",
            policyIcon: "favorite",
            submittedAt: "2023-10-22",
            status: "Pending Review",
            requestedCoverage: "$1,200,000",
            assetValue: "$3.6M",
            location: "San Mateo, CA",
            claimsHistory: "Open malpractice dispute and 2 prior high-cost claims",
            description: "Multi-site clinic network requesting expanded health and liability coverage.",
            customerData: {
                applicant_name: "Harbor Medical",
                policy_type: "Health Comprehensive",
                requested_coverage: 1200000,
                annual_revenue: 6200000,
                open_litigation: true,
                claims_last_36_months: 2,
                high_cost_claims: true,
                location: "San Mateo, CA",
            },
            assessment: {
                riskScore: 28,
                factors: [
                    "Open litigation materially increases underwriting uncertainty.",
                    "Recent high-cost claims create adverse loss history.",
                    "Expanded coverage request is not matched by stronger controls.",
                ],
                recommend: "reject",
                isMock: true,
                generatedAt: createTimestamp("2023-10-22T09:05:00Z"),
            },
        },
    ];
}

function makeSeedCustomerPolicies(): CustomerPolicyRecord[] {
    return [
        {
            id: "POL-AUTO-2026-001",
            name: "Comprehensive Auto Insurance",
            type: "Auto",
            status: "Active",
            premium: "$142/mo",
            startDate: "2026-01-01",
            endDate: "2026-12-31",
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
            startDate: "2026-03-01",
            endDate: "2027-02-28",
            coverage: [
                { item: "Dwelling Coverage", limit: "$350,000", deductible: "$1,000" },
                { item: "Personal Property", limit: "$175,000", deductible: "$500" },
                { item: "Liability Protection", limit: "$300,000", deductible: "None" },
                { item: "Water Damage (Non-Flood)", limit: "$50,000", deductible: "$1,000" },
            ],
        },
    ];
}

function makeSeedCustomerBilling(): CustomerBillingRecord {
    return {
        nextPaymentAmount: "$247.50",
        nextPaymentDate: "2026-04-24",
        autoPay: true,
        paymentMethod: {
            brand: "VISA",
            last4: "4291",
            expires: "09/2027",
            holderName: "Sarah Mitchell",
        },
        history: [
            { id: "PAY-20260324", date: "2026-03-24", amount: "$247.50", status: "Paid", reference: "INV-2026-03" },
            { id: "PAY-20260224", date: "2026-02-24", amount: "$247.50", status: "Paid", reference: "INV-2026-02" },
            { id: "PAY-20260124", date: "2026-01-24", amount: "$247.50", status: "Paid", reference: "INV-2026-01" },
        ],
    };
}

function makeSeedCustomerSettings(): CustomerSettingRecord[] {
    return [
        {
            id: "password",
            icon: "lock",
            title: "Password",
            description: "Reset and rotate your account password.",
            actionLabel: "Update",
            statusLabel: "Last changed 45 days ago",
            lastUpdated: createTimestamp("2026-02-15T09:00:00Z"),
        },
        {
            id: "twofa",
            icon: "security",
            title: "Two-Factor Authentication",
            description: "Authenticator app challenge is required at sign-in.",
            actionLabel: "Manage",
            statusLabel: "Enabled",
            lastUpdated: createTimestamp("2026-01-12T11:30:00Z"),
        },
        {
            id: "notifications",
            icon: "notifications",
            title: "Notifications",
            description: "Delivery channels for billing, claims, and account alerts.",
            actionLabel: "Configure",
            statusLabel: "Email + SMS",
            lastUpdated: createTimestamp("2026-03-20T08:15:00Z"),
        },
        {
            id: "privacy",
            icon: "visibility",
            title: "Privacy",
            description: "Sharing controls for account activity and claim updates.",
            actionLabel: "Review",
            statusLabel: "Standard",
            lastUpdated: createTimestamp("2026-03-01T15:45:00Z"),
        },
    ];
}

function makeSeedAdminUsers(): AdminUserRecord[] {
    return [
        {
            id: "USR-1001",
            name: "Sarah Chen",
            email: "sarah.chen@insurai.io",
            role: "Underwriter",
            department: "Commercial Risk",
            status: "Active",
            lastActivityAt: createTimestamp("2026-04-02T09:30:00Z"),
        },
        {
            id: "USR-1002",
            name: "Marcus Jordan",
            email: "m.jordan@claims.net",
            role: "Adjuster",
            department: "Claims",
            status: "Pending MFA",
            lastActivityAt: createTimestamp("2026-04-02T07:20:00Z"),
        },
        {
            id: "USR-1003",
            name: "Elena Rodriguez",
            email: "elena.rod@global-inc.com",
            role: "Customer",
            department: "Enterprise",
            status: "Active",
            lastActivityAt: createTimestamp("2026-04-01T18:45:00Z"),
        },
        {
            id: "USR-1004",
            name: "David Kim",
            email: "dkim_02@temp.com",
            role: "Adjuster",
            department: "Temporary Staff",
            status: "Suspended",
            lastActivityAt: createTimestamp("2026-03-28T09:12:00Z"),
        },
        {
            id: "USR-1005",
            name: "Priya Nair",
            email: "priya.nair@insurai.io",
            role: "Admin",
            department: "Platform Ops",
            status: "Active",
            lastActivityAt: createTimestamp("2026-04-02T08:05:00Z"),
        },
        {
            id: "USR-1006",
            name: "Thomas Baxter",
            email: "tbaxter@consultancy.io",
            role: "Customer",
            department: "Broker Channel",
            status: "Invited",
            lastActivityAt: createTimestamp("2026-03-30T13:10:00Z"),
        },
    ];
}

function makeSeedGraphDocuments(): GraphDocumentRecord[] {
    return [
        {
            id: "DOC-1001",
            name: "Auto_Insurance_Policy_TX.pdf",
            mimeType: "application/pdf",
            sizeBytes: 8_400_000,
            sizeLabel: "8.4 MB",
            pages: 142,
            progress: 100,
            stage: "Committed to Neo4j semantic layer",
            nodesGenerated: 1402,
            edgesFormed: 12841,
            durationLabel: "02m 41s",
            status: "Committed",
            uploadedAt: createTimestamp("2026-04-02T07:10:00Z"),
            source: "demo",
        },
        {
            id: "DOC-1002",
            name: "Commercial_Liability_Q3.pdf",
            mimeType: "application/pdf",
            sizeBytes: 6_900_000,
            sizeLabel: "6.9 MB",
            pages: 118,
            progress: 84,
            stage: "Vectorizing chunks (241/280)",
            nodesGenerated: 982,
            edgesFormed: 9140,
            durationLabel: "01m 54s",
            status: "Processing",
            uploadedAt: createTimestamp("2026-04-02T08:12:00Z"),
            source: "demo",
        },
        {
            id: "DOC-1003",
            name: "Homeowner_HO3_Rider.pdf",
            mimeType: "application/pdf",
            sizeBytes: 3_300_000,
            sizeLabel: "3.3 MB",
            pages: 64,
            progress: 42,
            stage: "Identifying entities and relationships",
            nodesGenerated: 421,
            edgesFormed: 2874,
            durationLabel: "00m 49s",
            status: "Processing",
            uploadedAt: createTimestamp("2026-04-02T08:45:00Z"),
            source: "demo",
        },
        {
            id: "DOC-1004",
            name: "State_Regulations_CA_2024.pdf",
            mimeType: "application/pdf",
            sizeBytes: 5_100_000,
            sizeLabel: "5.1 MB",
            pages: 86,
            progress: 5,
            stage: "Waiting for OCR pipeline",
            nodesGenerated: 0,
            edgesFormed: 0,
            durationLabel: "Queued",
            status: "Processing",
            uploadedAt: createTimestamp("2026-04-02T09:05:00Z"),
            source: "demo",
        },
    ];
}

function makeSeedGraphOperations(): GraphOperationRecord[] {
    return [
        {
            id: "GRAPH-OP-1001",
            type: "reindex",
            detail: "Node reindex completed and cache warmed.",
            status: "Completed",
            executedAt: createTimestamp("2026-04-02T06:45:00Z"),
        },
        {
            id: "GRAPH-OP-1002",
            type: "refresh_vectors",
            detail: "Global vector refresh completed across active clusters.",
            status: "Completed",
            executedAt: createTimestamp("2026-04-01T21:18:00Z"),
        },
    ];
}

function makeSeedManagerOverview(): ManagerOverviewRecord {
    return {
        totalPolicies: 247,
        complianceScore: 92,
        searches30d: 1204,
    };
}

function makeSeedManagerConflicts(): ManagerConflictRecord[] {
    return [
        {
            id: "CONF-9281",
            name: "Rental Car Reimbursement limits",
            description: "Contradiction in rental car reimbursement limits across base and premium wording.",
            type: "Contradiction",
            severity: "High",
            docs: "Master Auto Policy 2026, Premium Rider Addendum",
            sourceA: {
                doc: "Master Auto Policy 2026.pdf",
                section: "Section 4.1",
                text: "Rental car reimbursement is limited to $40/day for a maximum of 30 days.",
            },
            sourceB: {
                doc: "Premium Rider Addendum.pdf",
                section: "Clause 2B",
                text: "Premium policyholders are entitled to unlimited rental car reimbursement up to $75/day.",
            },
            affectedClaims: 14,
            lastDetectedAt: createTimestamp("2026-04-02T08:40:00Z"),
            status: "Open",
            resolution: null,
        },
        {
            id: "CONF-9282",
            name: "Flood Damage definition",
            description: "Ambiguous definition of flood-related loss versus sewer and drain backup coverage.",
            type: "Ambiguity",
            severity: "Medium",
            docs: "Homeowners Policy Base, Water Backup Endorsement",
            sourceA: {
                doc: "Homeowners Policy Base.pdf",
                section: "Exclusions 3(a)",
                text: "Damage caused by surface water, waves, or tidal water is excluded.",
            },
            sourceB: {
                doc: "Water Backup Endorsement.pdf",
                section: "Coverage",
                text: "Covers water backing up through sewers or drains, or overflowing from a sump.",
            },
            affectedClaims: 3,
            lastDetectedAt: createTimestamp("2026-04-01T19:10:00Z"),
            status: "Open",
            resolution: null,
        },
        {
            id: "CONF-9283",
            name: "Commercial cargo theft sublimit",
            description: "Competing sublimits are defined for overnight cargo theft losses in fleet coverage.",
            type: "Contradiction",
            severity: "High",
            docs: "Fleet Cargo Rider, Commercial Auto Schedule",
            sourceA: {
                doc: "Fleet Cargo Rider.pdf",
                section: "Article 5",
                text: "The maximum payable cargo theft limit is $150,000 per occurrence.",
            },
            sourceB: {
                doc: "Commercial Auto Schedule.pdf",
                section: "Schedule 7",
                text: "Overnight theft losses are capped at $75,000 per occurrence unless guarded parking is documented.",
            },
            affectedClaims: 8,
            lastDetectedAt: createTimestamp("2026-03-31T14:25:00Z"),
            status: "Open",
            resolution: null,
        },
        {
            id: "CONF-9284",
            name: "Device usage policy retention window",
            description: "Ambiguous retention period for employee device forensic logs after incident response.",
            type: "Ambiguity",
            severity: "Low",
            docs: "IT Device Standard, Security Incident Playbook",
            sourceA: {
                doc: "IT Device Standard.pdf",
                section: "6.4",
                text: "Endpoint logs must be retained for 30 days following security review.",
            },
            sourceB: {
                doc: "Security Incident Playbook.pdf",
                section: "Retention",
                text: "Forensic artifacts should be preserved for 90 days when employee devices are involved.",
            },
            affectedClaims: 1,
            lastDetectedAt: createTimestamp("2026-03-30T10:05:00Z"),
            status: "Open",
            resolution: null,
        },
    ];
}

function makeSeedManagerReports(): ManagerReportRecord[] {
    return [
        {
            id: 1,
            name: "Q1 Compliance Audit",
            date: "Mar 1, 2026",
            status: "Generated",
            type: "PDF",
            category: "compliance",
            generatedBy: "Lisa Manager",
            summary: "Quarterly control review with carrier and regulatory compliance exceptions.",
        },
        {
            id: 2,
            name: "Active Policy Portfolio Summary",
            date: "Feb 22, 2026",
            status: "Generated",
            type: "PDF",
            category: "policies",
            generatedBy: "InsurAI Reporting",
            summary: "Portfolio distribution across auto, property, and specialty endorsements.",
        },
        {
            id: 3,
            name: "HR vs IT Policy Conflicts",
            date: "Feb 15, 2026",
            status: "Generated",
            type: "CSV",
            category: "conflicts",
            generatedBy: "Lisa Manager",
            summary: "Cross-department contradiction register for policy harmonization.",
        },
        {
            id: 4,
            name: "Monthly Search Volume Analytics",
            date: "Feb 1, 2026",
            status: "Generated",
            type: "PDF",
            category: "searches",
            generatedBy: "InsurAI Reporting",
            summary: "Graph search demand by policy family, role, and time of day.",
        },
        {
            id: 5,
            name: "Data Security Policy Gaps",
            date: "Jan 20, 2026",
            status: "Archived",
            type: "PDF",
            category: "compliance",
            generatedBy: "Security Office",
            summary: "Archived gap analysis covering identity, MFA, and endpoint controls.",
        },
        {
            id: 6,
            name: "Claims Search Escalation Review",
            date: "Jan 12, 2026",
            status: "Generated",
            type: "CSV",
            category: "searches",
            generatedBy: "InsurAI Reporting",
            summary: "High-friction search sessions that resulted in adjuster escalation.",
        },
        {
            id: 7,
            name: "Policy Renewal Exposure Overview",
            date: "Dec 22, 2025",
            status: "Archived",
            type: "PDF",
            category: "policies",
            generatedBy: "Portfolio Ops",
            summary: "Renewal concentration and expiring risk segments across active accounts.",
        },
    ];
}

function makeSeedAuditMetrics(): AuditMetricsRecord {
    return {
        authEvents: 12402,
        graphWrites: 3812,
        overrides: 402,
        anomalies: 14,
        totalEntries: 49201,
    };
}

function makeSeedAuditLogs(): AuditLogRecord[] {
    return [
        {
            sequence: 49201,
            timestamp: createTimestamp("2026-04-02T19:02:11Z"),
            timezoneLabel: "UTC-5",
            actorName: "System Account",
            actorBadge: "MJ",
            actorMeta: "172.16.25.12",
            actorKind: "system",
            action: "Multiple failed MFA attempts",
            hash: "0x7b4a...92cf1a",
            statusLabel: "Blocked",
            outcome: "blocked",
            anomaly: true,
        },
        {
            sequence: 49200,
            timestamp: createTimestamp("2026-04-02T18:45:22Z"),
            timezoneLabel: "UTC-5",
            actorName: "GraphRAG Engine",
            actorBadge: "AI",
            actorMeta: "internal-cluster",
            actorKind: "ai",
            action: "Commit vector embeddings (Batch #442)",
            hash: "0x2f8c...331e8b",
            statusLabel: "Success",
            outcome: "success",
            anomaly: false,
        },
        {
            sequence: 49199,
            timestamp: createTimestamp("2026-04-02T16:20:05Z"),
            timezoneLabel: "UTC-5",
            actorName: "Sarah Chen",
            actorBadge: "SC",
            actorMeta: "192.168.1.104",
            actorKind: "user",
            action: "Force LLM override (Claim #9822)",
            hash: "0xa11f...45dd90",
            statusLabel: "Recorded",
            outcome: "recorded",
            anomaly: false,
        },
        {
            sequence: 49198,
            timestamp: createTimestamp("2026-04-02T15:54:48Z"),
            timezoneLabel: "UTC-5",
            actorName: "Priya Nair",
            actorBadge: "PN",
            actorMeta: "10.12.8.31",
            actorKind: "user",
            action: "Changed underwriter role assignment for USR-1044",
            hash: "0xcd91...8f31de",
            statusLabel: "Recorded",
            outcome: "recorded",
            anomaly: false,
        },
        {
            sequence: 49197,
            timestamp: createTimestamp("2026-04-02T14:10:09Z"),
            timezoneLabel: "UTC-5",
            actorName: "InsurAI Policy Agent",
            actorBadge: "AI",
            actorMeta: "semantic-cluster-3",
            actorKind: "ai",
            action: "Flagged contradiction CONF-9281 during nightly graph scan",
            hash: "0xef02...4ab102",
            statusLabel: "Success",
            outcome: "success",
            anomaly: true,
        },
        {
            sequence: 49196,
            timestamp: createTimestamp("2026-04-02T13:18:32Z"),
            timezoneLabel: "UTC-5",
            actorName: "Lisa Manager",
            actorBadge: "LM",
            actorMeta: "172.20.8.6",
            actorKind: "user",
            action: "Exported conflict summary report",
            hash: "0x991a...122ef0",
            statusLabel: "Success",
            outcome: "success",
            anomaly: false,
        },
        {
            sequence: 49195,
            timestamp: createTimestamp("2026-04-02T11:44:15Z"),
            timezoneLabel: "UTC-5",
            actorName: "Document Ingestion Service",
            actorBadge: "AI",
            actorMeta: "ingestion-node-2",
            actorKind: "ai",
            action: "Committed Homeowner_HO3_Rider.pdf to graph source bucket",
            hash: "0x1ab3...f8ce21",
            statusLabel: "Success",
            outcome: "success",
            anomaly: false,
        },
        {
            sequence: 49194,
            timestamp: createTimestamp("2026-04-01T22:05:02Z"),
            timezoneLabel: "UTC-5",
            actorName: "Security Monitor",
            actorBadge: "SM",
            actorMeta: "edge-gateway-1",
            actorKind: "system",
            action: "Detected unusual sign-in velocity for dkim_02@temp.com",
            hash: "0xb118...74ae44",
            statusLabel: "Blocked",
            outcome: "blocked",
            anomaly: true,
        },
    ];
}

function getStore(): DemoStore {
    if (!globalThis.__policymeDemoStore) {
        globalThis.__policymeDemoStore = {
            claims: makeSeedClaims(),
            applications: makeSeedApplications(),
            customerPolicies: makeSeedCustomerPolicies(),
            customerBilling: makeSeedCustomerBilling(),
            customerSettings: makeSeedCustomerSettings(),
            adminUsers: makeSeedAdminUsers(),
            graphDocuments: makeSeedGraphDocuments(),
            graphOperations: makeSeedGraphOperations(),
            managerOverview: makeSeedManagerOverview(),
            managerConflicts: makeSeedManagerConflicts(),
            managerReports: makeSeedManagerReports(),
            auditMetrics: makeSeedAuditMetrics(),
            auditLogs: makeSeedAuditLogs(),
        };
    }

    return globalThis.__policymeDemoStore;
}

export function listClaims(): ClaimRecord[] {
    const claims = getStore().claims
        .slice()
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    return clone(claims);
}

export function getClaimById(id: string): ClaimRecord | null {
    const claim = getStore().claims.find((entry) => entry.id === id);
    return claim ? clone(claim) : null;
}

export function createClaim(input: NewClaimInput): ClaimRecord {
    const claim = buildClaimRecord(input);
    const store = getStore();
    store.claims.unshift(claim);
    return clone(claim);
}

export function updateClaimStatus(id: string, status: ClaimStatus): ClaimRecord | null {
    const store = getStore();
    const claim = store.claims.find((entry) => entry.id === id);
    if (!claim) {
        return null;
    }

    claim.status = status;
    claim.updatedAt = new Date().toISOString();
    claim.timeline.unshift({
        label: `Status Updated: ${status}`,
        detail: `Claim status changed to ${status}.`,
        timestamp: claim.updatedAt,
    });

    return clone(claim);
}

export function listApplications(): UnderwritingApplication[] {
    const applications = getStore().applications
        .slice()
        .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
    return clone(applications);
}

export function createApplication(input: NewApplicationInput): UnderwritingApplication {
    const application = buildApplicationRecord(input);
    const store = getStore();
    store.applications.unshift(application);
    return clone(application);
}

export function getApplicationById(id: string): UnderwritingApplication | null {
    const application = getStore().applications.find((entry) => entry.id === id);
    return application ? clone(application) : null;
}

export function updateApplicationStatus(id: string, status: ApplicationStatus): UnderwritingApplication | null {
    const store = getStore();
    const application = store.applications.find((entry) => entry.id === id);
    if (!application) {
        return null;
    }

    application.status = status;
    return clone(application);
}

export function saveApplicationAssessment(
    id: string,
    assessment: UnderwritingAssessment
): UnderwritingApplication | null {
    const store = getStore();
    const application = store.applications.find((entry) => entry.id === id);
    if (!application) {
        return null;
    }

    application.assessment = assessment;
    if (application.status === "Pending Review") {
        application.status = "Under Review";
    }

    return clone(application);
}

export function listCustomerPolicies(): CustomerPolicyRecord[] {
    return clone(getStore().customerPolicies);
}

export function getCustomerBilling(): CustomerBillingRecord {
    return clone(getStore().customerBilling);
}

export function payCustomerBilling(): CustomerBillingRecord {
    const store = getStore();
    const billing = store.customerBilling;
    const paidAt = new Date().toISOString();

    billing.history.unshift({
        id: `PAY-${Date.now()}`,
        date: billing.nextPaymentDate,
        amount: billing.nextPaymentAmount,
        status: "Paid",
        reference: `INV-${new Date(billing.nextPaymentDate).toISOString().slice(0, 7)}`,
    });
    billing.nextPaymentDate = plusMonths(billing.nextPaymentDate, 1).slice(0, 10);
    billing.history = billing.history.slice(0, 12);
    if (billing.history[0]) {
        billing.history[0].date = paidAt.slice(0, 10);
    }

    return clone(billing);
}

export function refreshCustomerPaymentMethod(): CustomerBillingRecord {
    const store = getStore();
    const billing = store.customerBilling;

    if (billing.paymentMethod.brand === "VISA") {
        billing.paymentMethod = {
            brand: "AMEX",
            last4: "1183",
            expires: "02/2029",
            holderName: billing.paymentMethod.holderName,
        };
    } else {
        billing.paymentMethod = {
            brand: "VISA",
            last4: "4291",
            expires: "09/2027",
            holderName: billing.paymentMethod.holderName,
        };
    }

    return clone(billing);
}

export function listCustomerSettings(): CustomerSettingRecord[] {
    return clone(getStore().customerSettings);
}

export function runCustomerSettingAction(id: CustomerSettingId): CustomerSettingRecord[] {
    const store = getStore();
    const setting = store.customerSettings.find((entry) => entry.id === id);
    if (!setting) {
        return clone(store.customerSettings);
    }

    setting.lastUpdated = new Date().toISOString();

    if (id === "password") {
        setting.statusLabel = "Reset link issued";
        setting.actionLabel = "Reissue";
    } else if (id === "twofa") {
        const enabled = setting.statusLabel === "Enabled";
        setting.statusLabel = enabled ? "Disabled" : "Enabled";
        setting.description = enabled
            ? "Second-factor enrollment is currently paused."
            : "Authenticator app challenge is required at sign-in.";
        setting.actionLabel = enabled ? "Enable" : "Manage";
    } else if (id === "notifications") {
        const smsEnabled = setting.statusLabel === "Email + SMS";
        setting.statusLabel = smsEnabled ? "Email only" : "Email + SMS";
        setting.description = smsEnabled
            ? "Only primary email alerts will be sent for account changes."
            : "Delivery channels for billing, claims, and account alerts.";
        setting.actionLabel = smsEnabled ? "Add SMS" : "Configure";
    } else if (id === "privacy") {
        const strict = setting.statusLabel === "Strict";
        setting.statusLabel = strict ? "Standard" : "Strict";
        setting.description = strict
            ? "Sharing controls for account activity and claim updates."
            : "Only essential service events will be shared with partner systems.";
        setting.actionLabel = "Review";
    }

    return clone(store.customerSettings);
}

export function listAdminUsers(): AdminUserRecord[] {
    const users = getStore().adminUsers
        .slice()
        .sort((left, right) => (right.lastActivityAt || "").localeCompare(left.lastActivityAt || ""));
    return clone(users);
}

export function listGraphDocuments(): GraphDocumentRecord[] {
    const documents = getStore().graphDocuments
        .slice()
        .sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt));
    return clone(documents);
}

export function listGraphOperations(): GraphOperationRecord[] {
    const operations = getStore().graphOperations
        .slice()
        .sort((left, right) => right.executedAt.localeCompare(left.executedAt));
    return clone(operations);
}

export function recordGraphUpload(input: {
    name: string;
    mimeType: string;
    sizeBytes: number;
    source: "backend" | "demo" | "supabase";
}): GraphDocumentRecord {
    const store = getStore();
    const pages = Math.max(8, Math.round(input.sizeBytes / 70_000));
    const nodesGenerated = Math.max(120, Math.round(pages * 9.4));
    const edgesFormed = Math.max(640, Math.round(nodesGenerated * 7.2));
    const uploadedAt = new Date().toISOString();

    const document: GraphDocumentRecord = {
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

    store.graphDocuments.unshift(document);
    store.graphDocuments = store.graphDocuments.slice(0, 20);
    return clone(document);
}

export function recordGraphOperation(type: GraphOperationType): GraphOperationRecord {
    const store = getStore();
    const operation: GraphOperationRecord = {
        id: `GRAPH-OP-${Math.floor(10000 + Math.random() * 90000)}`,
        type,
        detail: type === "reindex"
            ? "Node reindex completed and cache warmed."
            : "Global vector refresh completed across active clusters.",
        status: "Completed",
        executedAt: new Date().toISOString(),
    };

    store.graphOperations.unshift(operation);
    store.graphOperations = store.graphOperations.slice(0, 12);
    return clone(operation);
}

export function getManagerOverview(): ManagerOverviewRecord & { activeConflicts: number } {
    const store = getStore();
    return {
        ...clone(store.managerOverview),
        activeConflicts: store.managerConflicts.filter((conflict) => conflict.status === "Open").length,
    };
}

export function listManagerConflicts(): ManagerConflictRecord[] {
    const conflicts = getStore().managerConflicts
        .slice()
        .sort((left, right) => right.lastDetectedAt.localeCompare(left.lastDetectedAt));
    return clone(conflicts);
}

export function resolveManagerConflict(
    id: string,
    resolution: ManagerConflictResolution
): ManagerConflictRecord | null {
    const store = getStore();
    const conflict = store.managerConflicts.find((entry) => entry.id === id);
    if (!conflict) {
        return null;
    }

    conflict.status = "Resolved";
    conflict.resolution = resolution;
    conflict.lastDetectedAt = new Date().toISOString();

    const nextSequence = store.auditLogs.reduce(
        (maxSequence, entry) => Math.max(maxSequence, entry.sequence),
        0
    ) + 1;
    store.auditLogs.unshift({
        sequence: nextSequence,
        timestamp: conflict.lastDetectedAt,
        timezoneLabel: "UTC-5",
        actorName: "Lisa Manager",
        actorBadge: "LM",
        actorMeta: "172.20.8.6",
        actorKind: "user",
        action: `Resolved ${conflict.id} using Source ${resolution}`,
        hash: `0x${Math.floor(10 ** 11 + Math.random() * 9 * 10 ** 11).toString(16)}...${Math.floor(10 ** 6 + Math.random() * 9 * 10 ** 6).toString(16)}`,
        statusLabel: "Recorded",
        outcome: "recorded",
        anomaly: false,
    });
    store.auditLogs = store.auditLogs
        .slice()
        .sort((left, right) => right.sequence - left.sequence)
        .slice(0, 50);

    return clone(conflict);
}

export function listManagerReports(): ManagerReportRecord[] {
    const reports = getStore().managerReports
        .slice()
        .sort((left, right) => {
            const dateDelta = new Date(right.date).getTime() - new Date(left.date).getTime();
            return Number.isNaN(dateDelta) ? right.id - left.id : dateDelta;
        });
    return clone(reports);
}

export function createManagerReport(category: ManagerReportCategory = "compliance"): ManagerReportRecord {
    const store = getStore();
    const nextId = store.managerReports.reduce((maxId, report) => Math.max(maxId, report.id), 0) + 1;
    const generatedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    const templates: Record<ManagerReportCategory, { name: string; type: "PDF" | "CSV"; summary: string }> = {
        compliance: {
            name: `Compliance Snapshot #${nextId}`,
            type: "PDF",
            summary: "Point-in-time compliance summary for control owners and reviewers.",
        },
        policies: {
            name: `Policy Portfolio Digest #${nextId}`,
            type: "PDF",
            summary: "Updated policy distribution and renewal exposure by product line.",
        },
        searches: {
            name: `Search Analytics Export #${nextId}`,
            type: "CSV",
            summary: "Search demand, abandonment, and escalation trends over the last 30 days.",
        },
        conflicts: {
            name: `Conflict Register Export #${nextId}`,
            type: "CSV",
            summary: "Current contradiction and ambiguity register with severity metadata.",
        },
    };
    const template = templates[category];

    const report: ManagerReportRecord = {
        id: nextId,
        name: template.name,
        date: generatedDate,
        status: "Generated",
        type: template.type,
        category,
        generatedBy: "Lisa Manager",
        summary: template.summary,
    };

    store.managerReports.unshift(report);
    store.managerReports = store.managerReports.slice(0, 25);
    return clone(report);
}

export function getAuditMetrics(): AuditMetricsRecord {
    return clone(getStore().auditMetrics);
}

export function listAuditLogs(): AuditLogRecord[] {
    const logs = getStore().auditLogs
        .slice()
        .sort((left, right) => right.sequence - left.sequence);
    return clone(logs);
}
