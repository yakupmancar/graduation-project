import db from "../db.js";

//! DERSLERİ GETİR;
export const getAllCourses = (req, res) => {
    const q = "SELECT * FROM courses";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

//! DERS SİL
export const deleteCourse = (req, res) => {
    const courseId = req.params.id;
    const q = "DELETE FROM courses WHERE `courseID` = ?";
    db.query(q, [courseId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Ders Silindi");
    });
};

//! DERS GÜNCELLE
export const updateCourse = (req, res) => {
    const courseId = req.params.id;
    const { courseCode, courseName, gradeLevel } = req.body;
    const q = "UPDATE courses SET courseCode = ?, courseName = ?, gradeLevel = ? WHERE `courseID` = ?";
    db.query(q, [courseCode, courseName, gradeLevel, courseId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Ders güncellendi.");
    });
};

//! DERS EKLE
export const addCourse = (req, res) => {
    const { courseCode, courseName, gradeLevel } = req.body;
    const q = "INSERT INTO courses (courseCode, courseName, gradeLevel) VALUES (?, ?, ?);"
    db.query(q, [courseCode, courseName, gradeLevel], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni ders eklendi");
    });
};