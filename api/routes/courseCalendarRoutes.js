import express from "express";
import { addCourseCalendar, deleteCourseCalendar, exportExcel, getCourseCalendar, updateCourseCalendar } from "../controllers/courseCalenderControllers.js";

const router = express.Router();

// VERİ GETİR;
router.get("/", getCourseCalendar);

// VERİ EKLE;
router.post("/", addCourseCalendar);

// VERİ SİL;
router.delete("/:id", deleteCourseCalendar);

//VERİ GÜNCELLE;
router.put("/:id", updateCourseCalendar);

// Excel Çıktısı;
router.get("/exportExcel/:educationID", exportExcel);

export default router;