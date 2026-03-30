"use client";

import { useState, useEffect, useRef } from "react";

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
];

const suggestedQueries = [
    "Summarize my Home coverage",
    "What's the status of my latest claim?",
    "Explain my auto policy deductible",
    "When is my next premium due?",
    "How do I file a new claim?",
    "Am I covered for flood damage?",
];

export function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentLang, setCurrentLang] = useState(languages[0]);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [showTranscript, setShowTranscript] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const orbPhaseRef = useRef(0);

    // Orb animation (inspired by ChatGPT/Gemini voice orb)
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 320 * dpr;
        canvas.height = 320 * dpr;
        ctx.scale(dpr, dpr);

        const drawOrb = () => {
            ctx.clearRect(0, 0, 320, 320);
            orbPhaseRef.current += 0.02;
            const phase = orbPhaseRef.current;
            const cx = 160;
            const cy = 160;
            const baseRadius = isListening ? 90 : 70;
            const intensity = isListening ? 1.0 : 0.4;

            // Outer glow
            const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, baseRadius * 2);
            glowGrad.addColorStop(0, `rgba(21, 106, 255, ${0.15 * intensity})`);
            glowGrad.addColorStop(0.5, `rgba(21, 106, 255, ${0.05 * intensity})`);
            glowGrad.addColorStop(1, "rgba(21, 106, 255, 0)");
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, 320, 320);

            // Draw layered organic blobs
            for (let layer = 3; layer >= 0; layer--) {
                const layerRadius = baseRadius - layer * (isListening ? 8 : 6);
                const alpha = 0.15 + layer * 0.2;
                const speed = 1 + layer * 0.3;
                const wobble = isListening ? 12 + layer * 4 : 4 + layer * 2;

                ctx.beginPath();
                for (let a = 0; a < Math.PI * 2; a += 0.02) {
                    const n1 = Math.sin(a * 3 + phase * speed) * wobble;
                    const n2 = Math.cos(a * 5 - phase * speed * 0.7) * wobble * 0.6;
                    const n3 = Math.sin(a * 7 + phase * speed * 1.3) * wobble * 0.3;
                    const r = layerRadius + n1 + n2 + n3;
                    const x = cx + Math.cos(a) * r;
                    const y = cy + Math.sin(a) * r;
                    if (a === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();

                const grad = ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, layerRadius + wobble);
                if (layer === 0) {
                    grad.addColorStop(0, `rgba(100, 160, 255, ${alpha})`);
                    grad.addColorStop(1, `rgba(21, 106, 255, ${alpha * 0.7})`);
                } else if (layer === 1) {
                    grad.addColorStop(0, `rgba(60, 130, 255, ${alpha})`);
                    grad.addColorStop(1, `rgba(0, 82, 209, ${alpha * 0.8})`);
                } else if (layer === 2) {
                    grad.addColorStop(0, `rgba(130, 180, 255, ${alpha})`);
                    grad.addColorStop(1, `rgba(21, 106, 255, ${alpha * 0.5})`);
                } else {
                    grad.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.8})`);
                    grad.addColorStop(1, `rgba(100, 160, 255, ${alpha * 0.5})`);
                }

                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Inner bright core
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.5);
            coreGrad.addColorStop(0, `rgba(255, 255, 255, ${isListening ? 0.5 : 0.3})`);
            coreGrad.addColorStop(0.5, `rgba(150, 200, 255, ${isListening ? 0.2 : 0.1})`);
            coreGrad.addColorStop(1, "rgba(21, 106, 255, 0)");
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, baseRadius * 0.5, 0, Math.PI * 2);
            ctx.fill();

            animationRef.current = requestAnimationFrame(drawOrb);
        };

        drawOrb();
        return () => cancelAnimationFrame(animationRef.current);
    }, [isOpen, isListening]);

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            setTranscript("What's covered under my auto policy deductible?");
            setResponse(
                "Your Tesla Model 3 auto policy (AU-82910-XM) has a $500 deductible for collision and a $250 deductible for comprehensive coverage. This means you'll pay the first $500 for collision-related repairs before insurance covers the rest."
            );
            setShowTranscript(true);
        } else {
            setIsListening(true);
            setTranscript("");
            setResponse("");
            setShowTranscript(false);
        }
    };

    const handleQueryClick = (query: string) => {
        setTranscript(query);
        setResponse(
            "Let me look that up for you... Based on your policy documents, I've found the relevant information. Your coverage details are being retrieved from our GraphRAG knowledge base."
        );
        setShowTranscript(true);
        setIsListening(false);
    };

    return (
        <>
            {/* ===== FLOATING ACTION BUTTON ===== */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-full primary-gradient text-white shadow-2xl shadow-blue-500/30 flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-blue-500/50 active:scale-95 group ${
                    isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
                }`}
                aria-label="Open AI Voice Assistant"
            >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-[var(--primary)] animate-ping opacity-20" />
                <span className="material-symbols-outlined text-2xl relative z-10">mic</span>
            </button>

            {/* ===== FULLSCREEN VOICE OVERLAY ===== */}
            <div
                className={`fixed inset-0 z-[100] transition-all duration-500 ${
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0d1528] to-[#060a14]" />

                {/* Ambient particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full blur-3xl opacity-10"
                            style={{
                                width: `${150 + i * 80}px`,
                                height: `${150 + i * 80}px`,
                                background: `radial-gradient(circle, rgba(21, 106, 255, 0.4), transparent)`,
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                                animation: `float-particle ${6 + i * 2}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Top Bar */}
                    <header className="flex items-center justify-between px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm">InsurAI Voice</h2>
                                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest font-[Inter]">
                                    {isListening ? "Listening..." : "Ready"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangPicker(!showLangPicker)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-all"
                                >
                                    <span className="text-lg">{currentLang.flag}</span>
                                    <span className="font-medium">{currentLang.name}</span>
                                    <span className="material-symbols-outlined text-sm text-blue-400">expand_more</span>
                                </button>

                                {showLangPicker && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-[#131b2e] border border-white/10 rounded-2xl p-2 shadow-2xl max-h-80 overflow-y-auto">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setCurrentLang(lang);
                                                    setShowLangPicker(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all ${
                                                    currentLang.code === lang.code
                                                        ? "bg-blue-600/20 text-blue-400"
                                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                                }`}
                                            >
                                                <span className="text-xl">{lang.flag}</span>
                                                <span className="font-medium">{lang.name}</span>
                                                {currentLang.code === lang.code && (
                                                    <span className="material-symbols-outlined text-blue-400 ml-auto text-sm">check</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Close */}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsListening(false);
                                    setShowLangPicker(false);
                                    setShowTranscript(false);
                                    setTranscript("");
                                    setResponse("");
                                }}
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white transition-all"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </header>

                    {/* Center: Orb + State */}
                    <div className="flex-1 flex flex-col items-center justify-center px-8">
                        {/* Orb Canvas */}
                        <div
                            className={`relative transition-all duration-700 ${
                                showTranscript ? "scale-75 -translate-y-8" : "scale-100"
                            }`}
                        >
                            <canvas
                                ref={canvasRef}
                                className="w-[320px] h-[320px]"
                                style={{ width: 320, height: 320 }}
                            />

                            {/* Center mic icon */}
                            <button
                                onClick={toggleListening}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isListening
                                        ? "bg-white/20 backdrop-blur-sm scale-110"
                                        : "bg-white/10 hover:bg-white/15"
                                }`}>
                                    <span className={`material-symbols-outlined text-white text-3xl transition-all ${
                                        isListening ? "text-4xl" : ""
                                    }`}>
                                        {isListening ? "graphic_eq" : "mic"}
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* Status text */}
                        <p className={`text-white/50 text-sm font-medium mt-2 transition-all duration-500 ${
                            showTranscript ? "opacity-0 -translate-y-4" : "opacity-100"
                        }`}>
                            {isListening
                                ? "I'm listening... speak now"
                                : "Tap the orb to start speaking"}
                        </p>

                        {/* Transcript & Response */}
                        {showTranscript && (
                            <div className="w-full max-w-lg mt-4 animate-fade-in space-y-4">
                                {/* User message */}
                                <div className="flex justify-end">
                                    <div className="bg-blue-600/20 border border-blue-500/20 rounded-2xl rounded-br-md px-5 py-3 max-w-[85%]">
                                        <p className="text-white text-sm">{transcript}</p>
                                    </div>
                                </div>
                                {/* AI Response */}
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-5 py-3 max-w-[85%]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-5 h-5 primary-gradient rounded-md flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-[10px]">smart_toy</span>
                                            </div>
                                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest font-[Inter]">InsurAI</span>
                                        </div>
                                        <p className="text-white/80 text-sm leading-relaxed">{response}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom: Suggestions + Controls */}
                    <footer className="px-8 pb-8">
                        {!showTranscript && !isListening && (
                            <div className="max-w-2xl mx-auto mb-6">
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest font-[Inter] mb-3 text-center">
                                    Try asking
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {suggestedQueries.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleQueryClick(q)}
                                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl text-white/70 hover:text-white text-sm transition-all"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bottom controls */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={toggleListening}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isListening
                                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                                        : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isListening ? "stop" : "mic"}
                                </span>
                            </button>

                            <button className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined text-xl">keyboard</span>
                            </button>
                        </div>

                        <p className="text-white/20 text-[10px] text-center mt-4 font-[Inter]">
                            GraphRAG-powered • End-to-end encrypted • {currentLang.name}
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}
