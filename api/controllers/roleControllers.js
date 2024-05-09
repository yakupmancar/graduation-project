import db from "../db.js";

//!DERSLİKLERİ GETİR;
export const getAllRoles = (req, res) => {
    const q = "SELECT * FROM roles";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
}

//! Rol SİL;
export const deleteRole = (req, res) => {
    const roleID = req.params.id;
    const q = "DELETE FROM roles WHERE `roleID` = ?"
    db.query(q, [roleID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Rol Silindi.")
    })
}

//! DERSLİK GÜNCELLE;
export const updateRole = (req, res) => {
    const roleID = req.params.id;
    const { roleName } = req.body;
    const q = "UPDATE roles SET roleName = ? WHERE `roleID` = ?";
    db.query(q, [roleName, roleID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Rol Güncellendi.");
    });
};

//! DERSLİK EKLE;
export const addRole = (req, res) => {
    const { roleName } = req.body;
    const q = "INSERT INTO roles (roleName) VALUES (?);"
    db.query(q, [roleName], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni Rol Eklendi");
    });
};
