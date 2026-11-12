import allowedPage from "@/libs/auth/allowedPage";
import { ReactNode } from "react";
export const instant = false
export default async function Layout({ children }: { children: ReactNode }) {
    await allowedPage('BUSINESS_OWNER')
    return (
        <div>
            {children}
        </div>
    )
}