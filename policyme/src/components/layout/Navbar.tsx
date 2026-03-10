import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield } from "lucide-react";

export function Navbar() {
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
                    <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
                        <Link
                            href="/dashboard/adjuster"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Adjuster
                        </Link>
                        <Link
                            href="/dashboard/manager"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Manager
                        </Link>
                        <Link
                            href="/dashboard/admin"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Admin
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <nav className="flex items-center">
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
