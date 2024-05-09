import db from "../db.js";
import bcrypt from "bcryptjs";

const salt = 10;


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


//! Şifre Güncelle;
export const updatePassword = (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const q = "SELECT password FROM users WHERE userID=?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        bcrypt.compare(currentPassword, data[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ Error: "Password compare error" });
            if (isMatch) {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) return res.json({ Error: "Hash password error" });
                    const q = "UPDATE users SET password = ? WHERE userID = ?";
                    db.query(q, [hash, userId], (err, data) => {
                        if (err) return res.status(500).json(err);
                        return res.json("Password Updated.");
                    });
                });
            } else {
                return res.json({ Error: "Current password is incorrect!" });
            }
        });
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