import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--insurai-surface)] font-['Manrope'] selection:bg-[var(--primary)]/10">
            <AdminNavbar />
            <AdminSidebar />
            <div className="lg:ml-64 pt-16 min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
}
