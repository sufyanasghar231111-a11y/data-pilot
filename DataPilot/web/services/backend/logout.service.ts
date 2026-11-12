import prisma from "@/libs/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export class LogoutService {
    static async logout() {
        const cookieStore = await cookies()

        const token = cookieStore.get('refreshToken')?.value
        if (!token) {
            throw new Error('Token is not provided')
        }

        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN)
        const { payload } = await jwtVerify(token, secret)

        const findUser = await prisma.user.findUnique(
            {
                where: {
                    id: payload.userId as string
                }
            }
        )

        if (!findUser) {
            throw new Error('User is not found')
        }

        const logout = await prisma.logout.updateMany(
            {
                where: {
                    userId: findUser.id,
                    revoke: false
                },
                data: {
                    revoke: true
                }
            }
        )

        cookieStore.delete('refreshToken')

        return logout

    }
}