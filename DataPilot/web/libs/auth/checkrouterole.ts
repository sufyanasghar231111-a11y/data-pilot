import { NextRequest } from "next/server";
import getAuthUser from "./getAuthUser";
import { AppError } from "@/utils/AppError";

type Role = 'BUSINESS_ANALYST' | 'BUSINESS_OWNER'

export default async function checkRole(request: NextRequest, roles: Role | Role[]) {
    const user = await getAuthUser(request)

    if (!user) {
        throw new AppError('Unauthorized', 401)
    }

    const isAllowed = Array.isArray(roles) ? roles : [roles]

    if (!isAllowed.includes(user.role)) {
        throw new AppError('Forbidden', 403)
    }

    return user

}