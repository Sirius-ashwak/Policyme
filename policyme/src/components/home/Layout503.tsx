"use client";

import {
    Button,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import Link from "next/link";
import { Shield, Users, HeartPulse } from "lucide-react";

const tabs = [
    {
        value: "claims",
        icon: HeartPulse,
        label: "Claims Adjusters",
        tag: "Claims Handling",
        title: "Verify coverage instantly",
        description:
            "Upload a claim summary and immediately see which policies apply. GraphRAG AI cites exact paragraphs detailing exclusions, limits, and requirements.",
        buttonText: "Try Adjuster Search",
        href: "/dashboard/adjuster",
        image: "/images/app_interface.png",
        imageAlt: "Adjuster Interface",
    },
    {
        value: "compliance",
        icon: Shield,
        label: "Compliance Managers",
        tag: "Risk & Compliance",
        title: "Scan for contradictions automatically",
        description:
            "See conflicts flagged across departments automatically. Review citations. Resolve issues before an audit catches them.",
        buttonText: "Manager Command Center",
        href: "/dashboard/manager",
        image: "/images/hero_dashboard.png",
        imageAlt: "Compliance Dashboard",
    },
    {
        value: "hr",
        icon: Users,
        label: "HR Teams",
        tag: "Employee Experience",
        title: "Answer team questions without manual work",
        description:
            "Employees get instant answers to PTO, benefits, and expense questions. The AI references the employee handbook directly.",
        buttonText: "Coming Soon",
        href: null,
        image: "/images/knowledge_graph.png",
        imageAlt: "Employee Portal",
    },
];

export function Layout503() {
    return (
        <section className="px-[5%] py-16 md:py-20 lg:py-24 bg-muted/10">
            <div className="container mx-auto max-w-6xl">
                <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                        Access
                    </p>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Dashboards built for your role
                    </h2>
                    <p className="text-base text-muted-foreground md:text-lg">
                        Tailored views for Claims Adjusters, Compliance Managers, and IT
                        Admins with appropriate access controls.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <Link href="/dashboard/adjuster">
                            <Button title="Try Adjuster View" variant="secondary">
                                Try Adjuster View
                            </Button>
                        </Link>
                        <Link href="/dashboard/manager">
                            <Button
                                title="Manager Center"
                                variant="link"
                                size="link"
                                iconRight={<RxChevronRight />}
                            >
                                Manager Center
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="claims" className="flex flex-col items-center">
                    <TabsList className="mb-10 flex w-auto items-center gap-x-4 bg-transparent border-b border-border rounded-none pb-0 h-auto">
                        {tabs.map((t) => (
                            <TabsTrigger
                                key={t.value}
                                value={t.value}
                                className="border-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium duration-200 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground rounded-none"
                            >
                                <div className="flex items-center gap-2">
                                    <t.icon className="h-4 w-4" />
                                    <span>{t.label}</span>
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map((t) => (
                        <TabsContent
                            key={t.value}
                            value={t.value}
                            className="w-full data-[state=active]:animate-in data-[state=active]:fade-in-50 duration-300"
                        >
                            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-2">
                                <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
                                    <p className="mb-2 text-sm font-semibold text-primary">
                                        {t.tag}
                                    </p>
                                    <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
                                        {t.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        {t.description}
                                    </p>
                                    <div className="mt-6">
                                        {t.href ? (
                                            <Link href={t.href}>
                                                <Button title={t.buttonText} variant="secondary">
                                                    {t.buttonText}
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                title={t.buttonText}
                                                variant="secondary"
                                                disabled
                                            >
                                                {t.buttonText}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="relative aspect-[4/3] overflow-hidden border-t md:border-t-0 md:border-l border-border bg-muted">
                                    <img
                                        src={t.image}
                                        alt={t.imageAlt}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}
