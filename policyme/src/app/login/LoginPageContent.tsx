"use client";

import { signIn } from "next-auth/react";
import { Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function LoginPageContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/adjuster";
    const error = searchParams.get("error");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 font-sans">
            <div className="absolute top-0 right-0 p-8 w-full flex justify-center opacity-20 pointer-events-none">
                <div className="w-96 h-96 bg-primary/30 blur-[120px] rounded-full"></div>
                <div className="w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full translate-x-12"></div>
            </div>

            <div className="relative z-10 w-full max-w-[420px] space-y-8 rounded-[24px] bg-background/80 backdrop-blur-xl p-8 shadow-2xl border border-border/50">
                <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="rounded-2xl bg-primary/10 p-4 mb-2 shadow-sm ring-1 ring-primary/20">
                        <Shield className="h-10 w-10 text-primary" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to PolicyMe</h1>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                        Access your enterprise AI claims assistant
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive text-center font-medium border border-destructive/20">
                        {error === "AccessDenied" 
                            ? "You do not have permission to access your organization's environment."
                            : "Authentication failed. Please check your configuration and try again."}
                    </div>
                )}

                <div className="grid gap-4 mt-8">
                    <Button 
                        variant="outline" 
                        size="lg"
                        className="h-14 w-full font-semibold relative flex items-center justify-center overflow-hidden group hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border-slate-200 dark:border-slate-800"
                        onClick={() => signIn("azure-ad", { callbackUrl })}
                    >
                        <div className="absolute inset-0 w-1 bg-blue-500 left-0"></div>
                        <img 
                            src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.png" 
                            alt="Microsoft" 
                            className="mr-3 h-5 w-5 object-contain" 
                        />
                        Continue with Microsoft SSO
                    </Button>

                    <Button 
                        variant="outline" 
                        size="lg"
                        className="h-14 w-full font-semibold relative flex items-center justify-center overflow-hidden group hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border-slate-200 dark:border-slate-800"
                        onClick={() => signIn("okta", { callbackUrl })}
                    >
                        <div className="absolute inset-0 w-1 bg-blue-600 left-0"></div>
                        <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#002b50]">
                            <span className="text-[12px] font-bold text-white leading-none">O</span>
                        </div>
                        Continue with Okta SSO
                    </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground/80 mt-6 pt-6 border-t border-border">
                    Secured by OpenID Connect • Enterprise Single Sign-On
                </div>
            </div>
        </div>
    );
}