import checkRole from "@/libs/auth/checkrouterole";
import { LogoutService } from "@/services/backend/logout.service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // await checkRole(request, ['BUSINESS_ANALYST', 'BUSINESS_OWNER'])
        const logout = await LogoutService.logout()

        return Response.json(
            {
                message: 'successful get',
                logout
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