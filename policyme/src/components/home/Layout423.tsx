"use client";

import { Button } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxChevronRight } from "react-icons/rx";

const features = [
    {
        title: "Real-time conflict detection",
        category: "Spot Issues",
        description:
            "Automatically flag contradictory clauses across IT, HR, and Security documents before an audit catches them.",
    },
    {
        title: "Grounded Accuracy",
        category: "Trust & Accuracy",
        description:
            "Our proprietary knowledge graph ensures every answer is backed by verified source documents — no guesswork, no fabrication.",
    },
    {
        title: "Instant Verification",
        category: "Traceable Citations",
        description:
            "Every answer includes direct links back to the exact paragraph in your source documents.",
    },
];

export function Layout423() {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24">
            <div className="container mx-auto max-w-6xl">
                <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                        Answers
                    </p>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                        GraphRAG-powered intelligence
                    </h2>
                    <p className="text-base text-muted-foreground md:text-lg">
                        Ask questions in plain English and get answers backed by exact
                        citations from your policies.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:h-[420px]">
                    {features.map((f, idx) => (
                        <div
                            key={idx}
                            className="relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-muted transition-all duration-300 lg:w-1/3 lg:hover:w-[50%]"
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* Big number watermark */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <span className="text-[8rem] font-black leading-none text-muted-foreground/10">
                                    0{idx + 1}
                                </span>
                            </div>

                            <div className="relative z-10 mt-auto flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-background via-background/80 to-transparent h-full">
                                <p className="mb-1 text-sm font-semibold text-primary">
                                    {f.category}
                                </p>
                                <h3 className="text-xl font-bold md:text-2xl">{f.title}</h3>

                                {/* Always visible on mobile, hover-reveal on desktop */}
                                <div className="mt-3 lg:hidden">
                                    <p className="text-sm text-muted-foreground">
                                        {f.description}
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {hovered === idx && (
                                        <motion.div
                                            className="mt-3 hidden lg:block"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <p className="text-sm text-muted-foreground">
                                                {f.description}
                                            </p>
                                            <Button
                                                variant="link"
                                                size="link"
                                                iconRight={<RxChevronRight />}
                                                className="mt-3 p-0"
                                            >
                                                Learn more
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
