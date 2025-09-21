import  { config } from "@w8w/shared"

export const PORT = config.server.port
export const NODE_ENV = config.server.nodeenv || "dev"
export const JWT_SECRET = config.server.jwtSecret
export const FRONTEND_URL = config.frontend.url || "http://localhost:5173"