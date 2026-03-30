"use client";

import { motion } from "framer-motion";
import { DownloadCloud, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
    { id: 1, name: "Q1 Compliance Audit", date: "Mar 1, 2026", status: "Generated", type: "PDF" },
    { id: 2, name: "HR vs IT Policy Conflicts", date: "Feb 15, 2026", status: "Generated", type: "CSV" },
    { id: 3, name: "Monthly Search Volume Analytics", date: "Feb 1, 2026", status: "Generated", type: "PDF" },
    { id: 4, name: "Data Security Policy Gaps", date: "Jan 20, 2026", status: "Archived", type: "PDF" },
];

export default function ReportsPage() {
    return (
        <div className="flex-1 p-6 md:p-10 max-w-5xl w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Reports & Analytics</h1>
                    <p className="text-muted-foreground text-lg">Generate and download audit-ready compliance reports.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button className="gap-2 bg-primary">
                        <FileText className="h-4 w-4" />
                        Generate New Report
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/40 text-sm font-medium text-muted-foreground">
                    <div className="col-span-6 md:col-span-5">Report Name</div>
                    <div className="col-span-3 md:col-span-3">Date</div>
                    <div className="col-span-3 md:col-span-2 text-center">Status</div>
                    <div className="hidden md:block md:col-span-2 text-right">Action</div>
                </div>

                <div className="divide-y divide-border">
                    {reports.map((report, i) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group"
                        >
                            <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {report.type}
                                </div>
                                <span className="font-medium truncate">{report.name}</span>
                            </div>
                            <div className="col-span-3 md:col-span-3 text-sm text-muted-foreground">
                                {report.date}
                            </div>
                            <div className="col-span-3 md:col-span-2 text-center">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${report.status === 'Generated' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                            <div className="hidden md:flex md:col-span-2 justify-end">
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity gap-2 h-8">
                                    <DownloadCloud className="h-4 w-4" /> Download
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
