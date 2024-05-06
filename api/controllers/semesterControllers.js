import db from "../db.js";

//! DÖNEMLERİ GETİR;
export const getAllSemester = (req, res) => {
    const q = "SELECT * FROM semester";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

//! DÖNEM SİL
export const deleteSemester = (req, res) => {
    const semesterId = req.params.id;
    const q = "DELETE FROM semester WHERE `semesterID` = ?";
    db.query(q, [semesterId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Dönem Silindi");
    });
};

//! DÖNEM GÜNCELLE
export const updateSemester = (req, res) => {
    const semesterId = req.params.id;
    const { semesterName } = req.body;
    const q = "UPDATE semester SET semesterName = ? WHERE `semesterID` = ?";
    db.query(q, [semesterName, semesterId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Dönem Güncellendi.");
    });
};

//! DÖNEM EKLE
export const addSemester = (req, res) => {
    const { semesterName } = req.body;
    const q = "INSERT INTO semester (semesterName) VALUES (?);"
    db.query(q, [semesterName], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni Dönem Eklendi");
    });
};