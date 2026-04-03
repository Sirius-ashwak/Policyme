"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export function Cta25() {
    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24">
            <div className="container mx-auto max-w-6xl">
                <div className="rounded-sm bg-foreground p-10 md:p-16 text-background">
                    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                        <div>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-background/50">
                                ● Get Started
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                                Ready to see PolicyMe in action?
                            </h2>
                            <p className="mt-3 text-base text-background/70">
                                Book a demo with our team or explore the platform yourself.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 md:justify-end">
                            <Button asChild variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                                <Link href="/dashboard/adjuster">
                                    Start Building →
                                </Link>
                            </Button>
                            <Button asChild variant="link" className="text-background/80 hover:text-background">
                                <Link href="/dashboard/manager">
                                    Contact Sales
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
