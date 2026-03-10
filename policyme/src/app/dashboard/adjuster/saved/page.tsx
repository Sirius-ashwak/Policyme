"use client";

import { motion } from "framer-motion";
import { Search, Trash2, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const savedQueries = [
    { id: 1, query: "What is the remote work policy?", tags: ["HR", "Remote Work"], date: "2 days ago" },
    { id: 2, query: "Are we allowed to use personal laptops for work?", tags: ["IT", "Security"], date: "1 week ago" },
    { id: 3, query: "Maternity leave entitlement", tags: ["HR", "Benefits"], date: "2 weeks ago" },
];

export default function SavedQueriesPage() {
    return (
        <div className="flex-1 p-6 md:p-10 max-w-5xl w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Queries</h1>
                <p className="text-muted-foreground text-lg">Your bookmarked policy answers for quick reference.</p>
            </div>

            <div className="space-y-4">
                {savedQueries.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all group"
                    >
                        <div className="flex-1">
                            <div className="flex items-start gap-3">
                                <Search className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-medium cursor-pointer group-hover:text-primary transition-colors">
                                        {item.query}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" /> {item.date}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-3.5 w-3.5" />
                                            {item.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/50">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center sm:justify-end">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                ))}

                {savedQueries.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                        <Search className="mx-auto h-10 w-10 text-muted-foreground/30 mb-4" />
                        <p>You haven't saved any queries yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
