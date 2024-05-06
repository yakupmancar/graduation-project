import express from "express";
import { register, login, logout } from "../controllers/authControllers.js";

const router = express.Router();

//Kullanıcı Kaydı;
router.post("/register", register);

//Kullanıcı Girişi;
router.post("/login", login);

//Kullanııc Çıkışı;
router.post("/logout", logout);

export default router;