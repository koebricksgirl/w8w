import prisma from "@w8w/db";
import type { Request, Response } from "express";
import { enqueueExecution } from "../redis/enqueue";
import type { AuthRequest } from "../middleware/auth";


export const submitForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        if (!formId) return res.status(404).json({
            message: "No form Id provided"
        })

        const form = await prisma.form.findUnique({ where: { id: formId }, include: { workflow: true } });
        if (!form) return res.status(404).json({ message: "Form is Invalid" });
        if (!form.isActive) return res.status(400).json({ message: "Form is not active anymore" });

        const fieldsArray = Array.isArray(form.fields) ? form.fields : [];

        const missingFields = fieldsArray
            .filter((f: any) => f.required && !req.body[f.key])
            .map((f: any) => f.label);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                missingFields,
            });
        }

        const response = await prisma.formResponse.create({
            data: {
                formId,
                data: req.body,
                ip: req.ip,
                userAgent: req.headers["user-agent"] || ""
            }
        });

        const execution = await prisma.execution.create({
            data: {
                workflowId: form.workflowId,
                totalTasks: Object.keys(form.workflow.nodes as object).length,
                output: { triggerPayload: req.body },
                formResponse: { connect: { id: response.id } }
            }
        })

        await enqueueExecution(execution.id, form.workflowId, req.body);

        return res.status(200).json({
            message: "Form Submitted",
            responseId: response.id,
            executionId: execution.id
        })
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const { formSecret } = req.query;

        if (!formId) {
            return res.status(401).json({
                message: "No formId passed on parameters"
            })
        }

        const form = await prisma.form.findUnique({
            where: {
                id: formId
            }
        });

        if (!form) {
            return res.status(404).json({
                message: "Form is invalid"
            })
        }

        if (!form.isActive) {
            return res.status(200).json({
                form: { message: "The form is closed", isActive: false }
            });
        }


        if (form.secret && !formSecret) {
            return res.status(201).json({
                message: "Access it via form secret"
            })
        }

        if (form.secret && formSecret && form.secret !== formSecret) {
            return res.status(403).json({
                message: "wrong password, please enter correct password"
            })
        }

        return res.status(200).json({
            form
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getFormResponses = async (req: AuthRequest, res: Response) => {
    try {
        const { formId } = req.params;
        const userId = req.userId!;

        if (!formId) {
            return res.status(400).json({
                message: "No formId provided"
            })
        }

        const formExists = await prisma.form.findUnique({
            where: {
                id: formId
            }
        })

        if (!formExists) {
            return res.status(401).json({
                message: "Form is Invalid"
            })
        }

        if (formExists.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to view this form's responses"
            })
        }

        const formResponses = await prisma.formResponse.findMany({
            where: {
                formId
            }
        })

        return res.status(200).json({
            formResponses
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const formOpen = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { formId } = req.params;

        const formExists = await prisma.form.findUnique({
            where: {
                id: formId
            }
        });

        if (!formExists) {
            return res.status(404).json({
                message: "Form is invalid"
            })
        }

        if (formExists.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            })
        }

        if (formExists.isActive) {
            return res.status(400).json({
                message: "Form is already opened you can only close it"
            })
        }

        const formOpen = await prisma.form.update({
            where: {
                id: formId
            },
            data: {
                isActive: true
            }
        })

        return res.status(200).json({
            message: "Form has been opened successfully",
            formOpen
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const formClose = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { formId } = req.params;

        const formExists = await prisma.form.findUnique({
            where: {
                id: formId
            }
        });

        if (!formExists) {
            return res.status(404).json({
                message: "Form is invalid"
            })
        }

        if (formExists.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            })
        }

        if (!formExists.isActive) {
            return res.status(400).json({
                message: "Form is already closed you can only open it"
            })
        }

        const formClose = await prisma.form.update({
            where: {
                id: formId
            },
            data: {
                isActive: false
            }
        })

        return res.status(200).json({
            message: "Form has been closed successfully",
            formClose
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const updateFormSecret = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const { formId } = req.params;
        const { secret } = req.body;

        if (!formId) {
            return res.status(400).json({
                message: "No form id passed through parameters"
            })
        }

        if (!secret || typeof secret !== "string") {
            return res.status(400).json({
                message: "Secret must be a string"
            });
        }

        const form = await prisma.form.findUnique({
            where: { id: formId },
            include: { workflow: true }
        });

        if (!form) {
            return res.status(404).json({ message: "Form Doesn't exists" });
        }

        if (form.userId !== userId) {
            return res.status(403).json({ message: "Not allowed to update this form" });
        }

        const updated = await prisma.form.update({
            where: { id: formId },
            data: { secret: secret || null },
        });

        return res.status(200).json({ message: "Form secret updated", form: updated });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
