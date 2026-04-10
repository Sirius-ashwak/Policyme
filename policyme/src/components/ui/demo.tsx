import Link from "next/link";
import AuroraHero from "@/components/ui/digital-aurora";
import { Logo } from "@/components/ui/Logo";

const navItems = [
    { label: "Solution", href: "#solution" },
    { label: "Technology", href: "#technology" },
    { label: "Roles", href: "#roles" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
];

export default function DemoOne() {
    return (
        <main className="bg-[#05070a] text-white">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                            <Logo className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold tracking-wide text-white/95 sm:text-base">PolicyMe</span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm font-light tracking-tight text-white/75 transition-colors hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href="/support"
                            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-light text-white/90 transition-colors hover:bg-white/10"
                        >
                            Support
                        </a>
                    </nav>

                    <Link
                        href="/portal"
                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white transition-colors hover:bg-white/20 sm:text-sm"
                    >
                        Open Portal
                    </Link>
                </div>
            </header>

            <AuroraHero
                title="Policy intelligence built for real insurance decisions."
                description="PolicyMe combines document ingestion, GraphRAG retrieval, and role-based operations so teams can resolve claims and underwriting work with citation-backed confidence."
                badgeText="Graph-powered insurance platform"
                badgeLabel="PolicyMe"
                ctaButtons={[
                    { text: "Open Customer Portal", href: "/portal", primary: true },
                    { text: "View Role Dashboards", href: "#roles" },
                ]}
                microDetails={[
                    "Claims and policy workflows in one place",
                    "Explainable AI answers with source grounding",
                    "Customer, adjuster, underwriter, manager, and admin views",
                ]}
            />

            <section id="solution" className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-cyan-300/80">Solution</p>
                <h2 className="max-w-3xl text-3xl font-light leading-tight text-white sm:text-4xl">
                    One operating layer for policy understanding, claims handling, and underwriting support.
                </h2>
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-medium text-white">Ingestion Pipeline</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                            Upload policy and claim files through a structured path connected to Java ingestion services and event streams.
                        </p>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-medium text-white">GraphRAG Answers</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                            Ask policy questions and receive grounded responses powered by graph retrieval instead of unsupported model guesses.
                        </p>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-medium text-white">Role Dashboards</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                            Enable focused workflows across customer, adjuster, underwriter, manager, and admin teams from one frontend.
                        </p>
                    </article>
                </div>
            </section>

            <section id="technology" className="border-y border-white/10 bg-black/30 py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-cyan-300/80">Technology</p>
                        <h2 className="text-3xl font-light leading-tight text-white sm:text-4xl">
                            Multi-service architecture, unified experience.
                        </h2>
                    </div>
                    <ul className="space-y-4 text-sm text-white/75">
                        <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Next.js web app for role-based experiences and orchestration APIs.</li>
                        <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Spring Boot ingestion service for extraction and Kafka publishing.</li>
                        <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">FastAPI GraphRAG engine with Neo4j-backed semantic retrieval.</li>
                    </ul>
                </div>
            </section>

            <section id="roles" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-cyan-300/80">Roles</p>
                <h2 className="text-3xl font-light leading-tight text-white sm:text-4xl">Purpose-built views for every insurance team.</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        "Customer Portal",
                        "Adjuster Workspace",
                        "Underwriter Workspace",
                        "Manager Oversight",
                        "Admin Console",
                    ].map((role) => (
                        <div key={role} className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80">
                            {role}
                        </div>
                    ))}
                </div>
            </section>

            <section id="integrations" className="border-y border-white/10 bg-black/30 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.24em] text-cyan-300/80">Integrations</p>
                    <h2 className="text-3xl font-light leading-tight text-white sm:text-4xl">Connect your data flow end-to-end.</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">
                        PolicyMe supports document upload and processing, graph-backed AI retrieval, and admin user management with Supabase-ready APIs.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/75">
                        {["Kafka", "Neo4j", "Supabase", "OAuth", "REST APIs"].map((item) => (
                            <span key={item} className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 sm:p-10">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Pricing</p>
                    <h2 className="mt-3 text-3xl font-light text-white sm:text-4xl">Deploy PolicyMe with your workflow and scale.</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">
                        Start with a guided pilot, then expand across claims, underwriting, and operations with enterprise support.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/portal"
                            className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
                        >
                            Start a Pilot
                        </Link>
                        <a
                            href="/support"
                            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
                        >
                            Talk to Support
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
