import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const instant = false

type AuthUser = {
    role: 'BUSINESS_OWNER' | 'BUSINESS_ANALYST',
    userId: string,
    sessionId: string
}

export default async function DashBoard() {
    const cookieStore = await cookies()

    const token = cookieStore.get('refreshToken')?.value

    if (!token) {
        redirect('/auth/login')
    }

    let payload: AuthUser

    try {
        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN)
        const result = await jwtVerify<AuthUser>(token, secret)
        payload = result.payload
    }
    catch (err) {
        console.log(err);
        redirect('/auth/login')
    }

    if (payload.role === 'BUSINESS_OWNER') {
        redirect('/owner/dashboard')
    }

    if (payload.role === 'BUSINESS_ANALYST') {
        redirect('/analyst/dashboard')
    }

    return redirect('/auth/login')

}