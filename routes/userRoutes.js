import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", userController.renderHome);

router.get("/login", userController.renderLogin);

router.get("/register", userController.renderRegister);

router.get("/secrets", userController.renderSecrets);

router.get("/createSecret", userController.renderCreateSecret);

router.get("/logout", userController.logoutUser);

//.
//? Submitting new secret
router.post("/createSecret", userController.createSecret);

export default router;
