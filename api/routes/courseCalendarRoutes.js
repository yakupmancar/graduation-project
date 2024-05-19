import express from "express";
import { addCourseCalendar, deleteCourseCalendar, getCourseCalendar } from "../controllers/courseCalenderControllers.js";

const router = express.Router();

// Verileri Getir;
router.get("/", getCourseCalendar);

// Veri Ekle;
router.post("/", addCourseCalendar);

//Veri Sil;
router.delete("/:id", deleteCourseCalendar)

export default router;