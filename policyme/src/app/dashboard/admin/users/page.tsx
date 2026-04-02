"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdminUserRecord } from "@/lib/demo-store";

type UsersResponse = {
    users?: AdminUserRecord[];
    source?: string;
    warning?: string;
    error?: string;
};

const PAGE_SIZE = 8;

function initialsFromName(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return "No recent activity";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function statusClasses(status: string): string {
    if (status === "Active") {
        return "bg-emerald-50 text-emerald-700";
    }
    if (status === "Pending MFA") {
        return "bg-amber-50 text-amber-700";
    }
    if (status === "Suspended") {
        return "bg-red-50 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
}

export default function UserRoleManagementPage() {
    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/admin/users?limit=200", { cache: "no-store" });
            const payload = (await response.json()) as UsersResponse;

            if (!response.ok) {
                throw new Error(payload.error || "Unable to load user records.");
            }

            setUsers(payload.users || []);
            setSource(payload.source || null);
            setWarning(payload.warning || null);
            setError(null);
        } catch (loadError: unknown) {
            setError(loadError instanceof Error ? loadError.message : "Unable to load user records.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, roleFilter, statusFilter]);

    const availableRoles = ["All Roles", ...Array.from(new Set(users.map((user) => user.role)))];
    const availableStatuses = ["All Statuses", ...Array.from(new Set(users.map((user) => user.status)))];
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            normalizedSearch.length === 0 ||
            user.name.toLowerCase().includes(normalizedSearch) ||
            user.email.toLowerCase().includes(normalizedSearch) ||
            user.department.toLowerCase().includes(normalizedSearch);
        const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
        const matchesStatus = statusFilter === "All Statuses" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pagedUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const activeCount = users.filter((user) => user.status === "Active").length;
    const pendingMfaCount = users.filter((user) => user.status === "Pending MFA").length;
    const suspendedCount = users.filter((user) => user.status === "Suspended").length;

    const exportCsv = () => {
        if (users.length === 0) {
            toast.error("No users available to export.");
            return;
        }

        const header = ["id", "name", "email", "role", "department", "status", "lastActivityAt"];
        const rows = users.map((user) => [
            user.id,
            user.name,
            user.email,
            user.role,
            user.department,
            user.status,
            user.lastActivityAt || "",
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, "\"\"")}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `user_roles_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("User export downloaded.");
    };

    const copyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            toast.success(`Copied ${email}`);
        } catch {
            toast.error("Unable to copy email to clipboard.");
        }
    };

    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">
                        User & Role Management
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] max-w-2xl leading-relaxed">
                        Review platform access, filter by role or status, and export the current directory without relying on hardcoded demo rows.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => void loadUsers()}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container-low)] transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        Refresh
                    </button>
                    <button
                        onClick={exportCsv}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--insurai-primary-container)] transition-all flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20"
                    >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            {warning && (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                    {warning}
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Directory Users", value: users.length, tone: "text-[var(--primary)]" },
                    { label: "Active", value: activeCount, tone: "text-emerald-600" },
                    { label: "Pending MFA", value: pendingMfaCount, tone: "text-amber-600" },
                    { label: "Suspended", value: suspendedCount, tone: "text-red-600" },
                ].map((item) => (
                    <div key={item.label} className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">
                            {item.label}
                        </p>
                        <p className={`mt-3 text-3xl font-black ${item.tone}`}>{item.value}</p>
                        {item.label === "Directory Users" && source && (
                            <p className="mt-2 text-[11px] uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">
                                Source: {source}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10">
                <div className="p-6 border-b border-[var(--insurai-surface-container-high)] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-lg font-bold">Platform Personnel</h3>
                        <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                            Search, filter, and export the current user directory.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search name, email, or department"
                            className="min-w-[260px] rounded-xl border border-[var(--insurai-outline-variant)]/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                        />
                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="rounded-xl border border-[var(--insurai-outline-variant)]/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                        >
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="rounded-xl border border-[var(--insurai-outline-variant)]/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                        >
                            {availableStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--insurai-surface-container-low)]/50 border-b border-[var(--insurai-outline-variant)]/10">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">User Identity</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Department</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Last Activity</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--insurai-surface-container-high)]/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-sm text-[var(--insurai-on-surface-variant)]">
                                        Loading user directory...
                                    </td>
                                </tr>
                            ) : pagedUsers.length > 0 ? (
                                pagedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-[var(--insurai-primary-fixed)] flex items-center justify-center font-bold text-[var(--primary)] text-sm shadow-inner">
                                                    {initialsFromName(user.name)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">{user.name}</p>
                                                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--insurai-surface-container-highest)] text-[var(--insurai-on-surface-variant)] border border-[var(--insurai-outline-variant)]/20">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--insurai-on-surface-variant)]">{user.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusClasses(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--insurai-on-surface-variant)]">{formatDateTime(user.lastActivityAt)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => void copyEmail(user.email)}
                                                className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 transition-colors"
                                            >
                                                Copy Email
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-sm text-[var(--insurai-on-surface-variant)]">
                                        No users matched the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-[var(--insurai-surface-container-high)] bg-[var(--insurai-surface-container-lowest)]">
                    <p className="text-xs font-medium text-[var(--insurai-on-surface-variant)]">
                        Showing <span className="font-bold text-[var(--insurai-on-surface)]">{pagedUsers.length}</span> of{" "}
                        <span className="font-bold text-[var(--insurai-on-surface)]">{filteredUsers.length}</span> filtered users
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                            disabled={safePage === 1}
                            className="px-3 py-1.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-xs font-bold disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-bold text-[var(--insurai-on-surface-variant)]">
                            Page {safePage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                            disabled={safePage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-xs font-bold disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
