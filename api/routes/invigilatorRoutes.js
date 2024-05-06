import express from "express";
import { addInvigilator, deleteInvigilator, getAllInvigilators, updateInvigilator } from "../controllers/invigilatorConrollers.js";

const router = express.Router();

//Bütün Gözetmen Üyeler;
router.get("/", getAllInvigilators);

//Gözetmen Üyesi Sil;
router.delete("/:id", deleteInvigilator);

//Gözetmen Üyesi Güncelle;
router.put("/:id", updateInvigilator);

//Gözetmen Üyesi Ekle;
router.post("/", addInvigilator);

export default router;