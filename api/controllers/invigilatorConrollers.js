import db from "../db.js";

//! GÖZETMEN ÜYELERİNİ GETİR;
export const getAllInvigilators = (req, res) => {
    const q = "SELECT * FROM invigilators";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

//! GÖZETMEN ÜYESİ SİL
export const deleteInvigilator = (req, res) => {
    const invigilatorId = req.params.id;
    const q = "DELETE FROM invigilators WHERE `invigilatorID` = ?";
    db.query(q, [invigilatorId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Gözetmen Üye Silindi");
    });
};

//! GÖZETMEN ÜYESİ GÜNCELLE
export const updateInvigilator = (req, res) => {
    const invigilatorId = req.params.id;
    const { invigilatorFirstName, invigilatorLastName } = req.body;
    const q = "UPDATE invigilators SET invigilatorFirstName = ?, invigilatorLastName = ? WHERE `invigilatorID` = ?";
    db.query(q, [invigilatorFirstName, invigilatorLastName, invigilatorId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Öğretim Üyesi Güncellendi.");
    });
};

//! GÖZETMEN ÜYESİ EKLE
export const addInvigilator = (req, res) => {
    const { invigilatorFirstName, invigilatorLastName } = req.body;
    const q = "INSERT INTO invigilators (invigilatorFirstName, invigilatorLastName) VALUES (?, ?);"
    db.query(q, [invigilatorFirstName, invigilatorLastName], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni Öğretim Üyesi Eklendi");
    });
};