import db from "../db.js";

//! KULLANICI BİLGİLERİNİ GETİR;
export const getUser = (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM users WHERE userID=?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data[0]);
    });
};

//! KULLANICI BİLGİLERİNİ GÜNCELLE;
export const updateUser = (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, userName } = req.body;
    const q = "UPDATE users SET firstName = ?, lastName = ?, userName = ? WHERE `userID` = ?";
    db.query(q, [firstName, lastName, userName, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Kullanıcı Güncellendi.");
    });
};


//! KULLANICI SİL
export const deleteUser = (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM users WHERE `userID` = ?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Kullanıcı Silindi.");
    });
};