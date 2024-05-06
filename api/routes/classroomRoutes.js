import express from "express";
import { addClassroom, deleteClassroom, getAllClassrooms, updateClassroom } from "../controllers/classroomControllers.js";

const router = express.Router();

// BÜTÜN DERSLİKLER;
router.get("/", getAllClassrooms);

// DERSLİK SİL;
router.delete("/:id", deleteClassroom);

// DERSLİK GÜNCELLE;
router.put("/:id", updateClassroom);

// DERSLİK EKLE;
router.post("/", addClassroom);

export default router;