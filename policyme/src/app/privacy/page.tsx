import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[var(--insurai-surface)] text-[var(--insurai-on-surface)] px-6 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Legal</p>
                    <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                        This policy explains how PolicyMe handles user and claims data for platform operations.
                    </p>
                </div>

                <section className="space-y-4 text-sm leading-relaxed text-[var(--insurai-on-surface-variant)]">
                    <p>
                        We process personal and policy data only for authentication, claims workflow, underwriting support, and service reliability.
                    </p>
                    <p>
                        Access to sensitive information is role-restricted, and system actions are recorded for audit and operational monitoring.
                    </p>
                    <p>
                        For data deletion or access requests, contact the support team through the in-app support page.
                    </p>
                </section>

                <div className="pt-4">
                    <Link href="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
