"use client";

import { Activity } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const logs = [
    { id: "LOG-9921", user: "sarah.j@policyme-demo.com", action: "Queried Policy Graph", resource: "N/A", time: "2 mins ago", status: "Success" },
    { id: "LOG-9920", user: "admin@policyme-demo.com", action: "Uploaded Document", resource: "HR_Policy_2026.pdf", time: "1 hour ago", status: "Success" },
    { id: "LOG-9919", user: "michael.c@policyme-demo.com", action: "Failed Login Attempt", resource: "System", time: "3 hours ago", status: "Failed" },
    { id: "LOG-9918", user: "manager1@policyme-demo.com", action: "Exported Report", resource: "Q1_Conflicts.pdf", time: "1 day ago", status: "Success" },
    { id: "LOG-9917", user: "system_cron", action: "Graph Integrity Check", resource: "Neo4j Cluster", time: "1 day ago", status: "Success" },
];

export default function AuditLogsPage() {
    return (
        <div className="flex-1 p-6 md:p-10 w-full space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">System Audit Logs</h1>
                    <p className="text-muted-foreground text-lg">Immutable event logging for SOC 2 and HIPAA compliance.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                    <Activity className="h-4 w-4" />
                    System Healthy
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-[100px] font-medium">Log ID</TableHead>
                            <TableHead className="font-medium">User / Actor</TableHead>
                            <TableHead className="font-medium">Action Performed</TableHead>
                            <TableHead className="font-medium">Target Resource</TableHead>
                            <TableHead className="font-medium">Timestamp</TableHead>
                            <TableHead className="font-medium text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-muted/20">
                                <TableCell className="font-mono text-xs text-muted-foreground">{log.id}</TableCell>
                                <TableCell className="text-sm font-medium">{log.user}</TableCell>
                                <TableCell className="text-sm">{log.action}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{log.resource}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{log.time}</TableCell>
                                <TableCell className="text-right">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${log.status === 'Success'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {log.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
