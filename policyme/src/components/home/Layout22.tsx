"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import Link from "next/link";
import { Database } from "lucide-react";

export function Layout22() {
    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
                    <div>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Database className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                            From scattered documents to living knowledge
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Our proprietary knowledge graph traverses AI-linked facts
                            contextually. PolicyMe takes your PDFs and Word documents and
                            builds a knowledge graph that stays current — searchable,
                            queryable, and alive.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button asChild variant="secondary">
                                <Link href="/dashboard/adjuster">
                                    Explore
                                </Link>
                            </Button>
                            <Button
                                variant="link"
                                className="px-0"
                            >
                                Learn how it works
                                <RxChevronRight />
                            </Button>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
                        <img
                            src="/images/knowledge_graph.png"
                            alt="Knowledge Graph AI Visualization"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
