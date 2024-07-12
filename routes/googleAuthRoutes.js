import express from "express";
import googleAuthController from "../controllers/googleAuthController.js";

const router = express.Router();

// ? Routing for google authentication for login/ register
router.get("/auth/google", googleAuthController.googleAuth);

//.
//? Routing for login after authentication
router.get("/auth/google/secrets", googleAuthController.googleAuthCallback);

export default router;
