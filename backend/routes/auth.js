import { Router } from "express";
import loginController from "../controller/login.controller.js";
import registerController from "../controller/register.controller.js";
import logoutController from "../controller/logout.controller.js";
const AuthRouter = Router();

AuthRouter.get("/", (req, res) => {
  res.send("Auth Home");
});
AuthRouter.post("/login", loginController);
AuthRouter.post("/register", registerController);
AuthRouter.post("/logout", logoutController);

export default AuthRouter;