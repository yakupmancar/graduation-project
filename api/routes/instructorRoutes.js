import express from "express";
import { addInstructor, deleteInstructor, getAllInstructors, updateInstructor } from "../controllers/instructorControllers.js";

const router = express.Router();

//Bütün Öğretim Üyeleri;
router.get("/", getAllInstructors);

//Öğretim Üyesi Sil;
router.delete("/:id", deleteInstructor );

//Öğretim Üyesi Güncelle;
router.put("/:id", updateInstructor);

//Öğretim Üyesi Ekle;
router.post("/", addInstructor);

export default router;