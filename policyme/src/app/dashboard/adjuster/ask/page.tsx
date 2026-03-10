"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Clock, ChevronRight, FileText, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const recentQueries = [
    "What is the remote work policy?",
    "What is the IT equipment budget?",
    "How many vacation days do I get?",
];

const suggestedActions = [
    { title: "Review updated Travel Policy", date: "Updated 2 days ago" },
    { title: "Complete Q1 Security Training", date: "Due in 5 days" },
];

export default function AdjusterDashboard() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setIsSearching(true);
        setResult(null);

        try {
            const res = await fetch("/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setResult({ answer: `Error: ${data.error}`, citations: [], confidence: 0 });
            }
        } catch (error) {
            setResult({ answer: "Failed to connect to AI engine.", citations: [], confidence: 0 });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Good afternoon.</h1>
                <p className="text-muted-foreground text-lg">What policy can I help you find today?</p>
            </div>

            <div className="relative mb-12 group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 blur-lg opacity-40 transition-all group-focus-within:opacity-100 group-focus-within:duration-500" />
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <Search className="absolute left-6 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask PolicyMe anything..."
                        className="h-16 w-full rounded-full border-border/50 bg-background/50 pl-14 pr-32 text-lg shadow-sm backdrop-blur-sm transition-all focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                    <Button
                        type="submit"
                        disabled={!query}
                        className="absolute right-2 h-12 rounded-full px-6 bg-primary hover:bg-primary/90 transition-all font-medium"
                    >
                        {isSearching ? <Sparkles className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                </form>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                <Sparkles className="h-4 w-4" />
                                AI Answer
                            </div>
                            <div className={`px-2 py-1 text-xs font-bold rounded-md ${result.confidence >= 0.85 ? "bg-green-500/20 text-green-500" :
                                    result.confidence >= 0.5 ? "bg-yellow-500/20 text-yellow-500" :
                                        "bg-red-500/20 text-red-500"
                                }`}>
                                {Math.round(result.confidence * 100)}% Confidence
                            </div>
                        </div>
                        <p className="text-lg leading-relaxed mb-6">{result.answer}</p>

                        {result.citations && result.citations.length > 0 && (
                            <div className="pt-4 border-t border-border/50">
                                <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Citations (Micro-Graph View)</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.citations.map((cite: any, i: number) => (
                                        <div key={i} className="inline-flex flex-col rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm hover:bg-primary/10 transition-colors cursor-pointer text-primary">
                                            <span className="font-bold">[{cite.id}]</span>
                                            <span className="text-muted-foreground text-xs mt-1 truncate max-w-sm">{cite.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        Recent Queries
                    </div>
                    <div className="space-y-2">
                        {recentQueries.map((q, i) => (
                            <div key={i} onClick={() => setQuery(q)} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-border hover:bg-card hover:shadow-sm transition-all cursor-pointer text-sm">
                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate font-medium">{q}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Shield className="mr-2 h-4 w-4" />
                        Suggested Actions
                    </div>
                    <div className="space-y-3">
                        {suggestedActions.map((action, i) => (
                            <div key={i} className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer shadow-sm">
                                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                                    <FileText className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">{action.title}</p>
                                    <p className="text-xs text-muted-foreground">{action.date}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
