import express from "express";
import { getAllCourses, deleteCourse, updateCourse, addCourse } from "../controllers/courseControllers.js";

const router = express.Router();

//Bütün dersler;
router.get("/", getAllCourses);

//Ders Sil;
router.delete("/:id", deleteCourse);

//Ders Güncelle;
router.put("/:id", updateCourse);

//Ders Ekle;
router.post("/", addCourse);

export default router;