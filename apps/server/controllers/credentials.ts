import prisma from "@w8w/db";
import { credentialsPostSchema, credentialsUpdateSchema } from "@w8w/shared";
import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth";

export const postCredentials = async (req:AuthRequest,res: Response): Promise<void> => {
    try {
        const result = credentialsPostSchema.safeParse(req.body);
          if (!result.success) {
            res.status(400).json({
                message: "Wrong inputs,zod validation failed",
                errors: result.error.issues
            })
            return
        }

        const newCredentials = result.data;

        if(!newCredentials) {
               res.status(404).json({
                message: "Details are not enough"
            })
            return
        }

        const userId = req.userId!;

        const credentials = await prisma.credentials.create({
            data: {
                title: newCredentials.title,
                platform: newCredentials.platform,
                data: newCredentials.data,
                userId
            }
        })

        res.status(200).json({
            message: "Credentials Posted successfully",
            credentials
        })
     return
    } catch (error:any) {
          console.log("Error: ", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return;
    }
}

export const getCredentials = async (req:AuthRequest,res: Response): Promise<void> => {
    try {
        const userId = req.userId!;

        const credentials = await prisma.credentials.findMany({
          where: {
            userId
          }
        })

        res.status(200).json({
            message: "Credentials Posted successfully",
            credentials
        })
     return
    } catch (error:any) {
          console.log("Error: ", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return;
    }
}

export const deleteCredential = async (req:AuthRequest,res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const { credentialId } = req.params;

        if (!credentialId || typeof credentialId !== "string") {
            res.status(400).json({
                message: "Credentials Id has not been provided or is invalid"
            })
            return
        }
        
        const credentials = await prisma.credentials.delete({
          where: {
            userId,
            id: credentialId
          }
        })

        res.status(200).json({
            message: "Credential Deleted successfully",
            credentials
        })
     return
    } catch (error:any) {
          console.log("Error: ", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return;
    }
}


export const updateCredential = async (req:AuthRequest,res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const { credentialId } = req.params;

              const result = credentialsUpdateSchema.safeParse(req.body);
          if (!result.success) {
            res.status(400).json({
                message: "Wrong inputs,zod validation failed",
                errors: result.error.issues
            })
            return
        }

        if (!credentialId || typeof credentialId !== "string") {
            res.status(400).json({
                message: "Credentials Id has not been provided or is invalid"
            })
            return
        }

       const newCredentials = result.data;

        if(!newCredentials) {
               res.status(404).json({
                message: "Details are not enough"
            })
            return
        }
        
        const credentials = await prisma.credentials.update({
          where: {
            userId,
            id: credentialId
          },
          data:{
            title: newCredentials.title,
            platform: newCredentials.platform,
            data: newCredentials.data
          }
        })

        res.status(200).json({
            message: "Credential Updated successfully",
            credentials
        })
     return
    } catch (error:any) {
          console.log("Error: ", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return;
    }
}
