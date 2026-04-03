"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function Pricing6() {
    const [annual, setAnnual] = useState(false);

    const plans = [
        {
            name: "Starter",
            monthly: 299,
            yearly: 249,
            description: "For small teams getting started with policy intelligence.",
            features: [
                "Up to 500 policies",
                "5 user seats",
                "Basic conflict detection",
                "Email support",
                "Standard knowledge graph",
            ],
            cta: "Start Free Trial",
            href: "/dashboard/adjuster",
            highlighted: false,
        },
        {
            name: "Enterprise",
            monthly: 899,
            yearly: 749,
            description: "For organizations that need full-scale compliance automation.",
            features: [
                "Unlimited policies",
                "Unlimited users",
                "Advanced conflict detection",
                "Priority support & SLA",
                "Custom integrations",
                "SOC 2 compliance",
                "Dedicated success manager",
            ],
            cta: "Contact Sales",
            href: "/dashboard/manager",
            highlighted: true,
        },
    ];

    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24">
            <div className="container mx-auto max-w-5xl">
                <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
                    <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
                        ● Pricing
                    </p>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Start free. Scale when you&apos;re ready.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-3 rounded-sm border border-border bg-muted/50 p-1">
                        <button
                            onClick={() => setAnnual(false)}
                            className={`rounded-sm px-4 py-2 font-mono text-xs transition-colors ${!annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setAnnual(true)}
                            className={`rounded-sm px-4 py-2 font-mono text-xs transition-colors ${annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                        >
                            Yearly
                            <span className="ml-1 text-emerald-500">-17%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col rounded-sm border p-8 transition-shadow ${plan.highlighted
                                    ? "border-primary bg-card shadow-lg"
                                    : "border-border bg-card shadow-sm"
                                }`}
                        >
                            {plan.highlighted && (
                                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary">
                                    Most Popular
                                </p>
                            )}
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">
                                    ${annual ? plan.yearly : plan.monthly}
                                </span>
                                <span className="text-sm text-muted-foreground">/mo</span>
                            </div>
                            <div className="mt-8 flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Button
                                    asChild
                                    variant={plan.highlighted ? "default" : "secondary"}
                                    className="w-full justify-center"
                                >
                                    <Link href={plan.href}>{plan.cta}</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
