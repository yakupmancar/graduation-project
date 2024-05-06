import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const salt = 10;


//! KAYIT ATMA (REGİSTER) İŞLEMİ;
export const register = (req, res) => {
    const checkUserQuery = "SELECT * FROM users WHERE userName = ?";
    db.query(checkUserQuery, [req.body.userName], (err, result) => {
        if (err) return res.json("Kullanıcı kontrolünde hata!");
        if (result.length > 0) {
            return res.json("Böyle bir kullanıcı zaten var.");
        } else {
            const q = "INSERT INTO users (`firstName`, `lastName`, `userName`, `password`) VALUES (?);"
            bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
                if (err) return res.json({ Error: "Hash parolasında hata!" })
                const values = [req.body.firstName, req.body.lastName, req.body.userName, hash]
                db.query(q, [values], (err, data) => {
                    if (err) return res.json("Insert işleminde hata!");
                    return res.json("Kayıt başarılı.")
                })
            })
        }
    })
};


//! GİRİŞ (LOGİN) İŞLEMİ;
export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE userName = ?";
    db.query(q, [req.body.userName], (err, data) => {
        if (err) return res.json({ Error: "Giriş işleminde hata!" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.status(500).json({ Error: "Password compare error" });
                if (response) {
                    const user = {
                        userID: data[0].userID,
                        userName: data[0].userName,
                        firstName: data[0].firstName,
                        lastName: data[0].lastName
                    };
                    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
                    res.cookie('token', token, { httpOnly: true });
                    return res.json(user);
                } else {
                    return res.json({ Error: "Parola yanlış!" });
                }
            })
        } else {
            return res.json({ Error: "Böyle bir kullanıcı bulunamadı." });
        }
    })
}


export const logout = (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
}