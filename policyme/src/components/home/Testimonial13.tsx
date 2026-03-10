"use client";

import React from "react";
import { BiSolidStar } from "react-icons/bi";

export function Testimonial13() {
    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
                    <div className="order-last md:order-first">
                        <div className="aspect-square w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                            <img
                                src="/images/knowledge_graph.png"
                                alt="Customer testimonial"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-4 flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <BiSolidStar key={i} className="h-5 w-5" />
                            ))}
                        </div>
                        <blockquote className="text-xl font-bold leading-snug tracking-tight md:text-2xl">
                            &ldquo;PolicyMe cut our policy review time in half. We spot
                            conflicts now instead of discovering them during audits. The
                            knowledge graph approach completely eliminates hallucination
                            issues.&rdquo;
                        </blockquote>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                SC
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Sarah Chen</p>
                                <p className="text-xs text-muted-foreground">
                                    Compliance Manager, Regional Bank
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
