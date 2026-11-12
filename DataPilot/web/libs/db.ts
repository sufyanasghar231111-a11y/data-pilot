import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@/app/generated/prisma/client"


const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DataBase url is not provided')
}

const adapter = new PrismaNeon({
    connectionString
})

const prisma = new PrismaClient({
    adapter
})

export default prisma