import express from "express";
import { addBranch, deleteBranch, getAllBranches, updateBranch } from "../controllers/branchControllers.js";

const router = express.Router();

//BÜTÜN ŞUBELER;
router.get("/", getAllBranches);

//ŞUBE SİL
router.delete("/:id", deleteBranch);

//ŞUBE EKLE;
router.post("/", addBranch);

//ŞUBE GÜNCELLEME;
router.put("/:id", updateBranch);

export default router;