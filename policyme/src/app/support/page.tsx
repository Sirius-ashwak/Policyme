import Link from "next/link";

const supportTopics = [
    {
        title: "Account and Access",
        description: "Sign-in, role access, and session troubleshooting.",
    },
    {
        title: "Document Ingestion",
        description: "PDF upload parsing failures, OCR quality, and queue status.",
    },
    {
        title: "AI Responses",
        description: "GraphRAG connectivity, confidence score interpretation, and citation accuracy.",
    },
];

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-[var(--insurai-surface)] text-[var(--insurai-on-surface)] px-6 py-16">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Support</p>
                    <h1 className="text-4xl font-extrabold tracking-tight">Help Center</h1>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)] max-w-2xl">
                        Use this page for product navigation help, troubleshooting, and AI workflow support.
                    </p>
                </div>

                <section id="faq" className="grid gap-4 md:grid-cols-3">
                    {supportTopics.map((topic) => (
                        <article key={topic.title} className="rounded-2xl border border-[var(--insurai-outline-variant)]/20 bg-[var(--insurai-surface-container-lowest)] p-5">
                            <h2 className="text-sm font-bold mb-2">{topic.title}</h2>
                            <p className="text-sm text-[var(--insurai-on-surface-variant)]">{topic.description}</p>
                        </article>
                    ))}
                </section>

                <section className="rounded-2xl border border-[var(--insurai-outline-variant)]/20 bg-[var(--insurai-surface-container-lowest)] p-6">
                    <h2 className="text-lg font-bold mb-2">Contact</h2>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)] mb-3">
                        Email support: support@policyme.ai
                    </p>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                        For infrastructure incidents, include timestamp, route, and any visible error message.
                    </p>
                </section>

                <div className="flex gap-4">
                    <Link href="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                        Home
                    </Link>
                    <Link href="/login" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
