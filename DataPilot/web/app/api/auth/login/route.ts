import { createRefreshToken } from "@/libs/auth/refreshToken";
import prisma from "@/libs/db";
import { AuthService } from "@/services/backend/auth.service";
import { NextRequest } from "next/server";
import crypto from 'crypto'
import { cookies } from "next/headers";
import { createAccessToken } from "@/libs/auth/accessToken";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const forwardedFor = request.headers.get('x-forwarded-for')
        const ip = forwardedFor?.split(',')[0].trim() ?? "Unknown"

        const userAgent = request.headers.get('user-agent') ?? 'Unknown'


        const user = await AuthService.login(
            body.email,
            body.password
        )

        const refreshToken = await createRefreshToken(user.id, user.role)
        const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

        const session = await prisma.logout.create(
            {
                data: {
                    userId: user.id,
                    ip,
                    userAgent,
                    refreshHash
                }
            }
        )

        const accessToken = await createAccessToken(user.id, user.role, session.id)

        const cookieStore = await cookies()
        cookieStore.set('refreshToken', refreshToken, {
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        })


        return Response.json(
            {
                message: "successful register",
                user,
                accessToken
            },
            {
                status: 200
            }
        )
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Something thing Wrong"
        return Response.json(
            {
                message
            },
            {
                status: 500
            }
        )
    }
}