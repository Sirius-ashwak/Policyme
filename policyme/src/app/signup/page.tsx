import { Suspense } from "react";
import SignUpPageContent from "./SignUpPageContent";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
                <Loader2 className="h-6 w-6 animate-spin text-[#86868b]" />
            </div>
        }>
            <SignUpPageContent />
        </Suspense>
    );
}
