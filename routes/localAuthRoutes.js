import express from "express";
import localAuthController from "../controllers/localAuthController.js";

const router = express.Router();
//? Rergistering the user
router.post("/register", localAuthController.registerUser);

//? Logging in registerd user
router.post("/login", localAuthController.loginUser);

export default router;
