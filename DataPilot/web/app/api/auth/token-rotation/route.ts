import { createRefreshToken } from "@/libs/auth/refreshToken";
import prisma from "@/libs/db";
import { AuthService } from "@/services/backend/auth.service";
import { NextRequest } from "next/server";
import crypto from 'crypto'
import { createAccessToken } from "@/libs/auth/accessToken";
import { cookies } from "next/headers";
import { AppError } from "@/utils/AppError";

export async function GET(request: NextRequest) {
    try {

        const forwaredFor = request.headers.get('x-forwarded-for')
        const ip = forwaredFor?.split(',')[0].trim() ?? 'Unknown'
        const userAgent = request.headers.get('user-agent') ?? 'Unknown'

        const user = await AuthService.tokenRotation()

        const refreshToken = await createRefreshToken(user.id, user.role)
        const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

        const cookieStore = await cookies()

        cookieStore.set('refreshToken', refreshToken, {
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        })

        const session = await prisma.logout.create(
            {
                data: {
                    userId: user.id,
                    refreshHash,
                    ip,
                    userAgent
                }
            }
        )

        const accessToken = await createAccessToken(user.id, user.role, session.id)

        return Response.json(
            {
                message: "Successful get",
                user,
                accessToken
            },
            {
                status: 200
            }
        )

    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Something Went Wrong"
        const status = err instanceof AppError ? err.statusCode : 500

        return Response.json(
            {
                message
            },
            {
                status
            }
        )
    }
}