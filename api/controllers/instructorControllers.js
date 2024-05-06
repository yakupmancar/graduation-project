import db from "../db.js";

//! ÖĞRETİM ÜYELERİNİ GETİR;
export const getAllInstructors = (req, res) => {
    const q = "SELECT * FROM instructors";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

//! ÖĞRETİM ÜYESİ SİL
export const deleteInstructor = (req, res) => {
    const instructorId = req.params.id;
    const q = "DELETE FROM instructors WHERE `instructorID` = ?";
    db.query(q, [instructorId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Öğretim Üyesi Silindi");
    });
};

//! ÖĞRETİM ÜYESİ GÜNCELLE
export const updateInstructor = (req, res) => {
    const instructorId = req.params.id;
    const { academicTitle, instructorFirstName, instructorLastName } = req.body;
    const q = "UPDATE instructors SET academicTitle = ?, instructorFirstName = ?, instructorLastName = ? WHERE `instructorID` = ?";
    db.query(q, [academicTitle, instructorFirstName, instructorLastName, instructorId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Öğretim Üyesi Güncellendi.");
    });
};

//! ÖĞRETİM ÜYESİ EKLE
export const addInstructor = (req, res) => {
    const { academicTitle, instructorFirstName, instructorLastName } = req.body;
    const q = "INSERT INTO instructors (academicTitle, instructorFirstName, instructorLastName) VALUES (?, ?, ?);"
    db.query(q, [academicTitle, instructorFirstName, instructorLastName], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni Öğretim Üyesi Eklendi");
    });
};