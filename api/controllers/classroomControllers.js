import db from "../db.js";

//!DERSLİKLERİ GETİR;
export const getAllClassrooms = (req, res) => {
    const q = "SELECT * FROM classrooms";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
}

//! DERSLİK SİL;
export const deleteClassroom = (req, res) => {
    const classroomID = req.params.id;
    const q = "DELETE FROM classrooms WHERE `classroomID` = ?"
    db.query(q, [classroomID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Derslik Silindi.")
    })
}

//! DERSLİK GÜNCELLE;
export const updateClassroom = (req, res) => {
    const classroomID = req.params.id;
    const { classroomName, classroomType, classCapacity, examCapacity } = req.body;
    const q = "UPDATE classrooms SET classroomName = ?, classroomType = ?, classCapacity = ?, examCapacity = ? WHERE `classroomID` = ?";
    db.query(q, [classroomName, classroomType, classCapacity, examCapacity, classroomID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Derslik Güncellendi.");
    });
};

//! DERSLİK EKLE;
export const addClassroom = (req, res) => {
    const { classroomName, classroomType, classCapacity, examCapacity } = req.body;
    const q = "INSERT INTO classrooms (classroomName, classroomType, classCapacity, examCapacity) VALUES (?, ?, ?, ?);"
    db.query(q, [classroomName, classroomType, classCapacity, examCapacity], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni Derslik Eklendi");
    });
};