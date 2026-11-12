import checkRole from "@/libs/auth/checkrouterole";
import { AuthService } from "@/services/backend/auth.service";
import { AppError } from "@/utils/AppError";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await checkRole(request, ['BUSINESS_ANALYST', 'BUSINESS_OWNER'])

        const user = await AuthService.getUser(request)

        return Response.json(
            {
                message: "Successful get",
                user
            },
            {
                status: 200
            }
        )

    }
    catch (err) {
        const message = err instanceof Error ? err.message : "something Went wrong"
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