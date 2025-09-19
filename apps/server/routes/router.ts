import express from "express"
import { signin, signup, verify } from "../controllers/user";
import { authMiddleware } from "../middleware/auth";
import { deleteCredential, getCredentialById, getCredentials, postCredentials, updateCredential } from "../controllers/credentials";
import { createWorkFlow, deleteWorkFlow, getWorkflowById, getWorkflows, runManualWorkflow, updateWorkFlow } from "../controllers/workflow";
import { formClose, formOpen, getForm, getFormResponses, submitForm } from "../controllers/forms";

const router = express.Router();

router.post("/user/signin",signin);
router.post("/user/signup",signup);
router.get("/user/verify",authMiddleware,verify);


router.post("/credentials/post", authMiddleware, postCredentials);
router.get("/credentials/get", authMiddleware, getCredentials);
router.get("/credentials/get/:credentialId",authMiddleware, getCredentialById);
router.put("/credentials/update/:credentialId", authMiddleware, updateCredential);
router.delete("/credentials/delete/:credentialId", authMiddleware, deleteCredential);


router.post("/workflows/post", authMiddleware, createWorkFlow);
router.post("/workflows/manual/run/:workflowId", authMiddleware, runManualWorkflow);
router.get("/workflows/get",authMiddleware, getWorkflows);
router.get("/workflows/get/:workflowId",authMiddleware, getWorkflowById);
router.put("/workflows/update/:workflowId",authMiddleware, updateWorkFlow);
router.delete("/workflows/delete/:workflowId", authMiddleware, deleteWorkFlow);

router.post("/forms/:formId/submit", submitForm);
router.get("/forms/:formId", getForm);
router.get("/forms/:formId/responses",authMiddleware,getFormResponses);
router.patch("/forms/:formId/open", authMiddleware, formOpen);
router.patch("/forms/:formId/close", authMiddleware, formClose);

export default router ;