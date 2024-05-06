import db from "../db.js";

//! ŞUBELERİ GETİR;
export const getAllBranches = (req, res) => {
    const q = `
        SELECT 
            branches.*, 
            courses.courseName, 
            instructors.instructorFirstName, 
            instructors.instructorLastName, 
            educationtype.educationType, 
            semester.semesterName 
        FROM branches 
        JOIN courses ON branches.fk_courseID = courses.courseID
        JOIN instructors ON branches.fk_instructorID = instructors.instructorID
        JOIN educationtype ON branches.fk_educationID = educationtype.educationID
        JOIN semester ON branches.fk_semesterID = semester.semesterID
    `;
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};


// ! ŞUBE EKLE;
export const addBranch = (req, res) => {
    const { branchName, fk_courseID, fk_instructorID, studentCount, fk_educationID, fk_semesterID } = req.body;
    const q = "INSERT INTO branches (branchName, fk_courseID, fk_instructorID, studentCount, fk_educationID, fk_semesterID) VALUES (?, ?, ?, ?, ?, ?);"
    db.query(q, [branchName, fk_courseID, fk_instructorID, studentCount, fk_educationID, fk_semesterID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Yeni şube eklendi");
    });
};


//! ŞUBE SİL
export const deleteBranch = (req, res) => {
    const branchId = req.params.id;
    const q = "DELETE FROM branches WHERE `branchID` = ?";
    db.query(q, [branchId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Şube Silindi");
    });
};


//! ŞUBE GÜNCELLE
export const updateBranch = (req, res) => {
    const branchId = req.params.id;
    const { branchName, studentCount } = req.body;
    const q = "UPDATE branches SET branchName = ?, studentCount = ? WHERE `branchID` = ?";
    db.query(q, [branchName, studentCount, branchId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Şube güncellendi.");
    });
};
