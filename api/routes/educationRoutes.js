import express from "express";
import { getAllEducations } from "../controllers/educationControllers.js";

const router = express.Router();

//BÜTÜN ŞUBELER;
router.get("/", getAllEducations);

export default router;