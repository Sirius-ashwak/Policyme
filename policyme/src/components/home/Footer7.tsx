"use client";

import React from "react";
import Link from "next/link";

const links = [
    {
        title: "Product",
        items: [
            { label: "Features", href: "/#solution" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Integrations", href: "/support" },
            { label: "Changelog", href: "/support" },
        ],
    },
    {
        title: "Company",
        items: [
            { label: "About", href: "/support" },
            { label: "Blog", href: "/support" },
            { label: "Careers", href: "/support" },
            { label: "Contact", href: "/support" },
        ],
    },
    {
        title: "Resources",
        items: [
            { label: "Documentation", href: "/support" },
            { label: "API Reference", href: "/support" },
            { label: "Support", href: "/support" },
            { label: "Status", href: "/support" },
        ],
    },
];

export function Footer7() {
    return (
        <footer className="border-t border-border bg-card px-[5%] py-12 md:py-16">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <Link href="/" className="text-lg font-bold tracking-tight">
                            PolicyMe
                        </Link>
                        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                            AI-powered policy intelligence for enterprise compliance.
                        </p>
                    </div>
                    {links.map((col) => (
                        <div key={col.title}>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                {col.title}
                            </p>
                            <ul className="space-y-2">
                                {col.items.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
                    <p className="font-mono text-[10px] text-muted-foreground">
                        © {new Date().getFullYear()} PolicyMe. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">
                            Privacy
                        </Link>
                        <Link href="/terms" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">
                            Terms
                        </Link>
                        <Link href="/support" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">
                            Security
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
