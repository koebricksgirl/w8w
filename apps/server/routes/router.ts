import express from "express"
import { signin, signup, verify } from "../controllers/user";
import { authMiddleware } from "../middleware/auth";
import { deleteCredential, getCredentials, postCredentials, updateCredential } from "../controllers/credentials";

const router = express.Router();

router.post("/user/signin",signin);
router.post("/user/signup",signup);
router.get("/user/verify",authMiddleware,verify);


router.post("/credentials/post", authMiddleware, postCredentials);
router.get("/credentials/get", authMiddleware, getCredentials);
router.put("/credentials/update/:credentialId", authMiddleware, updateCredential);
router.delete("/credentials/delete/:credentialId", authMiddleware, deleteCredential);

export default router ;