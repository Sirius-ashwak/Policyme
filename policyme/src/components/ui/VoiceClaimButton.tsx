"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, CheckCircle, AlertCircle, Globe } from "lucide-react";

type VoiceState = "idle" | "listening" | "processing" | "success" | "error";

interface ClaimResult {
  approved: boolean;
  citation: string;
  internal_reasoning_en: string;
  customer_response: string;
  is_mock?: boolean;
}

const LANGUAGES = [
  { name: "Tamil", code: "ta-IN" },
  { name: "Hindi", code: "hi-IN" },
  { name: "Telugu", code: "te-IN" },
  { name: "English", code: "en-IN" },
];

export function VoiceClaimButton() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      setResult(null);
      setShowLangMenu(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to turn off the microphone light
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setVoiceState("listening");

    } catch (error) {
      console.error("Error accessing microphone:", error);
      setVoiceState("error");
      setTimeout(() => setVoiceState("idle"), 3000);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setVoiceState("processing");

    const formData = new FormData();
    formData.append("audio", audioBlob, "claim_audio.webm");
    formData.append("customer_name", "Ramesh");
    formData.append("target_language", language.name);

    try {
      const response = await fetch("http://localhost:8000/api/voice-claim", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error during voice analysis");
      }

      const data: ClaimResult = await response.json();
      setResult(data);
      setVoiceState("success");

      // Playback response using Web Speech Synthesis API in chosen language
      speakLanguage(data.customer_response, language.code);

      setTimeout(() => setVoiceState("idle"), 8000); // Reset after 8 seconds

    } catch (error) {
      console.error("Failed to process voice claim:", error);
      setVoiceState("error");
      setTimeout(() => setVoiceState("idle"), 3000);
    }
  };

  const speakLanguage = (text: string, langCode: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode; 
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported in this browser.");
    }
  };

  return (
    <div className="flex flex-col items-end justify-center space-y-4 font-sans relative">
      <AnimatePresence>
        {/* Language Selection Menu Row */}
        {voiceState === "idle" && showLangMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex flex-col space-y-1 mb-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 right-0"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang);
                  setShowLangMenu(false);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-left transition-colors ${
                  language.name === lang.name
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-3">
        {/* Mini Language Toggle Button */}
        <AnimatePresence>
          {voiceState === "idle" && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{language.name}</span>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative flex items-center justify-center">
          {/* Pulsing ring effect when listening */}
          {voiceState === "listening" && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute h-20 w-20 rounded-full bg-blue-500/30"
            />
          )}
          
          {/* Main interactive button */}
          <motion.button
            onClick={voiceState === "idle" ? handleStartRecording : handleStopRecording}
            disabled={voiceState === "processing" || voiceState === "success" || voiceState === "error"}
            whileHover={{ scale: voiceState === "idle" ? 1.05 : 1 }}
            whileTap={{ scale: voiceState === "idle" ? 0.95 : 1 }}
            className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
              voiceState === "idle"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : voiceState === "listening"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : voiceState === "processing"
                ? "bg-indigo-600 text-white"
                : voiceState === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-600 text-white"
            }`}
            aria-label="Voice Claim Record Button"
          >
            <AnimatePresence mode="wait">
              {voiceState === "idle" && (
                <motion.div key="mic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Mic className="h-7 w-7" />
                </motion.div>
              )}
              {voiceState === "listening" && (
                <motion.div key="square" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Square className="h-6 w-6 " fill="currentColor" />
                </motion.div>
              )}
              {voiceState === "processing" && (
                <motion.div key="loader" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} exit={{ opacity: 0 }}>
                  <Loader2 className="h-7 w-7" />
                </motion.div>
              )}
              {voiceState === "success" && (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ opacity: 0 }}>
                  <CheckCircle className="h-7 w-7" />
                </motion.div>
              )}
              {voiceState === "error" && (
                <motion.div key="alert" initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ opacity: 0 }}>
                  <AlertCircle className="h-7 w-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Status or Result Overlay */}
      <AnimatePresence>
        {result && voiceState === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute bottom-full right-0 mb-6 w-80 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
              result.approved 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-100" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-100"
            }`}
            style={{ transformOrigin: "bottom right" }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-sm">
                {result.approved ? "Coverage Accepted" : "Coverage Denied"}
              </span>
              <span className="text-xs opacity-70 border px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                {result.citation}
              </span>
            </div>
            
            <p className="text-xs opacity-80 italic mb-3 border-l-2 pl-2 border-current">
              {result.internal_reasoning_en}
            </p>
            
            <div className="text-sm font-medium pt-3 border-t border-current/20">
              <span className="text-xs block opacity-60 mb-1">{language.name} Response:</span>
              {result.customer_response}
            </div>
            
            {result.is_mock && (
              <span className="absolute -top-3 -right-2 text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                Mock Mode
              </span>
            )}
          </motion.div>
        )}

        {voiceState === "listening" && (
           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium text-red-500 animate-pulse absolute bottom-full right-2 mb-4 whitespace-nowrap">
             Listening ({language.name})...
           </motion.p>
        )}
        
        {voiceState === "processing" && (
           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium text-indigo-500 animate-pulse absolute bottom-full right-2 mb-4 whitespace-nowrap">
             Translating & Analyzing claim...
           </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
