import express from "express";
import { addExamCalendar, deleteExamCalendar, getExamCalendar, updateExamCalendar } from "../controllers/examCalendarControllers.js";

const router = express.Router()

// VERİ GETİR;
router.get("/", getExamCalendar);

// VERİ EKLE
router.post("/", addExamCalendar);

// VERİ SİL
router.delete("/:id", deleteExamCalendar);

// VERİ GÜNCELLE
router.put("/:id", updateExamCalendar);

export default router;

