import express from "express";
import { deleteUser, getUser, updateUser, updatePassword } from "../controllers/userControllers.js";

const router = express.Router();

// Kullanıcı Getir;
router.get("/:id", getUser);

// Kullanıcı Bilgilerini Güncelle;
router.put("/:id", updateUser);

// Kullanıcıyı Sil
router.delete("/:id", deleteUser);

router.put("/updatePassword/:id", updatePassword);


export default router