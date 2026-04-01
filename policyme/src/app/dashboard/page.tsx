import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDefaultRedirect, type AppRole } from "@/config/roles";

export default async function DashboardEntryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
        redirect("/login?callbackUrl=/dashboard");
    }

    const role = session.user.role as AppRole;
    redirect(getDefaultRedirect(role));
}
