import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[var(--insurai-surface)] text-[var(--insurai-on-surface)] px-6 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Legal</p>
                    <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                        These terms govern use of PolicyMe and InsurAI services. They are provided for demo and integration testing.
                    </p>
                </div>

                <section className="space-y-4 text-sm leading-relaxed text-[var(--insurai-on-surface-variant)]">
                    <p>
                        By accessing this application, you agree to use it in compliance with all applicable laws and insurance data handling obligations.
                    </p>
                    <p>
                        Users are responsible for maintaining confidentiality of account credentials and ensuring submitted claim information is accurate.
                    </p>
                    <p>
                        PolicyMe may update service functionality, integrations, and AI behavior as the platform evolves.
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
