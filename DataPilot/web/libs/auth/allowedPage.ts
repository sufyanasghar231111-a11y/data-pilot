import { AuthUser } from "@/types/userType";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function allowedPage(role: 'BUSINESS_ANALYST' | 'BUSINESS_OWNER') {
    const cookieStore = await cookies()

    const token = cookieStore.get('refreshToken')?.value

    if (!token) {
        redirect('/auth/login')
    }

    const secretValue = process.env.REFRESH_TOKEN;

    if (!secretValue) {
        throw new Error("REFRESH_TOKEN is missing");
    }

    try {

        const secret = new TextEncoder().encode(secretValue)
        const { payload } = await jwtVerify<AuthUser>(token, secret)

        if (payload.role !== role) {
            redirect('/auth/login')
        }

        return payload
    }
    catch (error) {
        if (error instanceof Error &&
            'digest' in error &&
            typeof error.digest === 'string' &&
            error.digest.startsWith('NEXT_REDIRECT')
        ) {
            throw error
        }


        redirect('/auth/login')
    }
}