import express from "express";
import { addSemester, deleteSemester, getAllSemester, updateSemester } from "../controllers/semesterControllers.js";

const router = express.Router();

//Bütün Dönemler;
router.get("/", getAllSemester);

//Dönem Sil;
router.delete("/:id", deleteSemester);

//Dönem Güncelle;
router.put("/:id", updateSemester);

//Dönem Ekle;
router.post("/", addSemester);

export default router;