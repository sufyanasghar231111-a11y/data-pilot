import { Role } from "@/app/generated/prisma/enums";
import getAuthUser from "@/libs/auth/getAuthUser";
import prisma from "@/libs/db";
import { AppError } from "@/utils/AppError";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export class AuthService {
    static async register(username: string, email: string, password: string, role: Role) {

        const alreadyExist = await prisma.user.findFirst(
            {
                where: {
                    OR: [
                        { username },
                        { email }
                    ]
                }
            }
        )

        if (alreadyExist) {
            throw new Error('User is already exist')
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const register = await prisma.user.create(
            {
                data: {
                    username,
                    email,
                    password: hashPassword,
                    role: role
                }
            }
        )

        return register

    }

    static async login(email: string, password: string) {

        if (!email || !password) {
            throw new Error('All field is required')
        }

        const user = await prisma.user.findUnique(
            {
                where: {
                    email
                }
            }
        )

        if (!user) {
            throw new Error('user is not found')
        }

        const hashPassword = await bcrypt.compare(password, user.password)
        if (!hashPassword) {
            throw new Error('Incorrect Password')
        }

        return user

    }

    static async tokenRotation() {
        const cookieStore = await cookies()

        const token = cookieStore.get('refreshToken')?.value

        if (!token) {
            throw new AppError('Token is not Provided', 401)
        }

        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN)

        const { payload } = await jwtVerify(token, secret)

        const user = await prisma.user.findUnique(
            {
                where: {
                    id: payload.userId as string
                }
            }
        )


        if (!user) {
            throw new AppError('User is not found', 404)
        }

        return user

    }

    static async getUser(request: NextRequest) {
        const user = await getAuthUser(request)

        const loginUser = await prisma.user.findUnique(
            {
                where: {
                    id: user.userId
                }
            }
        )

        if (!loginUser) {
            throw new Error('User is not found')
        }

        return loginUser
    }

}