import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 115,                 
  standardHeaders: true,   
  legacyHeaders: false,
});
