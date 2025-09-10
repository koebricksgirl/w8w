import express from "express"
import { signin, signup, verify } from "../controllers/user";
import { authMiddleware } from "../middleware/auth";
import { deleteCredential, getCredentials, postCredentials, updateCredential } from "../controllers/credentials";
import { createWorkFlow, deleteWorkFlow, getWorkflows, runManualWorkflow, updateWorkFlow } from "../controllers/workflow";

const router = express.Router();

router.post("/user/signin",signin);
router.post("/user/signup",signup);
router.get("/user/verify",authMiddleware,verify);


router.post("/credentials/post", authMiddleware, postCredentials);
router.get("/credentials/get", authMiddleware, getCredentials);
router.put("/credentials/update/:credentialId", authMiddleware, updateCredential);
router.delete("/credentials/delete/:credentialId", authMiddleware, deleteCredential);


router.post("/workflows/post", authMiddleware, createWorkFlow);
router.post("/workflows/manual/run/:workflowId", authMiddleware, runManualWorkflow);
router.get("/workflows/get",authMiddleware, getWorkflows);
router.put("/workflows/update/:workflowId",authMiddleware, updateWorkFlow);
router.delete("/workflows/delete/:workflowId", authMiddleware, deleteWorkFlow);

export default router ;