import express from "express";
import localAuthController from "../controllers/localAuthController.js";

const router = express.Router();

router.post("/register", localAuthController.registerUser);
router.post("/login", localAuthController.loginUser);

export default router;
