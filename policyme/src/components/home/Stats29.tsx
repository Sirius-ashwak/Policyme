"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import Link from "next/link";
import { Building2, FileText, Database } from "lucide-react";

const stats = [
    { value: "2.5k+", label: "Policies analyzed", sub: "Across financial services, healthcare, and government" },
    { value: "1M+", label: "Nodes mapped", sub: "Connections found across enterprise knowledge bases" },
    { value: "85%", label: "Faster resolution", sub: "Time saved vs manual search on average" },
];

export function Stats29() {
    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-10 grid grid-cols-1 gap-6 md:mb-14 md:grid-cols-2 lg:gap-16">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                            Impact
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            PolicyMe powers compliance at scale
                        </h2>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-base text-muted-foreground">
                            We process millions of policy queries annually, helping legal, HR,
                            and IT teams stay compliant without the manual overhead.
                        </p>
                        <div className="mt-4">
                            <Button asChild variant="link" className="px-0">
                                <Link href="/dashboard/manager">
                                    See case studies
                                    <RxChevronRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <p className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                                {s.value}
                            </p>
                            <h3 className="text-base font-bold">{s.label}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
