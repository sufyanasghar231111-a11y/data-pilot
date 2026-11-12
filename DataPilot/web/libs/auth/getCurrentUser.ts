import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { AuthUser } from "./getAuthUser"
import { redirect } from "next/navigation"

export default async function GetCurrentUser() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
        return
    }

    const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN)
    let payload: AuthUser
    try {
        const result = await jwtVerify<AuthUser>(refreshToken, secret)
        payload = result.payload as AuthUser

    }
    catch (err) {
        console.log(err);
        return
    }

    if (payload.role === 'BUSINESS_OWNER') {
        redirect('/owner/dashboard')
    }

    if (payload.role === 'BUSINESS_ANALYST') {
        redirect('/analyst/dashboard')
    }

}