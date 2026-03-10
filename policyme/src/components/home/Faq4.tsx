"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        q: "How does GraphRAG work?",
        a: "GraphRAG combines knowledge graphs with retrieval-augmented generation. Instead of just matching keywords, it traverses relationships between policy entities — clauses, definitions, exclusions — to provide contextually accurate answers with direct citations.",
    },
    {
        q: "Is our data secure?",
        a: "Absolutely. All data is encrypted at rest and in transit. We support on-premise deployment, SOC 2 Type II compliance, and role-based access controls. Your policies never leave your infrastructure.",
    },
    {
        q: "How does conflict detection work?",
        a: "Our AI continuously scans for contradictions across all ingested documents. When it finds clauses that conflict — for example, different liability limits in two policies covering the same risk — it flags them with exact citations from both sources.",
    },
    {
        q: "What file formats do you support?",
        a: "We support PDF, DOCX, XLSX, and plain text. Our ingestion engine extracts structured data from tables, headers, and nested sections, preserving the document hierarchy in the knowledge graph.",
    },
    {
        q: "Can I integrate PolicyMe with existing tools?",
        a: "Yes. We offer REST APIs, webhooks, and pre-built integrations with popular compliance platforms. Enterprise customers get access to custom integration support.",
    },
];

export function Faq4() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-10 text-center md:mb-14">
                    <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
                        ● FAQ
                    </p>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Frequently asked questions
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Everything you need to know about PolicyMe.
                    </p>
                </div>

                <div className="space-y-0 divide-y divide-border border-t border-border">
                    {faqs.map((faq, i) => (
                        <div key={i}>
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary"
                            >
                                <span className="text-sm font-semibold pr-4">{faq.q}</span>
                                <ChevronDown
                                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-60 pb-5" : "max-h-0"
                                    }`}
                            >
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
