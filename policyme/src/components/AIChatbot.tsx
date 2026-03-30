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

    const handleSend = async () => {
        if (!input.trim() || isTyping || isComplete) return;

        const userText = input.trim();
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: userText,
            timestamp: new Date(),
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
            
            const reqBody = {
                query: userText,
                chat_history: chatHistory,
                extracted_data: extractedData
            };
            
            const res = await fetch("/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            });
            
            if (!res.ok) throw new Error("Failed to fetch from LLM");
            
            const data = await res.json();
            
            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: "ai",
                content: data.answer || "I'm having trouble processing that right now.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
            
            if (data.extracted_data) {
                const updatedExtracted = { ...extractedData, ...data.extracted_data };
                setExtractedData(updatedExtracted);
                
                // If we have all required fields, mark complete
                if (updatedExtracted.claimType && updatedExtracted.date && updatedExtracted.amount) {
                    setIsComplete(true);
                    onClaimExtracted(updatedExtracted);
                }
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, {
                id: `ai-err-${Date.now()}`,
                role: "ai",
                content: "Sorry, I lost connection to the PolicyMe backend.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
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

