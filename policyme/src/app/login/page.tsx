import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}