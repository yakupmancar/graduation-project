import express from "express";
import { addCourseCalendar, deleteCourseCalendar, getCourseCalendar, updateCourseCalendar } from "../controllers/courseCalenderControllers.js";

const router = express.Router();

// VEİ GETİR;
router.get("/", getCourseCalendar);

// VERİ EKLE;
router.post("/", addCourseCalendar);

// VERİ SİL;
router.delete("/:id", deleteCourseCalendar);

//VERİ GÜNCELLE;
router.put("/:id", updateCourseCalendar);

export default router;