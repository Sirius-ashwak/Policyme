"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FileText,
    ShieldCheck,
    AlertTriangle,
    Search,
    Eye
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
import { toast } from "sonner";

const kpis = [
    { title: "Total Policies", value: "247", icon: FileText, color: "text-blue-500", trend: "+12 this month" },
    { title: "Compliance Score", value: "92%", icon: ShieldCheck, color: "text-emerald-500", trend: "0% change" },
    { title: "Active Conflicts", value: "18", icon: AlertTriangle, color: "text-destructive" },
    { title: "Searches (30d)", value: "1,204", icon: Search, color: "text-primary", trend: "+15% vs last month" },
];

const conflicts = [
    { id: "CF-1042", name: "Remote Work vs Data Security", type: "Contradiction", severity: "High", docs: "HR-042, IT-112" },
    { id: "CF-1043", name: "Expense Policy Limits", type: "Ambiguity", severity: "Medium", docs: "FIN-019" },
    { id: "CF-1044", name: "Device Usage Policy", type: "Contradiction", severity: "High", docs: "IT-005, HR-099" },
    { id: "CF-1045", name: "Onboarding Timeline", type: "Ambiguity", severity: "Low", docs: "HR-002" },
];

export default function ManagerDashboard() {
    const router = useRouter();

    const openKpiTarget = (title: string) => {
        if (title === "Active Conflicts") {
            router.push("/dashboard/manager/conflicts");
            return;
        }

        if (title === "Searches (30d)") {
            router.push("/dashboard/manager/reports");
            return;
        }

        toast("KPI drill-down queued", {
            description: `${title} detail dashboard is loading in a future release.`,
        });
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
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
                            <div className="text-2xl font-bold mt-2">{kpi.value}</div>
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
                        {conflicts.map((conflict) => (
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
                                        <div className={`h-2 w-2 rounded-full ${conflict.severity === 'High' ? 'bg-destructive' : conflict.severity === 'Medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                        <span className="text-sm text-muted-foreground">{conflict.severity}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
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
                        ))}
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    );
}
