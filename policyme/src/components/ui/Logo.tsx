import React from "react";

interface LogoProps {
    className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer Shield Segments */}
            {/* Top segment */}
            <path 
                d="M8.5 6 L12 4 L15.5 6" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            
            {/* Right curve */}
            <path 
                d="M17.5 9 Q18.5 12 17.5 15" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
            />
            
            {/* Left curve */}
            <path 
                d="M6.5 9 Q5.5 12 6.5 15" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
            />

            {/* Bottom segments */}
            <path 
                d="M8.5 18 L12 20 L15.5 18" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />

            {/* Inner Connections */}
            <line x1="7.2" y1="8.2" x2="10.8" y2="10.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="16.8" y1="8.2" x2="13.2" y2="10.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="7.2" y1="15.8" x2="10.8" y2="13.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="16.8" y1="15.8" x2="13.2" y2="13.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

            {/* Center Node */}
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
            
            {/* Outer Nodes */}
            <circle cx="6.5" cy="7.5" r="1.8" fill="currentColor" />
            <circle cx="17.5" cy="7.5" r="1.8" fill="currentColor" />
            <circle cx="6.5" cy="16.5" r="1.8" fill="currentColor" />
            <circle cx="17.5" cy="16.5" r="1.8" fill="currentColor" />
        </svg>
    );
}
