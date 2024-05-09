import express from "express";
import { addRole, deleteRole, getAllRoles, updateRole } from "../controllers/roleControllers.js";

const router = express.Router();

// BÜTÜN DERSLİKLER;
router.get("/", getAllRoles);


// DERSLİK SİL;
router.delete("/:id", deleteRole);

// DERSLİK GÜNCELLE;
router.put("/:id", updateRole);

// DERSLİK EKLE;
router.post("/", addRole);


export default router;