"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/** Inline SVG icons to avoid external dependencies */
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.03 0 0 4.03 0 9c0 3.978 2.579 7.35 6.154 8.543.45.082.616-.195.616-.432 0-.215-.008-.783-.012-1.537-2.504.544-3.032-1.206-3.032-1.206-.41-1.04-1-1.316-1-1.316-.816-.558.062-.546.062-.546.903.063 1.378.927 1.378.927.803 1.376 2.106.978 2.62.748.081-.582.314-.978.571-1.203-1.999-.227-4.1-1-4.1-4.448 0-.983.35-1.787.927-2.416-.093-.228-.402-1.143.088-2.382 0 0 .756-.242 2.475.922A8.638 8.638 0 0 1 9 4.353a8.65 8.65 0 0 1 2.253.303c1.718-1.164 2.473-.922 2.473-.922.491 1.24.182 2.154.089 2.382.578.629.926 1.433.926 2.416 0 3.457-2.104 4.218-4.11 4.44.324.278.611.827.611 1.666 0 1.203-.011 2.174-.011 2.47 0 .24.163.519.62.431C15.424 16.347 18 12.975 18 9c0-4.97-4.03-9-9-9Z" />
        </svg>
    );
}

function MicrosoftIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
            <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
        </svg>
    );
}

const DEMO_ROLES = [
    { role: "Customer",    color: "bg-emerald-500", redirect: "/portal",                   label: "Customer" },
    { role: "Adjuster",    color: "bg-blue-500",    redirect: "/dashboard/adjuster",        label: "Adjuster" },
    { role: "Underwriter", color: "bg-violet-500",  redirect: "/dashboard/underwriter/metrics", label: "Underwriter" },
    { role: "Manager",     color: "bg-amber-500",   redirect: "/dashboard/manager",         label: "Manager" },
    { role: "Admin",       color: "bg-rose-500",    redirect: "/dashboard/admin",           label: "Admin" },
];

export default function LoginPageContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/portal";
    const error = searchParams.get("error");
    const [demoOpen, setDemoOpen] = useState(false);
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    const handleOAuthSignIn = (provider: string) => {
        setLoadingProvider(provider);
        signIn(provider, { callbackUrl });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] p-4 font-[system-ui,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/8 dark:bg-blue-500/5 rounded-full blur-[128px]" />
            </div>

            <div
                className="relative z-10 w-full max-w-[400px] animate-fade-in"
                style={{ animationDuration: "600ms" }}
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-5">
                        <Logo className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] font-[Manrope]">
                        Welcome back
                    </h1>
                    <p className="text-[15px] text-[#86868b] mt-1.5">
                        Sign in to your InsurAI account
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-2xl border border-black/[0.04] dark:border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-6">

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 px-4 py-3 text-[13px] text-red-600 dark:text-red-400 text-center font-medium">
                            {error === "AccessDenied"
                                ? "You don't have permission to access that resource."
                                : "Something went wrong. Please try again."}
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleOAuthSignIn("google")}
                            disabled={loadingProvider !== null}
                            className="w-full flex items-center justify-center gap-3 h-[48px] rounded-xl bg-white dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] text-[15px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3c] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loadingProvider === "google" ? (
                                <div className="w-4 h-4 border-2 border-[#86868b] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GoogleIcon />
                            )}
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleOAuthSignIn("github")}
                            disabled={loadingProvider !== null}
                            className="w-full flex items-center justify-center gap-3 h-[48px] rounded-xl bg-[#1d1d1f] dark:bg-white text-[15px] font-medium text-white dark:text-[#1d1d1f] hover:bg-[#333] dark:hover:bg-[#e8e8e8] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loadingProvider === "github" ? (
                                <div className="w-4 h-4 border-2 border-white/60 dark:border-[#1d1d1f]/60 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GitHubIcon />
                            )}
                            Continue with GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.08]" />
                        <span className="text-[12px] text-[#86868b] font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.08]" />
                    </div>

                    {/* Enterprise SSO */}
                    <button
                        onClick={() => handleOAuthSignIn("azure-ad")}
                        disabled={loadingProvider !== null}
                        className="w-full flex items-center justify-center gap-3 h-[48px] rounded-xl bg-white dark:bg-[#2c2c2e] border border-black/[0.08] dark:border-white/[0.1] text-[15px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3c] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loadingProvider === "azure-ad" ? (
                            <div className="w-4 h-4 border-2 border-[#86868b] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <MicrosoftIcon />
                        )}
                        Continue with Enterprise SSO
                    </button>

                    {/* Demo Mode */}
                    {DEMO_MODE && (
                        <div className="mt-5">
                            <button
                                onClick={() => setDemoOpen(!demoOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-[13px] font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">science</span>
                                    Demo Mode
                                </span>
                                <span
                                    className="material-symbols-outlined text-sm transition-transform duration-200"
                                    style={{ transform: demoOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                >
                                    expand_more
                                </span>
                            </button>

                            <div
                                className="overflow-hidden transition-all duration-300 ease-out"
                                style={{
                                    maxHeight: demoOpen ? "280px" : "0px",
                                    opacity: demoOpen ? 1 : 0,
                                }}
                            >
                                <div className="pt-3 grid grid-cols-2 gap-2">
                                    {DEMO_ROLES.map((demo) => (
                                        <button
                                            key={demo.role}
                                            onClick={() => signIn("credentials", { role: demo.role, callbackUrl: demo.redirect })}
                                            className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f5] dark:hover:bg-[#3a3a3c] active:scale-[0.97] transition-all duration-150"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${demo.color}`} />
                                            {demo.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-[13px] text-[#86868b] mt-6">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="text-[#0066CC] dark:text-[#2997ff] font-medium hover:underline">
                        Sign up
                    </a>
                </p>

                {/* Legal */}
                <p className="text-center text-[11px] text-[#86868b]/60 mt-4 leading-relaxed">
                    Protected by enterprise-grade encryption.
                    <br />
                    <a href="#" className="hover:text-[#86868b] transition-colors">Terms</a>
                    {" · "}
                    <a href="#" className="hover:text-[#86868b] transition-colors">Privacy</a>
                </p>
            </div>
        </div>
    );
}