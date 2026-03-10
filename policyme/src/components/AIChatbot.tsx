"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Sparkles, CheckCircle2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
}

interface ExtractedData {
    claimType?: string;
    description?: string;
    amount?: string;
    date?: string;
    location?: string;
}

// Simulated AI responses based on conversation stage
function getAIResponse(userMessage: string, messageCount: number, extracted: ExtractedData): { response: string; newData: Partial<ExtractedData> } {
    const lower = userMessage.toLowerCase();

    // First message — detect claim type
    if (messageCount === 0) {
        let claimType = "";
        let response = "";

        if (lower.includes("car") || lower.includes("accident") || lower.includes("collision") || lower.includes("crash") || lower.includes("vehicle") || lower.includes("drove") || lower.includes("hit")) {
            claimType = "auto-collision";
            response = "I'm sorry to hear about your car accident. 😔 I can help you file this as an **Auto — Collision** claim.\n\nCould you tell me **when** and **where** this happened?";
        } else if (lower.includes("windshield") || lower.includes("hail") || lower.includes("tree") || lower.includes("storm") || lower.includes("weather") || lower.includes("theft") || lower.includes("stolen")) {
            claimType = "auto-comprehensive";
            response = "I understand — that sounds like it falls under **Auto — Comprehensive** coverage (weather/theft).\n\nCan you tell me **when** and **where** this occurred?";
        } else if (lower.includes("house") || lower.includes("home") || lower.includes("pipe") || lower.includes("flood") || lower.includes("water") || lower.includes("fire") || lower.includes("roof")) {
            claimType = "property";
            response = "I'm sorry about the property damage. 🏠 I'll categorize this as a **Property & Casualty** claim.\n\nCan you share **when** this happened and the **location** of the property?";
        } else if (lower.includes("health") || lower.includes("hospital") || lower.includes("medical") || lower.includes("doctor") || lower.includes("injury")) {
            claimType = "health";
            response = "I understand you need to file a **Health / Medical** claim. I'll help with that.\n\nCould you tell me **when** this medical event occurred?";
        } else {
            response = "I'd be happy to help you file a claim! Could you describe **what happened**? For example:\n\n• \"I was in a car accident\"\n• \"My windshield was damaged by hail\"\n• \"There's water damage in my house\"";
            return { response, newData: {} };
        }

        return { response, newData: { claimType, description: userMessage } };
    }

    // Second message — extract date/location
    if (messageCount === 1) {
        let date = "";
        let location = "";

        // Try to extract date-like text
        const dateKeywords = ["yesterday", "today", "last week", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "morning", "evening", "night", "march", "february", "january"];
        for (const kw of dateKeywords) {
            if (lower.includes(kw)) {
                date = kw === "yesterday" ? "March 3, 2026" : kw === "today" ? "March 4, 2026" : "March 2, 2026";
                break;
            }
        }
        if (!date) date = "March 4, 2026";

        // Extract location context
        const locMatch = userMessage.match(/(?:at|near|on|in)\s+(.+?)(?:\.|,|$)/i);
        if (locMatch) location = locMatch[1].trim();
        else location = "Location mentioned in description";

        return {
            response: `Got it — recorded as **${date}**${location ? ` near **${location}**` : ""}.\n\nDo you have an **estimated cost** of the damage? Even a rough guess helps speed up processing.`,
            newData: { date, location }
        };
    }

    // Third message — extract amount
    if (messageCount === 2) {
        let amount = "";
        const amountMatch = userMessage.match(/\$?([\d,]+(?:\.\d{2})?)/);
        if (amountMatch) {
            amount = amountMatch[1].replace(/,/g, "");
        } else if (lower.includes("not sure") || lower.includes("don't know") || lower.includes("no idea")) {
            amount = "TBD";
        } else {
            amount = "2500";
        }

        return {
            response: `Perfect! I've recorded the estimated damage as **$${amount === "TBD" ? "TBD — To be assessed" : Number(amount).toLocaleString()}**.\n\n✅ I have everything I need! Here's what I've captured:\n\n• **Type:** ${extracted.claimType === "auto-collision" ? "Auto — Collision" : extracted.claimType === "auto-comprehensive" ? "Auto — Comprehensive" : extracted.claimType === "property" ? "Property & Casualty" : "Health / Medical"}\n• **Date:** ${extracted.date}\n• **Description:** ${extracted.description}\n• **Estimated Amount:** $${amount === "TBD" ? "TBD" : Number(amount).toLocaleString()}\n\nI'll now **auto-fill your claim form** with these details. You can review and submit it below! 👇`,
            newData: { amount }
        };
    }

    // Fallback
    return {
        response: "Your claim details have been captured! Please review the auto-filled form below and click **Submit** when ready.",
        newData: {}
    };
}

interface AIChatbotProps {
    onClaimExtracted: (data: ExtractedData) => void;
}

export default function AIChatbot({ onClaimExtracted }: AIChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            content: "Hi John! 👋 I'm your **PolicyMe AI Assistant**. I can help you file a claim in seconds.\n\nJust tell me **what happened** in your own words, and I'll take care of the rest!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userMessageCount, setUserMessageCount] = useState(0);
    const [extractedData, setExtractedData] = useState<ExtractedData>({});
    const [isComplete, setIsComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isTyping || isComplete) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const { response, newData } = getAIResponse(input.trim(), userMessageCount, extractedData);
            const newExtracted = { ...extractedData, ...newData };
            setExtractedData(newExtracted);
            setUserMessageCount((c) => c + 1);

            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: "ai",
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);

            // After 3rd user message, claim is complete
            if (userMessageCount >= 2) {
                setIsComplete(true);
                onClaimExtracted(newExtracted);
            }
        }, 1200 + Math.random() * 800);
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ height: "480px" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">PolicyMe AI Claims Assistant</h3>
                    <p className="text-xs text-blue-100">Powered by GraphRAG Intelligence</p>
                </div>
                {isComplete && (
                    <div className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-xs font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Complete
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "ai" && (
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Bot className="h-4 w-4 text-blue-600" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-md"
                                        : "bg-slate-100 text-slate-800 rounded-bl-md"
                                    }`}
                                dangerouslySetInnerHTML={{
                                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                                }}
                            />
                            {msg.role === "user" && (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <User className="h-3.5 w-3.5 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2.5"
                    >
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-slate-400 rounded-full"
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-200 p-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={isComplete ? "Claim details captured ✓" : "Describe what happened..."}
                        disabled={isComplete}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping || isComplete}
                        className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
