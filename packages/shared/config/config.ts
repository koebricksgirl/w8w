import dotenv from "dotenv"
dotenv.config();

export const config = {
    dbUrl: {
     postgres: {
        url: process.env.DATABASE_URL
     }
    },
    server: {
        port: process.env.PORT || "8000",
        nodeenv: process.env.NODE_ENV || "dev",
        jwtSecret: process.env.JWT_SECRET || "secret"
    },
    redis:{
        url: process.env.REDIS_URL || "redis://localhost:6379"
    }
}
