"use client";

export default function SettingsPage() {
    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight font-[Manrope] mb-2">Security Settings</h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl leading-relaxed">
                    Manage your account security, privacy preferences, and notification settings.
                </p>
            </header>

            <div className="space-y-6 max-w-2xl">
                {[
                    { icon: "lock", title: "Password", desc: "Last changed 30 days ago", action: "Update" },
                    { icon: "security", title: "Two-Factor Authentication", desc: "Enabled via Authenticator App", action: "Manage" },
                    { icon: "notifications", title: "Notification Preferences", desc: "Email & SMS alerts active", action: "Configure" },
                    { icon: "visibility", title: "Privacy Settings", desc: "Data sharing preferences", action: "Review" },
                ].map((item) => (
                    <div key={item.title} className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[var(--insurai-surface-container-low)] rounded-xl flex items-center justify-center text-[var(--insurai-on-surface-variant)]">
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{item.title}</h3>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">{item.desc}</p>
                            </div>
                        </div>
                        <button className="text-sm text-[var(--primary)] font-semibold hover:underline">{item.action}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
