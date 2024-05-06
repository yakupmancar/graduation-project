import db from "../db.js";

//! ÖĞRETİM BİLGİLERİNİ GETİR;
export const getAllEducations = (req, res) => {
    const q = "SELECT * FROM educationtype";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};