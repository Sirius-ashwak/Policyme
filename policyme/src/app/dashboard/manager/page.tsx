"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FileText,
    ShieldCheck,
    AlertTriangle,
    Search,
    Eye,
    type LucideIcon,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MacroGraph from "@/components/GraphVisualization";
import type { ManagerConflictRecord, ManagerOverviewRecord } from "@/lib/demo-store";

type ManagerOverviewResponse = {
    overview?: (ManagerOverviewRecord & { activeConflicts: number });
    conflicts?: ManagerConflictRecord[];
    error?: string;
};

type KpiCard = {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    trend?: string;
};

export default function ManagerDashboard() {
    const router = useRouter();
    const [overview, setOverview] = useState<(ManagerOverviewRecord & { activeConflicts: number }) | null>(null);
    const [conflicts, setConflicts] = useState<ManagerConflictRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadOverview = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/manager/overview", { cache: "no-store" });
                const payload = (await response.json()) as ManagerOverviewResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load manager overview.");
                }

                if (isMounted) {
                    setOverview(payload.overview || null);
                    setConflicts(payload.conflicts || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load manager overview.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadOverview();

        return () => {
            isMounted = false;
        };
    }, []);

    const kpis: KpiCard[] = [
        {
            title: "Total Policies",
            value: overview ? String(overview.totalPolicies) : "--",
            icon: FileText,
            color: "text-blue-500",
            trend: "+12 this month",
        },
        {
            title: "Compliance Score",
            value: overview ? `${overview.complianceScore}%` : "--",
            icon: ShieldCheck,
            color: "text-emerald-500",
            trend: "0% change",
        },
        {
            title: "Active Conflicts",
            value: overview ? String(overview.activeConflicts) : "--",
            icon: AlertTriangle,
            color: "text-destructive",
        },
        {
            title: "Searches (30d)",
            value: overview ? overview.searches30d.toLocaleString() : "--",
            icon: Search,
            color: "text-primary",
            trend: "+15% vs last month",
        },
    ];

    const openKpiTarget = (title: string) => {
        const destinations: Record<string, string> = {
            "Total Policies": "/dashboard/manager/reports?focus=policies",
            "Compliance Score": "/dashboard/manager/reports?focus=compliance",
            "Active Conflicts": "/dashboard/manager/conflicts",
            "Searches (30d)": "/dashboard/manager/reports?focus=searches",
        };

        router.push(destinations[title] || "/dashboard/manager/reports");
    };

    const openConflict = (conflictId: string) => {
        router.push(`/dashboard/manager/conflicts?focus=${encodeURIComponent(conflictId)}`);
    };

    return (
        <div className="flex-1 p-6 md:p-10 w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Command Center</h1>
                <p className="text-muted-foreground text-lg">Monitor policy intelligence and resolve conflicts.</p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => openKpiTarget(kpi.title)}
                        className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <kpi.icon className={`h-16 w-16 ${kpi.color}`} />
                        </div>
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">{kpi.title}</h3>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold mt-2">{isLoading ? "..." : kpi.value}</div>
                            {kpi.trend && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {kpi.trend}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full h-[600px] mb-8"
            >
                <MacroGraph />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-border bg-muted/30">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Active Conflicts
                    </h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Policy Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Affected Docs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-sm text-muted-foreground">
                                    Loading conflict data...
                                </TableCell>
                            </TableRow>
                        ) : conflicts.length > 0 ? (
                            conflicts.map((conflict) => (
                                <TableRow key={conflict.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-mono text-xs text-muted-foreground">{conflict.id}</TableCell>
                                    <TableCell className="font-medium">{conflict.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={conflict.type === "Contradiction" ? "destructive" : "secondary"} className="bg-opacity-20">
                                            {conflict.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${
                                                conflict.severity === "High"
                                                    ? "bg-destructive"
                                                    : conflict.severity === "Medium"
                                                        ? "bg-amber-500"
                                                        : "bg-green-500"
                                            }`} />
                                            <span className="text-sm text-muted-foreground">{conflict.severity}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">
                                        {conflict.docs}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => openConflict(conflict.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-sm text-muted-foreground">
                                    No active conflicts detected.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    );
}
