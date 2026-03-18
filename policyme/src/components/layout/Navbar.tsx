"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, Github, LogIn, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-bold sm:inline-block">
                            PolicyMe
                        </span>
                    </Link>
                    {/* Render different links depending on Role based access control via NextAuth */}
                    {mounted && (
                        <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
                            {(!session || session.user?.role === "Adjuster" || session.user?.role === "Manager" || session.user?.role === "Admin") && (
                                <Link href="/dashboard/adjuster" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                    Adjuster
                                </Link>
                            )}
                            {(session?.user?.role === "Manager" || session?.user?.role === "Admin") && (
                                <Link href="/dashboard/manager" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                    Manager
                                </Link>
                            )}
                            {(session?.user?.role === "Admin") && (
                                <Link href="/dashboard/admin" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                    Admin
                                </Link>
                            )}
                        </nav>
                    )}
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="flex items-center gap-2">
                        {!mounted || status === "loading" ? (
                            <div className="h-8 w-20 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{session.user?.role} Role</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => signOut()}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button variant="default" size="sm" onClick={() => signIn()}>
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign In (SSO)
                            </Button>
                        )}
                    </div>
                    <nav className="flex items-center">
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
