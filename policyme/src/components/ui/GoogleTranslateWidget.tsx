"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export function GoogleTranslateWidget() {
    useEffect(() => {
        // Callback for Google Translate Initialization
        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        // Included some common languages relevant for global diverse platforms
                        includedLanguages: "en,es,fr,de,ar,hi,zh-CN,ja,pt,ko,it,ru",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    "google_translate_element"
                );
            }
        };

        // Inject the Google Translate script if it's not already on the page
        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="relative flex items-center h-full">
            <div id="google_translate_element" className="flex items-center"></div>

            {/* Global overrides to hide Google's default visual clutter and style the dropdown */}
            <style jsx global>{`
                /* Hide the Google translate banner at the top of the page */
                body {
                    top: 0 !important;
                }
                .skiptranslate iframe.goog-te-banner-frame {
                    display: none !important;
                }

                /* Hide the "Powered by Google" logo */
                .goog-logo-link {
                    display: none !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                    font-size: 0px !important;
                }

                /* Style the dropdown selector to blend in */
                .goog-te-combo {
                    appearance: none;
                    -webkit-appearance: none;
                    background-color: rgba(255, 255, 255, 0.05);
                    color: inherit;
                    border: 1px solid rgba(100, 116, 139, 0.3); /* slate-500 with opacity */
                    border-radius: 8px;
                    padding: 6px 28px 6px 12px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    outline: none;
                    transition: border-color 0.2s ease;
                    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat: no-repeat;
                    background-position: right 10px top 50%;
                    background-size: 10px auto;
                }
                
                .dark .goog-te-combo {
                    color: #f8fafc;
                    background-color: rgba(255,255,255,0.1);
                }

                .goog-te-combo:focus {
                    border-color: #2563eb; /* blue-600 */
                }
                
                /* Minor adjustments for the widget inner span */
                .goog-te-gadget .goog-te-combo {
                    margin: 0;
                }
                
                /* Tooltip that Google shows on hover */
                #goog-gt-tt {
                    display: none !important;
                }
                .goog-text-highlight {
                    background-color: transparent !important;
                    box-shadow: none !important;
                }
            `}</style>
        </div>
    );
}
