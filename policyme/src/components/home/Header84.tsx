"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import Link from "next/link";

export function Header84() {
    return (
        <section className="relative px-[5%] py-16 md:py-24 lg:py-32 overflow-hidden min-h-[85vh] flex items-center">
            {/* Content */}
            <div className="container relative z-10 mx-auto max-w-6xl">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div>
                        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-primary">
                            ● Policy Intelligence
                        </p>
                        <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Policy intelligence built for enterprises
                        </h1>
                        <p className="max-w-lg text-base text-muted-foreground leading-relaxed md:text-lg">
                            PolicyMe transforms scattered policy documents into a searchable
                            knowledge graph powered by AI. Get instant answers, spot
                            conflicts, and maintain compliance across your entire organization.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link href="/dashboard/adjuster">
                                <Button title="Get Started" variant="primary">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/dashboard/manager">
                                <Button title="Contact Sales" variant="secondary">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side: floating status card */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="rounded-sm border border-border bg-card/80 backdrop-blur-sm p-6 shadow-lg max-w-sm w-full">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                                GraphRAG Engine
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="font-mono text-xs text-foreground">
                                        2,547 policies analyzed
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="font-mono text-xs text-foreground">
                                        1.2M knowledge nodes mapped
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
                                    <span className="font-mono text-xs text-foreground">
                                        23 conflicts detected today
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="font-mono text-xs text-foreground">
                                        99.2% citation accuracy
                                    </span>
                                </div>
                            </div>
                            <div className="mt-5 border-t border-border pt-4">
                                <p className="font-mono text-[10px] text-muted-foreground">
                                    STATUS: <span className="text-emerald-500">ALL SYSTEMS OPERATIONAL</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
